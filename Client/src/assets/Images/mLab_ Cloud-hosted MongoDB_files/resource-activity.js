
var ResourceActivity = ResourceActivity || {

  run: function() {
    if(!ResourceActivity.__INTERVAL) {
      ResourceActivity.__INTERVAL = setInterval(function() {
        ResourceActivity.__doRun();
      }, 5000);
    }
  },

  __doRun: function() {
    if(ResourceActivity.__RESOURCES) {
      for(var k in ResourceActivity.__RESOURCES) {
        var r = ResourceActivity.__RESOURCES[k];
        ResourceActivity.__fetchActivity(r, function(res) {
          if(res) {
            res.commands.forEach(function(c) {
              // send event
              $(document).trigger(jQuery.Event("resourceActivityDone", {
                time: new Date(),
                lastMessage: c.div.html(),
                resource: res.resource,
                command: c.command
              }));
            });
            delete ResourceActivity.__RESOURCES[res.type+"/"+res.resource];
            if(jQuery.isEmptyObject(ResourceActivity.__RESOURCES)) {
              // send event
              $(document).trigger({
                type: "allResourceActivityDone",
                time: new Date()
              });
            }
          }
        });
      }
    }
  },

  add: function(resource, type, displayLabel, command, replaceMessage) {
    var key = type+"/"+resource;
    if(!ResourceActivity.__RESOURCES[key]) {
      ResourceActivity.__RESOURCES[key] = {
        resource: resource,
        type: type,
        commands: []
      };
    }
    ResourceActivity.__RESOURCES[key].commands.push({
      displayLabel: displayLabel,
      command: command,
      replaceMessage: replaceMessage,
      div: ResourceActivity.__getActivityDiv(resource, command)
    });
  },

  // PRIVATE

  __SUSPENDED_ACTIVITY_MESSAGE: "In progress but temporarily suspended",

  __INTERVAL: null,

  __RESOURCES: {},

  __fetchActivity: function(r, next) {
    getJson("/ui/resourceactivity/" + r.type + "/" + r.resource,
      ResourceActivity.__makeFetchHandler(r, next),
      function() {next(null);}
    );
  },

  __makeFetchHandler: function(r, next) {
    return function(data) {
      if(data) {
        var keepGoing = false;
        for(var i in r.commands) {
          var c = r.commands[i];
          var command = c.command;
          var displayLabel = c.displayLabel;
          if(!(command) || command == ResourceActivity.__getCommandName(data)) {
            keepGoing = true;
            var commandObj = ResourceActivity.__getCommand(data);
            var state = ResourceActivity.__getCommandState(data);
            var activity = state === "suspended" ? [{message: ResourceActivity.__SUSPENDED_ACTIVITY_MESSAGE}] : ResourceActivity.__getCommandActivity(data);

            if (activity) {
              $(document).trigger(jQuery.Event("resourceActivity", {
                message: activity,
                time: new Date(),
                commandObj: commandObj,
                resource: r.resource,
                command: command
              }));
              if(c.replaceMessage) {
                (function() {
                  var k = String(c.replaceMessage);
                  $(".message").filter(function() {return $(this).attr("messageKey") == k;}).hide();
                })();
              }
              // update feedback messages
              ResourceActivity.__renderActivity(r, displayLabel, command, activity, next);
              // color message div based on state
              ResourceActivity.__getActivityDiv(r.resource, command).toggleClass("error", state === "error");
              c.div.show();
            }
          } else {
            c.div.hide();
          }
        }
        if(keepGoing) {
          return;
        }
      }
      next(r);
    };
  },

  __getCommand: function(data) {
    return data && "command" in data && data["command"];
  },

  __getCommandField: function(data, field) {
    var cmd = ResourceActivity.__getCommand(data);
    return cmd && cmd[field];
  },

  __getCommandName: function(data) {
    return ResourceActivity.__getCommandField(data, "_cmd");
  },

  __getCommandState: function(data) {
    return ResourceActivity.__getCommandField(data, "state");
  },

  __getCommandActivity: function(data) {
    var messages = ResourceActivity.__getCommandField(data, "displayMessages");
    if(messages && messages.length) {
      return messages;
    }
  },

  __getActivityDiv: function(resource, command) {
    return $(".resourceActivity[resource=" + resource + "][command=" + command + "]");
  },

  __$fadeInAndReplace: function($elem, value, next) {
    $elem.animate({"opacity":0}, 500, function() {
      $elem.html(value);
      $elem.animate({"opacity":1}, 500, function() {
          if (next) { next(null); }
      });
    });
  },

  __renderActivity: function(r, displayLabel, command, activity, next) {
    // update feedback message
    if(activity && activity.length > 0) {
      var message = activity[activity.length-1].message;
      var $activityDiv = ResourceActivity.__getActivityDiv(r.resource, command);

      var $labelDiv = $activityDiv.find(".labelText");
      if ($labelDiv.length) {
        if ($labelDiv.html() != displayLabel) {
          ResourceActivity.__$fadeInAndReplace($labelDiv, displayLabel, next);
        }
      }
      // must be expecting original template default to original behavior
      else {
        message = '[' + displayLabel + '] ' + message;
      }
      var $messageDiv = $activityDiv.find(".activityText");
      if($messageDiv.length && $messageDiv.html() != message) {
        ResourceActivity.__$fadeInAndReplace($messageDiv, message, next);
        return;
      }
      next(null);
      return;
    }
    next(r);
  }
};

$(document).ready(function() {
  ResourceActivity.run();
});
