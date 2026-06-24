'use strict';

const db = require('../models/db');
const config = require('config');
// const phantom = require('node-phantom-simple');
const os = require('os');

module.exports = {
  // type = "pdf" or "png"
  takeScreenshot: function(space,type,on_success,on_error) {
    var spaceId = space._id;
    var space_url = config.get("endpoint")+"/api/spaces/"+spaceId+"/html";

    var export_path = os.tmpdir()+"/"+spaceId+"."+type;

    var timeout = 5000;
    if (type=="pdf") timeout = 30000;

    space_url += "?api_token="+config.get("phantom_api_secret");

    console.log("[space-screenshot] url: "+space_url);
    console.log("[space-screenshot] export_path: "+export_path);

    var on_success_called = false;

    var on_exit = function(exit_code) {
      if (exit_code>0) {
        console.error("phantom abnormal exit for url "+space_url);
        if (!on_success_called && on_error) {
          on_error();
        }
      }
    };

    // PhantomJS support has been removed: node-phantom-simple / phantomjs-prebuilt
    // are no longer installed (the require at the top of this file is commented out).
    // Screenshot/PDF export is currently unavailable. Fail gracefully via on_error
    // instead of throwing "ReferenceError: phantom is not defined".
    console.error("[space-screenshot] screenshot/PDF export is unavailable: PhantomJS support has been removed.");
    if (on_error) {
      on_error(new Error("screenshot_export_unavailable"));
    }
  }
};
