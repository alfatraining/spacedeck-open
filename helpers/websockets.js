"use strict";

const db = require("../models/db");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const config = require("config");

const WebSocketServer = require("ws").Server;
const nats = require("./nats");
const { StringCodec } = require("nats");
const _ = require("underscore");
const crypto = require("crypto");
const get = require("lodash/get");

const sc = StringCodec();

const onMessageListenerArtifacts = async (rawMessage, websockets) => {
  const msg = JSON.parse(rawMessage);
  const spaceId = msg.space_id;

  if (
    (msg.action === "create" || msg.action === "update") &&
    msg.model === "Artifact" &&
    msg.object._id &&
    Object.keys(msg.object).length === 1
  ) {
    const artifact = await db.Artifact.findOne({
      where: {
        _id: msg.object._id,
      },
    });

    msg.object = db.unpackArtifact(artifact);
  }

  for (let i = 0; i < websockets.length; i++) {
    const ws = websockets[i];
    if (ws.readyState === 1 && ws.space_id == spaceId) {
      ws.send(JSON.stringify(msg));
    } else if (!ws.space_id || !spaceId) {
      console.log("space id not set, ignoring");
    }
  }
};

const onMessageListenerCursors = (rawMessage, websockets) => {
  const msg = JSON.parse(rawMessage);
  const spaceId = msg.space_id;
  const socketId = msg.from_socket_id;

  for (let i = 0; i < websockets.length; i++) {
    const ws = websockets[i];

    if (ws.readyState === 1 && ws.space_id == spaceId && ws.id !== socketId) {
      ws.send(JSON.stringify(msg));
    } else if (!ws.space_id || !spaceId) {
      console.log("space id not set, ignoring");
    }
  }
};

// Helper to process NATS v2 subscription messages via async iterator
async function processSubscription(sub, handler, websockets) {
  for await (const msg of sub) {
    const data = sc.decode(msg.data);
    handler(data, websockets);
  }
}

module.exports = {
  startWebsockets: function (server) {
    if (!this.current_websockets) {
      this.natsConn = nats.getConnection();
      this.current_websockets = [];
      this.natsUpdatesMap = {};
      this.natsCursorsMap = {};
    }

    const wss = new WebSocketServer({ server: server, path: "/socket" });
    wss.on(
      "connection",
      function (ws) {
        const socketId =
          "socket_" + crypto.randomBytes(64).toString("hex").substring(0, 8);
        const serverScope = this;
        ws.on("message", function (msgString) {
          const socket = this;
          const msg = JSON.parse(msgString);
          const spaceId = msg.space_id;

          // Only subscribe to nats event if the serverScope has not already subscribed to it
          if (serverScope.natsConn && !get(serverScope, `natsUpdatesMap[${spaceId}]`)) {
            const sub = serverScope.natsConn.subscribe(
              `_spacedeck.updates.${spaceId}`
            );
            serverScope.natsUpdatesMap[spaceId] = sub;
            processSubscription(
              sub,
              onMessageListenerArtifacts,
              serverScope.current_websockets
            );
          }

          if (msg.action == "auth") {
            const token = msg.auth_token;
            const editorName = msg.editor_name;
            const editorAuth = msg.editor_auth;

            db.Space.findOne({ where: { _id: spaceId } }).then((space) => {
              if (space) {
                const upgradeSocket = function () {
                  if (token) {
                    db.findUserBySessionToken(token, function (err, user) {
                      if (err) {
                        console.error(err, user);
                      } else {
                        if (user) {
                          serverScope.addUserInSpace(
                            user._id,
                            space,
                            ws,
                            function (err) {
                              serverScope.addLocalUser(user._id, ws);
                            }
                          );
                        }
                      }
                    });
                  } else {
                    const anonymousUserId = space._id + "-" + editorName;

                    if (
                      space.access_mode == "private" &&
                      space.edit_hash != editorAuth
                    ) {
                      ws.send(JSON.stringify({ error: "auth_failed" }));
                      return;
                    }

                    serverScope.addUserInSpace(
                      anonymousUserId,
                      space,
                      ws,
                      function (err) {
                        serverScope.addLocalUser(anonymousUserId, ws);
                      }
                    );
                  }
                };

                if (!ws.id) {
                  ws["id"] = socketId;
                  try {
                    ws.send(
                      JSON.stringify({ action: "init", channel_id: socketId })
                    );
                  } catch (e) {
                    console.log("ws.send error: " + e);
                  }
                }

                if (ws.space_id) {
                  serverScope.removeUserInSpace(ws.space_id, ws, function (
                    err
                  ) {
                    upgradeSocket();
                  });
                } else {
                  upgradeSocket();
                }
              } else {
                ws.send(JSON.stringify({ error: "space not found" }));
                ws.close();
                return;
              }
            });
          } else if (
            msg.action == "cursor" ||
            msg.action == "viewport" ||
            msg.action == "media"
          ) {
            msg.space_id = socket.space_id;
            msg.from_socket_id = socket.id;
            if (serverScope.natsConn) {
              serverScope.natsConn.publish(
                `_spacedeck.cursors.${msg.space_id}`,
                sc.encode(JSON.stringify(msg))
              );
            }
          }
        });

        ws.on(
          "close",
          function (evt) {
            const spaceId = ws.space_id;
            serverScope.removeUserInSpace(
              spaceId,
              ws,
              function (err) {
                this.removeLocalUser(ws, function (err) {}.bind(this));
              }.bind(this)
            );
          }.bind(this)
        );

        ws.on(
          "error",
          function (ws, err) {
            console.error(err);
          }.bind(this)
        );
      }.bind(this)
    );
  },

  addLocalUser: function (username, ws) {
    if (ws.added) {
      return;
    }
    ws.added = true;
    this.current_websockets.push(ws);
  },

  removeLocalUser: function (ws, cb) {
    const idx = this.current_websockets.indexOf(ws);
    if (idx > -1) {
      this.removed_items = this.current_websockets.splice(idx, 1);
    } else {
      console.log("websocket not found to remove");
    }
  },

  addUserInSpace: function (username, space, ws, cb) {
    ws["space_id"] = space._id.toString();
    cb();
  },
  removeUserInSpace: function (spaceId, ws, cb) {
    ws["space_id"] = null;
    cb();
  },

  distributeUsers: function (spaceId) {
    if (!spaceId) return;
  },
};
