<template>
  <div style="height: 100%">
    <div v-cloak v-if="activeSpaceLoaded" class="header-right">
      <span v-for="au in active_space_users">
        <button
          v-cloak
          class="member btn btn-md btn-round"
          :class="{ 'btn-dark': !au.avatar_thumb_uri }"
          :style="{ 'background-image': 'url(' + au.avatar_thumb_uri + ')' }"
          :title="au.nickname + ' is online'"
        >
          {{ au.nickname }}
        </button>
      </span>

      <div v-if="zones.length" class="btn-group light round">
        <button
          class="btn btn-md btn-transparent btn-icon"
          title="Previous Zone"
          @click="goToPreviousZone()"
        >
          <span class="icon icon-triangle-4-left"></span>
        </button>

        <button class="btn btn-md btn-divider"></button>

        <button
          class="btn btn-md btn-transparent btn-icon"
          title="Next Zone"
          @click="goToNextZone()"
        >
          <span class="icon icon-triangle-4-right"></span>
        </button>
      </div>
    </div>

    <board-error v-if="!isLoading && !spaceFound"></board-error>

    <template v-if="!isLoading && activeSpace && activeSpaceLoaded">
      <toolbar v-if="showToolbars"></toolbar>
      <toolbar-object v-if="showToolbars"></toolbar-object>
      <board-meta></board-meta>
    </template>

    <div v-if="!isLoading && activeSpace && activeSpaceLoaded">
      <div class="avw-board-header">
        <div class="avw-board-header__room-name">{{ roomName }}</div>
        <button
          v-if="!showToolbars"
          class="avw-board-header__download-btn"
          @click="downloadSpace()"
        >
          <span class="material-icons md-18">file_download</span>
          <span>{{ $t("toolbar.download") }}</span>
        </button>
      </div>
      <!-- <div id="lasso"></div> -->
      <div class="snap-ruler-h" :style="{ top: snapRulerY + 'px' }"></div>
      <div class="snap-ruler-v" :style="{ left: snapRulerX + 'px' }"></div>
      <div
        v-cloak
        v-if="
          activeView == 'space' &&
          !presentMode &&
          activeSpaceArtifacts.length == 0
        "
        class="space-empty"
      >
        <div class="table-fake">
          <div class="cell">
            <p>Use the toolbar to add content.</p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-cloak
      id="space-loading"
      :class="{ active: isLoading, active: globalSpinner }"
    >
      <div>
        <div class="spinner"></div>
      </div>
    </div>

    <!-- eslint-disable -->
    <!-- add `v-sd-droppable="handle_data_drop;activeSpace"` so files are droppable onto space when file upload is supported -->
    <div
      v-cloak
      v-if="!isLoading && activeView == 'space' && activeSpaceLoaded"
      id="space"
      v-sd-whiteboard
      class="section board active mouse-{{mouseState}} tool-{{activeTool}}"
      :style="{ 'background-color': activeSpace.background_color }"
      @scroll="handleScroll"
      @dblclick="handleSpaceDoubleclick"
    >
    <!-- eslint-enable -->
      <div
        id="space-clipboard"
        style="
          position: fixed;
          top: 0;
          left: 0;
          z-index: 0;
          opacity: 0;
          background-color: white;
        "
      >
        <textarea
          id="clipboard-ta"
          v-model="selectedArtifactsJson"
          cols="2"
          rows="2"
          class="mousetrap"
        ></textarea>
      </div>

      <div
        class="space-bounds"
        :style="{
          width: activeSpace.width * boundsZoom + 1000 + 'px',
          height: activeSpace.height * boundsZoom + 1000 + 'px',
          'background-color': activeSpace.background_color,
        }"
      ></div>

      <div
        class="wrapper"
        :style="{
          transform: 'scale(' + viewportZoom + ')',
          'transform-origin': '0 0',
          width: activeSpace.width + 'px',
          height: activeSpace.height + 'px',
          'background-image': activeSpace.background_uri
            ? 'url(' + activeSpace.background_uri + ')'
            : '',
          'background-color': '' + activeSpace.background_color,
          'margin-left': bounds_margin_horiz + 'px',
          'margin-top': bounds_margin_vert + 'px',
        }"
      >
        <div id="lasso"></div>
        <div
          v-for="a in activeSpaceArtifacts"
          id="artifact-{{a._id}}"
          :style="a.view.style"
          :class="[
            a.view.classes,
            {
              'text-editing':
                editingArtifactId == a._id &&
                (a.view.major_type == 'text' || a.view.major_type == 'shape'),
            },
          ]"
        >
          <div
            v-if="a.view && a.view.major_type"
            style="height: 100%; width: 100%"
            :title="a.editor_name || (a.user && a.user.nickname) || ''"
          >
            <span v-if="a.locked && isSelected(a)" class="link-wrapper">
              <span class="btn btn-sm btn-icon btn-round btn-primary">
                <span class="icon icon-lock-closed"></span>
              </span>
            </span>
            <!-- text -->
            <div
              v-if="a.view.major_type == 'text'"
              class="text"
              :style="a.view.inner_style"
            >
              <div class="text-table">
                <div class="text-cell" :style="a.view.text_cell_style">
                  <div
                    v-show="editingArtifactId == a._id"
                    v-sd-richtext:obj="a"
                    class="text-column text-editing"
                  >
                    <!-- eslint-disable-next-line vue/no-parsing-error -->
                    {{{ a.description }}}
                  </div>
                  <div
                    v-show="editingArtifactId != a._id"
                    class="text-column"
                    v-html="a.description | urls_to_links"
                  ></div>
                </div>
              </div>

              <span v-if="a.view.link.length > 0" class="link-wrapper">
                <a
                  v-if="a.view.link"
                  class="link btn btn-round btn-primary btn-sm"
                  :href="a.view.link"
                  target="_blank"
                >
                  {{ a.view.link_caption }}
                </a>
              </span>

              <input
                v-show="isSelected(a)"
                id="ios-focuser-{{a._id}}"
                type="text"
                class="ios-focuser"
              />
            </div>

            <!-- drawing (annotation) -->
            <div
              v-if="a.view.major_type == 'vector'"
              class="clip"
              :style="a.view.inner_style"
            >
              <div v-html="a.view.vector_svg"></div>
            </div>

            <!-- svg shape -->
            <div
              v-if="a.view.major_type == 'shape'"
              class="clip"
              :style="a.view.inner_style"
            >
              <div class="shape" v-html="a.view.vector_svg"></div>
              <div class="text-table">
                <div class="text-cell" :style="a.view.text_cell_style">
                  <div
                    v-show="editingArtifactId == a._id"
                    v-sd-richtext:obj="a"
                    class="text-column text-editing"
                  ></div>
                  <div
                    v-show="editingArtifactId != a._id"
                    class="text-column"
                    v-html="a.description | urls_to_links"
                  ></div>
                </div>
              </div>
              <span v-if="a.view.link.length > 0" class="link-wrapper">
                <a
                  v-if="a.view.link"
                  class="link btn btn-round btn-primary btn-sm"
                  :href="a.view.link"
                  target="_blank"
                >
                  {{ a.view.link_caption }}
                </a>
              </span>

              <input
                v-show="isSelected(a)"
                id="ios-focuser-{{a._id}}"
                type="text"
                class="ios-focuser"
              />
            </div>

            <!-- svg image -->
            <div
              v-if="a.view.major_type == 'svg'"
              class="svg"
              :style="a.view.inner_style"
            >
              <img :src="a.view.payload_uri" />
            </div>

            <!-- image -->
            <div
              v-if="a.view.major_type == 'image'"
              class="image"
              :style="
                a.view.inner_style +
                '; background-image: url(' +
                a.view.thumbnail_uri +
                ');'
              "
            >
              <span class="title">{{ a.title }}</span>
              <div class="spinner"></div>
              <div
                class="progress"
                :style="{ width: a.view.progress + '%' }"
              ></div>
              <div class="progress-text">{{ a.description }}</div>

              <video
                v-if="
                  a.mime == 'image/gif' &&
                  a.payload_alternatives &&
                  a.payload_alternatives.length > 0
                "
                preload
                autoplay
                loop
              >
                <source
                  v-for="rep in a.payload_alternatives"
                  :src="rep.payload_uri"
                  :type="rep.mime"
                />
              </video>

              <span v-if="a.view.link.length > 0" class="link-wrapper">
                <a
                  v-if="a.view.link"
                  class="link btn btn-round btn-primary btn-sm"
                  :href="a.view.link"
                  target="_blank"
                >
                  {{ a.view.link_caption }}
                </a>
              </span>
            </div>

            <!-- video -->
            <div
              v-if="a.view.major_type == 'video'"
              v-videoplayer="a"
              class="video"
              :style="
                a.view.inner_style +
                ';background-image: url(' +
                a.view.thumbnail_uri +
                ');'
              "
            >
              <video preload="metadata" :poster="a.view.thumbnail_uri">
                <source
                  v-for="rep in a.payload_alternatives"
                  :src="rep.payload_uri"
                  :type="rep.mime"
                />
                <source
                  v-if="a.payload_uri && a.mime"
                  :src="a.payload_uri"
                  :type="a.mime"
                />
              </video>

              <div class="tl-controls">
                <div
                  class="btn btn-md btn-toggle btn-round"
                  :class="{ alt: a.player_view.state == 'playing' }"
                >
                  <span class="btn-option play">
                    <span class="icon icon-controls-play"></span>
                  </span>

                  <span class="btn-option pause">
                    <span class="icon icon-controls-pause"></span>
                  </span>
                </div>

                <span
                  v-show="
                    a.player_view.state == 'playing' ||
                    a.player_view.state == 'paused'
                  "
                  class="btn btn-md btn-round btn-icon stop"
                >
                  <span class="icon icon-controls-stop"></span>
                </span>
              </div>
              <div class="spinner"></div>
              <div class="progress" :style="{ width: a.view.progress + '%' }">
                {{ a.description }}
              </div>
            </div>

            <!-- audio -->
            <div
              v-if="a.view.major_type == 'audio'"
              v-audioplayer="a"
              class="audio"
              :style="a.view.inner_style"
            >
              <audio>
                <source
                  v-for="alt in a.payload_alternatives"
                  :src="alt.payload_uri"
                  :type="alt.mime"
                />
                <source
                  v-if="a.payload_uri"
                  :src="a.payload_uri"
                  :type="a.mime"
                />
              </audio>

              <div
                v-show="a.h >= 64 && a.w >= 170"
                class="timeline"
                :style="{
                  'background-image':
                    'url(' + a.payload_thumbnail_web_uri + ')',
                }"
              >
                <div
                  class="tl-current-time"
                  :style="{
                    width: a.player_view.current_time_float * 100 + '%',
                  }"
                ></div>
                <div
                  v-if="a.player_view.inpoint_float > 0.0"
                  class="tl-inpoint"
                  :style="{ left: a.player_view.inpoint_float * 100 + '%' }"
                ></div>
                <div
                  class="tl-outpoint"
                  :style="{ left: a.player_view.outpoint_float * 100 + '%' }"
                ></div>
              </div>

              <div class="tl-controls">
                <div
                  class="btn btn-md btn-toggle btn-round"
                  :class="{ alt: a.player_view.state == 'playing' }"
                >
                  <span class="btn-option play">
                    <span class="icon icon-controls-play"></span>
                  </span>

                  <span class="btn-option pause">
                    <span class="icon icon-controls-pause"></span>
                  </span>
                </div>

                <span
                  v-show="
                    a.player_view.state == 'playing' ||
                    a.player_view.state == 'paused'
                  "
                  class="btn btn-md btn-round btn-icon stop"
                >
                  <span class="icon icon-controls-stop"></span>
                </span>

                <span v-show="a.w >= 400" class="tl-title">{{
                  a.view.filename
                }}</span>
                <span class="tl-times btn-group">
                  <span class="btn btn-md btn-transparent no-p">{{
                    a.player_view.current_time_string
                  }}</span>
                  <span
                    v-show="a.w >= 170"
                    class="btn btn-md btn-transparent no-p"
                  >
                    / {{ a.player_view.total_time_string }}
                  </span>
                </span>

                <span v-show="loggedIn && a.w >= 310">
                  <a
                    class="btn btn-xs btn-round btn-icon set-inpoint"
                    title="Set Inpoint at Playhead"
                  >
                    <span class="icon icon-edge-left"></span>
                  </a>
                  <a
                    class="btn btn-xs btn-round btn-icon set-outpoint"
                    title="Set Outpoint at Playhead"
                  >
                    <span class="icon icon-edge-right"></span>
                  </a>
                  <a
                    class="btn btn-xs btn-round btn-icon reset-points"
                    title="Reset In-/Outpoints"
                  >
                    <span class="icon icon-size-horizontal"></span>
                  </a>
                </span>
              </div>

              <div class="spinner"></div>
              <div class="progress" :style="{ width: a.view.progress + '%' }">
                {{ a.description }}
              </div>
            </div>

            <!-- zone -->
            <div
              v-if="a.view.major_type == 'zone'"
              class="zone"
              :style="a.view.inner_style"
            >
              <div class="text-cell">
                <div
                  v-show="editingArtifactId == a._id"
                  v-sd-richtext:obj="a"
                  class="text-column text-editing"
                ></div>
                <div
                  v-show="editingArtifactId != a._id"
                  class="text-column"
                  v-html="a.description | urls_to_links"
                ></div>
              </div>
            </div>

            <!-- embed -->
            <div
              v-if="a.view.major_type == 'oembed'"
              class="oembed"
              :style="{
                'background-image': 'url(' + a.view.thumbnail_uri + ')',
              }"
              :class="{ interactive: a.view.interactive || presentMode }"
            >
              <template v-html="a.view.oembed_html"></template>

              <button
                v-if="!a.view.interactive && !presentMode"
                class="btn btn-icon btn-primary btn-round interact"
                @click="a.view.interactive = 1"
              >
                <span class="icon icon-tool-pointer"></span>
              </button>
            </div>

            <!-- file -->
            <div
              v-if="a.view.major_type == 'file'"
              class="text"
              :style="a.view.inner_style"
            >
              <span class="icon icon-page-vertical-double"></span>
              {{ a.view.filename }}
              <div class="spinner"></div>
            </div>
          </div>
        </div>
        <!-- board artifacts end -->

        <div
          class="handles handles-object"
          :class="{ 'handles-vector': selectionMetrics.vector_selection }"
          :style="selectionMetrics.style"
        >
          <div class="handle resize-nw">
            <div>
              <div>
                <div>
                  <span class="value-h">{{ selectionMetrics.h }}</span>
                  <span class="value-w">{{ selectionMetrics.w }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="handle resize-n">
            <div>
              <div>
                <div>
                  <span class="value-h">{{ selectionMetrics.h }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="handle resize-ne">
            <div>
              <div>
                <div>
                  <span class="value-h">{{ selectionMetrics.h }}</span>
                  <span class="value-w">{{ selectionMetrics.w }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="handle resize-e">
            <div>
              <div>
                <div>
                  <span class="value-w">{{ selectionMetrics.w }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="handle resize-se">
            <div>
              <div>
                <div>
                  <span class="value-h">{{ selectionMetrics.h }}</span>
                  <span class="value-w">{{ selectionMetrics.w }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="handle resize-s">
            <div>
              <div>
                <div>
                  <span class="value-h">{{ selectionMetrics.h }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="handle resize-sw">
            <div>
              <div>
                <div>
                  <span class="value-h">{{ selectionMetrics.h }}</span>
                  <span class="value-w">{{ selectionMetrics.w }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="handle resize-w">
            <div>
              <div>
                <div>
                  <span class="value-w">{{ selectionMetrics.w }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="edge-handle resize-n">
            <span class="value-h">{{ selectionMetrics.h }}</span>
          </div>
          <div class="edge-handle resize-s">
            <span class="value-h">{{ selectionMetrics.h }}</span>
          </div>
          <div class="edge-handle resize-e">
            <span class="value-w">{{ selectionMetrics.w }}</span>
          </div>
          <div class="edge-handle resize-w">
            <span class="value-w">{{ selectionMetrics.w }}</span>
          </div>

          <div
            v-show="selectionMetrics.vector_points"
            :style="selectionMetrics.vector_style"
          >
            <span
              v-for="p in selectionMetrics.vector_points"
              :style="{ left: p.dx + 'px', top: p.dy + 'px' }"
              class="vector-handle"
              data-idx="{{$index}}"
            ></span>
          </div>
        </div>
        <!-- handles end -->

        <div
          v-for="c in userCursors"
          class="cursor"
          :style="{ left: c.x + 'px', top: c.y + 'px' }"
        >
          <span class="btn btn-round btn-sm btn-dark">
            <span class="icon icon-tool-pointer"></span>
            {{ c.name }}
          </span>
        </div>
      </div>
      <!-- wrapper end -->
    </div>
  </div>
</template>

<script>
// import jsCookie from "js-cookie";
// import get from "lodash/get";
// import axios from "axios";
import { downloadSpace } from "./utils";

export default {
  data() {
    return {
      isLoading: false,
      // TODO: set to false when connected with backend service
      spaceFound: true,
    };
  },
  computed: {
    userCursors() {
      return this.$root.user_cursors;
    },
    loggedIn() {
      return this.$root.logged_in;
    },
    activeSpaceUsers() {
      return this.$root.active_space_users;
    },
    selectedArtifactsJson() {
      return this.$root.selected_artifacts_json;
    },
    selectionMetrics() {
      return this.$root.selection_metrics;
    },
    editingArtifactId() {
      return this.$root.editing_artifact_id;
    },
    boundsMarginVert() {
      return this.$root.bounds_margin_vert;
    },
    boundsMarginHoriz() {
      return this.$root.bounds_margin_horiz;
    },
    viewportZoom() {
      return this.$root.viewport_zoom;
    },
    boundsZoom() {
      return this.$root.bounds_zoom;
    },
    activeTool() {
      return this.$root.active_tool;
    },
    mouseState() {
      return this.$root.mouse_state;
    },
    snapRulerX() {
      return this.$root.snap_ruler_x;
    },
    snapRulerY() {
      return this.$root.snap_ruler_y;
    },
    globalSpinner() {
      return this.$root.global_spinner;
    },
    loadingSpaceId() {
      return this.$root.loading_space_id;
    },
    activeView() {
      return this.$root.active_view;
    },
    presentMode() {
      return this.$root.present_mode;
    },
    activeSpaceArtifacts() {
      return this.$root.active_space_artifacts;
    },
    activeSpace() {
      return this.$root.active_space;
    },
    activeSpaceLoaded() {
      return this.$root.active_space_loaded;
    },
    zones() {
      return this.$root.zones;
    },
    showToolbars() {
      return !this.$root.is_active_space_role("viewer");
    },
    roomName() {
      const url = new URL(window.location);

      return url.searchParams.get("roomName") || this.activeSpace.name;
    },
  },
  created() {
    // TODO: enable this block when connected with backend service
    // this.isLoading = true;
    // const fetchBoardInterval = null;
    // const url = new URL(window.location);
    // const urlParams = url.pathname.split("/");
    // const userAuthCookie = jsCookie.get("sdsession");
    // const getBoardStatus = () => {
    //   axios
    //     .get(`/api/spaces/${urlParams[2]}`, {
    //       headers: { sdsession: userAuthCookie },
    //     })
    //     .then((response) => {
    //       // update value in instance periodically
    //       this.$root.active_space.updatedAt = get(response, "body.updatedAt");
    //       this.spaceFound = true;
    //     })
    //     .catch(() => {
    //       this.$root.active_space = null;
    //       this.$root.active_space_loaded = false;
    //       this.spaceFound = false;
    //       clearInterval(fetchBoardInterval);
    //     })
    //     .finally(() => {
    //       this.isLoading = false;
    //     });
    // };
    // fetchBoardInterval = setInterval(getBoardStatus, 60000);
    // getBoardStatus();
  },
  methods: {
    isSelected(itm) {
      this.$root.is_selected(itm);
    },
    handleSpaceDoubleclick(evt) {
      this.$root.handle_space_doubleclick(evt);
    },
    handleScroll(evt) {
      this.$root.handle_scroll(evt);
    },
    goToPreviousZone() {
      this.$root.go_to_previous_zone();
    },
    goToNextZone() {
      this.$root.go_to_next_zone();
    },
    downloadSpace() {
      const spaceWidth = this.$root.active_space.width;
      const spaceHeight = this.$root.active_space.height;

      return downloadSpace(spaceWidth, spaceHeight);
    },
  },
};
</script>
