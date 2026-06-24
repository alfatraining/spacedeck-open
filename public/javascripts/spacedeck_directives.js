
/*
  Spacedeck Directives
  This module registers custom Vue directives for Spacedeck.
  Rewritten for Vue 2 directive API.
*/

function _getByPath(obj, path) {
  return path.split('.').reduce(function(o, key) {
    return o && o[key];
  }, obj);
}

function _setByPath(obj, path, value) {
  var parts = path.split('.');
  var target = obj;
  for (var i = 0; i < parts.length - 1; i++) {
    target = target[parts[i]];
  }
  Vue.set(target, parts[parts.length - 1], value);
}

function setup_directives() {
  Vue.directive('clipboard', {
    bind: function (el) {
      el._clipboard = new Clipboard(".clipboard-btn");
    },
    unbind: function (el) {
      if (el._clipboard) el._clipboard.destroy();
    }
  });

  Vue.directive('t', {
    update: function (el, binding) {
      el.innerHTML = binding.value;
    }
  });

  if ('ontouchstart' in window) {
    var edown = "touchstart";
    var emove = "touchmove";
    var eup = "touchend";
  } else {
    var edown = "mousedown";
    var emove = "mousemove";
    var eup = "mouseup";
  }

  Vue.directive('videoplayer', {
    bind: function (el, binding, vnode) {
      el._vp_bound = false;
    },
    update: function (el, binding, vnode) {
      var a = binding.value;
      if (!a || el._vp_bound) return;
      el._vp_bound = true;

      var scope = vnode.context.$root;
      var video = el.querySelectorAll("video")[0];
      var play_button = el.querySelectorAll(".play")[0];
      var pause_button = el.querySelectorAll(".pause")[0];
      var stop_button = el.querySelectorAll(".stop")[0];
      var player_state = "stop";

      var update_view = function() {
        try {
          if (!a.player_view) { a.player_view = {} };
          a.player_view.state = player_state;
        } catch (e) {
          // catch InvalidStateError
        }
      }

      var play_func = function() {
        video.play();
        player_state = "playing";
        update_view();
      }

      var pause_func = function() {
        try {
          video.pause();
          player_state = "paused";
          update_view();
        } catch (e) {
          // catch InvalidStateError
        }
      }

      var stop_func = function() {
        try {
          player_state = "stop";
          video.pause();
          video.currentTime = 0;
          update_view();

        } catch (e) {
          // catch InvalidStateError
        }
      }

      el.addEventListener("remote_play",play_func);
      el.addEventListener("remote_pause",pause_func);
      el.addEventListener("remote_stop",stop_func);

      play_button.addEventListener(edown, function(evt) {
        try {
          play_func();
          spacedeck.presenter_send_media_action(a._id,"video","play",video.currentTime);
        } catch (e) {
          // catch InvalidStateError
        }
      }, false);

      pause_button.addEventListener(edown, function(evt) {
        pause_func();
        spacedeck.presenter_send_media_action(a._id,"video","pause",video.currentTime);
      }, false);

      stop_button.addEventListener(edown, function(evt) {
        stop_func();
        spacedeck.presenter_send_media_action(a._id,"video","stop",0);
      }, false);
    }
  });

  Vue.directive('audioplayer', {
    bind: function (el, binding, vnode) {
      el._ap_bound = false;
    },
    update: function (el, binding, vnode) {
      var a = binding.value;
      if (!a || el._ap_bound) return;
      el._ap_bound = true;

      var scope = vnode.context.$root;
      var play_button = el.querySelectorAll(".play")[0];
      var pause_button = el.querySelectorAll(".pause")[0];
      var stop_button = el.querySelectorAll(".stop")[0];
      var timeline = el.querySelectorAll(".timeline")[0];
      var set_inpoint = el.querySelectorAll(".set-inpoint")[0];
      var set_outpoint = el.querySelectorAll(".set-outpoint")[0];
      var reset_points = el.querySelectorAll(".reset-points")[0];

      var player_state = "stop";

      var play_from = 0.0;
      var play_to = 0.0;

      var audio = el.querySelectorAll("audio")[0];

      var update_markers = function() {
        try {
          if (a.meta) {
            if (!a.meta.play_to) a.meta.play_to = audio.duration;
            play_from = parseFloat(a.meta.play_from) || 0.0;
            play_to = parseFloat(a.meta.play_to) || 0.0;
          } else {
            play_from = 0.0;
            play_to = parseFloat(audio.duration) || 0.0;
            a.meta = {};
          }
        } catch (e) {
          // catch InvalidStateError
        }
      }

      var update_view = function() {
        try {
          if (!a.player_view) { a.player_view = {} };
          a.player_view.state = player_state;
          a.player_view.total_time_string = format_time(audio.duration);
          a.player_view.current_time_string = format_time(audio.currentTime);
          a.player_view.current_time_float = audio.currentTime/audio.duration;
          a.player_view.inpoint_float = play_from/audio.duration;
          a.player_view.outpoint_float = play_to/audio.duration;
          a.player_view.duration = audio.duration;
        } catch (e) {
          // catch InvalidStateError
        }
      }

      var pause_audio = function() {
        try {
          audio.pause();
          player_state = "paused";
        } catch (e) {
          // catch InvalidStateError
        }
        update_view();
      }

      var stop_audio = function() {
        try {
          audio.currentTime = play_from;
          audio.pause();
          player_state = "stop";
        } catch (e) {
          // catch InvalidStateError
        }
        update_view();
      }

      update_view();

      audio.addEventListener("loadedmetadata", function(evt) {
        update_markers();
        update_view();
      }, false);

      audio.addEventListener("timeupdate", function(evt) {
        try {
          update_markers();
          if (audio.currentTime >= play_to && player_state == "playing") stop_audio();
          update_view();
        } catch (e) {
          // catch InvalidStateError
        }
      }, false);

      var play_func = function() {
        if (player_state == "stop") {
          audio.currentTime = play_from;
        }

        player_state = "playing";
        update_markers();
        audio.play();
        update_view();
      }

      var pause_func = function() {
        pause_audio();
        update_view();
      }

      var stop_func = function() {
        stop_audio();
        update_view();
      }

      el.addEventListener("remote_play",play_func);
      el.addEventListener("remote_pause",pause_func);
      el.addEventListener("remote_stop",stop_func);

      play_button.addEventListener(edown, function(evt) {
        try {
          play_func();
          spacedeck.presenter_send_media_action(a._id,"audio","play",audio.currentTime);
        } catch (e) {
          // catch InvalidStateError
        }
      }, false);

      pause_button.addEventListener(edown, function(evt) {
        pause_func();
        spacedeck.presenter_send_media_action(a._id,"audio","pause",audio.currentTime);
      }, false);

      stop_button.addEventListener(edown, function(evt) {
        stop_func();
        spacedeck.presenter_send_media_action(a._id,"audio","stop",0);
      }, false);

      timeline.addEventListener(edown, function(evt) {
        var clicked_time = (parseFloat(evt.offsetX)/evt.currentTarget.offsetWidth)*audio.duration;
        if (isNaN(clicked_time)) {
          clicked_time = 0.0;
        }
        try {
          audio.currentTime = clicked_time;
        } catch (e) {
          // catch InvalidStateErrors
        }
      }, false);

      set_inpoint.addEventListener(edown, function(evt) {
        if (!a.meta) a.meta = {};

        a.meta.play_from = audio.currentTime;
        if (a.meta.play_to<a.meta.play_from) a.meta.play_to = audio.duration;
        update_markers();
        stop_audio();
        update_view();
        scope.save_artifact(a);
      }, false);

      set_outpoint.addEventListener(edown, function(evt) {
        if (!a.meta) a.meta = {};

        a.meta.play_to = audio.currentTime;
        if (a.meta.play_to<a.meta.play_from) a.meta.play_from = 0.0;
        update_markers();
        stop_audio();
        update_view();
        scope.save_artifact(a);
      }, false);

      reset_points.addEventListener(edown, function(evt) {
        if (!a.meta) a.meta = {};

        a.meta.play_from = 0.0;
        a.meta.play_to = audio.duration;
        update_markers();
        stop_audio();
        update_view();
        scope.save_artifact(a);
      }, false);
    }
  });

  Vue.directive('sd-richtext', {
    bind: function(el, binding, vnode) {
      var obj = binding.value;
      if (!obj) return;

      $(el).addClass("text-editing");

      var medium = new Medium({
        element: el,
        mode: Medium.richMode,
        attributes: {
          remove: ['class','href','onclick','onmousedown','onmouseup']
        },
      });
      medium.value(obj.description);
      medium.element.addEventListener('keyup', function() {
        obj.description = medium.value();
        spacedeck.queue_artifact_for_save(obj);
      });

      el._medium = medium;
      spacedeck.medium_for_object[obj._id] = medium;
    },
    update: function(el, binding) {
      var obj = binding.value;
      if (!obj || !el._medium) return;
      // Re-sync if the object changed
      if (el._medium_obj_id !== obj._id) {
        el._medium.value(obj.description);
        el._medium_obj_id = obj._id;
        spacedeck.medium_for_object[obj._id] = el._medium;
      }
    }
  });

  Vue.directive('focus', {
    inserted: function (el) {
      window.setTimeout(function() {
        if (el.contentEditable && el.contentEditable!="inherit") {
          var range = document.createRange();
          range.selectNodeContents(el);
        } else {
          el.focus();
          el.select();
        }
      }, 500);
    },
  });

  Vue.directive('sd-draggable', {
    bind: function(el, binding) {
      el.addEventListener(
        'dragstart',
        function(evt) {
          if ($(el).find(".text-editing").length) {
            // FIXME: technical debt
            evt.stopPropagation();
            evt.preventDefault();
            return;
          }

          evt.dataTransfer.setData('application/json', JSON.stringify(binding.value));
          $(el).addClass("dragging");
        },
        false
      );
    },
    update: function(el, binding) {
      el._sd_draggable_data = binding.value;
    }
  });

  Vue.directive('sd-droppable', {
    bind: function(el, binding, vnode) {
      var expression = binding.expression;
      // Strip quotes from expression string
      expression = expression.replace(/['"]/g, '');
      var parts = expression.split(";");
      var func_key = parts[0];
      var data_key = parts[1];
      var rootVm = vnode.context.$root;

      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'copy';
          if (e.preventDefault) e.preventDefault();
          el.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragenter',
        function(e) {
          el.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function(e) {
          el.classList.remove('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function(e) {
          e.stopPropagation();
          e.preventDefault();

          $(e.currentTarget).find(".over").removeClass('over');
          $(e.currentTarget).find(".dragging").removeClass('dragging');

          var func = rootVm[func_key].bind(rootVm);
          var obj = vnode.context[data_key] || rootVm[data_key];
          func(e, obj);

          return false;
        },
        false
      );
    }
  });

  Vue.directive('sd-fader', {
    bind: function (el, binding, vnode) {

      function clamp(v, mn, mx) {
        return Math.max(mn,Math.min(mx,v));
      }

      var scope = vnode.context.$root;

      // Store state on the element since Vue 2 directives don't have `this` context
      var state = {
        fader_state: "idle",
        fader_mx: 0,
        fader_my: 0,
        fader_oldx: 0,
        fader_oldy: 0
      };
      el._sd_fader = state;

      var $el = $(el);

      var handle = $el.find(".fader-selector");
      var indicator = $el.find(".fader-indicator");
      var constraint = $el.find(".fader-constraint");
      if (!constraint.length) constraint = $el;

      var fader_var_x = $el.attr("sd-fader-var-x");
      var fader_var_y = $el.attr("sd-fader-var-y");

      var xfader = !!fader_var_x;
      var yfader = !!fader_var_y;
      var encoder = !handle[0];

      var knob_size = 0;
      var minx = 0;
      var miny = 0;
      var maxx = 0;
      var maxy = 0;

      var nx = 0;
      if (xfader) nx = _getByPath(scope, fader_var_x) || 0;
      var ny = 0;
      if (yfader) ny = _getByPath(scope, fader_var_y) || 0;

      var step = parseFloat($el.attr("sd-fader-step"))||1;
      var sensitivity = parseFloat($el.attr("sd-fader-sens"))||1;

      var discover_minmax = function() {
        minx = (parseInt($el.attr("sd-fader-min-x"))||0);
        miny = (parseInt($el.attr("sd-fader-min-y"))||0);
        maxx = parseInt($el.attr("sd-fader-max-x"))||(constraint.width() - 1);
        maxy = parseInt($el.attr("sd-fader-max-y"))||(constraint.height() - 1);
      }

      var position_handle = function() {
        discover_minmax();
        if (!nx || isNaN(nx)) nx = 0;
        if (!ny || isNaN(ny)) ny = 0;

        if (handle[0]) {
          if (xfader) handle[0].style.left = nx+"px";
          if (yfader) handle[0].style.top  = (maxy-ny)+"px";
        }

        if (indicator[0]) {
          indicator[0].style.height = ny+"px";
        }
      };

      var move_handle = function(dx,dy) {
        discover_minmax();
        if (xfader) {
          nx = clamp(dx, minx, maxx);
          _setByPath(scope, fader_var_x, nx);
        }

        if (yfader) {
          ny = clamp(dy, miny, maxy);
          if (step<1) ny = ny.toFixed(1); // float precision hack

          _setByPath(scope, fader_var_y, ny);
        }
      };

      var handle_move = function(evt) {
        evt = fixup_touches(evt);

        var dx = parseInt((evt.pageX - state.fader_mx) * sensitivity);
        var dy = parseInt((evt.pageY - state.fader_my) * sensitivity);

        dx *= step;
        dy *= step;

        move_handle(state.fader_oldx+dx,state.fader_oldy-dy);
      };

      var handle_up = function(evt) {
        state.fader_state = "idle";

        $("body").off(emove, handle_move);
        $("body").off("mouseleave "+eup+" blur", handle_up);

        window._sd_fader_moving = false; // signal for other event systems
      };

      $el.on(edown,function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        evt = fixup_touches(evt);
        var offset = $(evt.target).offset();

        state.fader_state = "drag";
        if (!encoder) {
          move_handle(evt.pageX-offset.left, maxy - (evt.pageY - offset.top) + knob_size/2);
        }

        if (yfader) {
          ny = _getByPath(scope, fader_var_y) || 0;
        }

        $("body").on(emove, handle_move);
        $("body").on("mouseleave "+eup+" blur", handle_up);

        state.fader_mx = evt.pageX;
        state.fader_my = evt.pageY;
        state.fader_oldx = nx||0;
        state.fader_oldy = ny||0;

        window._sd_fader_moving = true; // signal for other event systems
      });

      // initial state
      position_handle();

      if (xfader) {
        scope.$watch(fader_var_x, function(a) {
          nx = parseInt(_getByPath(scope, fader_var_x));
          position_handle();
        });
      }

      if (yfader) {
        scope.$watch(fader_var_y, function(a) {
          ny = parseInt(_getByPath(scope, fader_var_y));
          position_handle();
        });
      }
    },

    unbind: function(el) {
      delete el._sd_fader;
    }
  });
}
