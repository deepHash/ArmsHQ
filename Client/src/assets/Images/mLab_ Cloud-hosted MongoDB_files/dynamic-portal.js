/**
 * User: robert
 * Date: 1/2/13
 * Time: 11:42 AM
 */
function apiQueryParams(mode) {
    var queryParams = {};
    if (mode) queryParams["mode"] = mode;
    return queryParams;
}

function getConstructionError(status) {
    return status && "constructionError" in status && status["constructionError"];
}

var CONSTRUCTION_ERROR_CONTENTS = {
    "text search not enabled": "The source database contains a text index, which is not supported by the selected plan.  Please select an Experimental Sandbox database if you'd like to use text indexes.",
    "create collection invalid size spec": '<p>An error occurred while cloning data from the source database:</p><p style="font-family:monospace">create collection invalid size spec</p><p>This is caused by a known incompatibility in collection metadata between MongoDB v2.4 and older versions: <a href="https://jira.mongodb.org/browse/SERVER-9501" target="_blank">SERVER-9501</a>  For more information, including viable workarounds, please refer to the linked issue.</p>',
    "Connection refused": "An error occurred while cloning data from the source database because it is currently unreachable.  Please verify that there are no firewalls or network restrictions preventing access to your database and try again."
};

function getConstructionErrorMesage(msg) {
    if(msg) {
        for(var key in CONSTRUCTION_ERROR_CONTENTS) {
            if(msg.indexOf(key) >= 0) {
                return CONSTRUCTION_ERROR_CONTENTS[key];
            }
        }
    }
    return null;
}

function makeConstructionErrorDialogContent(dialogId, message) {
    if(message) {
        return '<span class="icon--warning"></span>'+
            '<span class="constructionErrorMessage">'+message+'</span>'+
            '<p>Please contact <a href="javascript:mailto();" style="text-decoration:underline">support@mlab.com</a>'+
            ' with questions if you think you\'ve resolved the problem and would like us to try re-running the operation.'+
            '  If you\'d like to remove this subscription, please '+
            '<a href="javascript:submitConstructionDeleteForm(\''+dialogId+'\');" class="link">click here</a>.';
    } else {
        return '<span class="icon--warning"></span>'+
            '<span class="constructionErrorMessage">An unexpected error occurred while creating your deployment.</span>'+
            '<p>Please contact <a href="javascript:mailto();" style="text-decoration:underline">support@mlab.com</a>'+
            ' for assistance and more information.'+
            '  If you\'d like to remove this subscription, please '+
            '<a href="javascript:submitConstructionDeleteForm(\''+dialogId+'\');" class="link">click here</a>.';
    }
}

function submitConstructionDeleteForm(dialogId) {
    $("#"+dialogId).submit();
}

function makeBaseEntityUrl(cluster, server) {
    var url = "";
    if(cluster) {
        url += "/clusters/"+cluster;
        if(server) {
            url += "/servers/"+server;
        }
    } else if(server) {
        url += "/servers/"+server;
    }
    return url;
}

function populateClusterStatus(clusterId, data) {
    var $statusDiv = $("#"+clusterId+"-status .healthStatusDisplay");
    var $lagDiv = $("#"+clusterId+"-status .replicationLagValue");
    var $planNameDiv = $("#"+clusterId+"-status .clusterPlan");
    var $cloudDiv = $("#"+clusterId+"-status .clusterCloud");
    if(data) {
        var statusValue = data["overallStatus"];
        $statusDiv.html(statusValue);

        // determine CSS class
        var statusStyle = "healthStatus3";
        if(statusValue === "up") {
            statusStyle = "healthStatus1";
        } else if(statusValue === "warning") {
            statusStyle = "healthStatus2";
        } else if(statusValue === "down") {
            statusStyle = "healthStatus0";
        } else if(statusValue === "under construction") {
            statusStyle = "healthStatus4";
        }
        $statusDiv.addClass(statusStyle);

        // calculate repl lag phrase
        if("replicationLag" in data && data["replicationLag"]) {
          var lag = data["replicationLag"];
          if(lag < 0) {
            $lagDiv.addClass("repLag-unrecoverable");
            $lagDiv.html("unrecoverable");
          } else {
            var phrase = data["replicationLagPhrase"];
            if(phrase) {
              $lagDiv.addClass("repLag-"+data["replicationLagUnit"]);
              $lagDiv.html(phrase);
            } else {
              $("#"+clusterId+"-status .replicationLag").hide();
            }
          }
        } else {
          $lagDiv.html("unknown");
        }

        // add plan description
        $planNameDiv.html(data["planDescription"]);

        // add cloud name
        if(data["cloudName"]) {
            $cloudDiv.html(data["cloudName"]);
        }
    } else {
        $statusDiv.addClass("healthStatus4");
        $statusDiv.html("unknown");
        $lagDiv.addClass("repLag-unknown");
        $lagDiv.html("unknown");
        $planNameDiv.addClass("clusterPlanUnknown");
        $planNameDiv.html("unknown");
    }
    $statusDiv.removeClass("healthStatusLoading");
    $lagDiv.removeClass("repLag-loading");
    $planNameDiv.removeClass("clusterPlanLoading");
    $("#"+clusterId+"-status").fadeIn("slow");
}

function populateClusterStatusError(clusterId) {
    var $statusDiv = $("#"+clusterId+"-status .healthStatusDisplay");
    var $lagDiv = $("#"+clusterId+"-status .replicationLagValue");
    var $planNameDiv = $("#"+clusterId+"-status .clusterPlan");
    $statusDiv.removeClass("healthStatusLoading");
    $lagDiv.removeClass("repLag-loading");
    $planNameDiv.removeClass("clusterPlanLoading");
    $statusDiv.addClass("healthStatus4");
    $statusDiv.html("unknown");
    $lagDiv.addClass("repLag-unknown");
    $lagDiv.html("unknown");
    $planNameDiv.addClass("clusterPlanUnknown");
    $planNameDiv.html("unknown");
    $("#"+clusterId+"-status").fadeIn("slow");
}

function fetchClusterStatus(clusterId, flush) {
    var params = apiQueryParams(flush && "flush");
    var url = getRootPortalApiUrl() + "/clusters/" + clusterId + "/status" + serializeUrlParams(params);
    getJson(url, populateClusterStatus, populateClusterStatusError);
}

function makeClusterConstructionErrorDialogOpener(clusterId, message) {
    return makeConstructionErrorDialogOpener("ClusterConstructionErrorDeleteForm", message, clusterId);
}

function makeConstructionErrorDialogOpener(dialogId, message, arg) {
    return function() {
        var $dialog = $("#"+dialogId);
        if($dialog.length) {
            // add dialog content
            $dialog.find("div").html(makeConstructionErrorDialogContent(dialogId, message));
            // set input value
            $dialog.find("input").val(arg);
            openDialog("#"+dialogId);
        }
    }
}

function handleClusterConstructionError(clusterId, error) {
    var $completeDiv = $("#"+clusterId+"ConstructionCompleteDiv");
    // change contents of completion div
    $completeDiv.html('<span class="errorData">We encountered an error while working on this deployment. Click for more info.</span>');
    // disable links to cluster pages
    $("#"+clusterId+"-status").addClass("constructionError");
    var $clusterPuck = $("#"+clusterId+"-section");
    $clusterPuck.addClass("constructionError");
    // make cluster puck open error dialog
    var msg = getConstructionErrorMesage(error.message);
    $clusterPuck.click(makeClusterConstructionErrorDialogOpener(clusterId, msg));
    $clusterPuck.addClass("link");
    // show new content
    $("#"+clusterId+"UnderConstructionDiv").hide();
    $completeDiv.show();
}

function makeClusterStatusHandler(clusterId) {
    return function(data) {
        $("#"+clusterId+"Loading").remove();
        if(data && (data["overallStatus"] !== "under construction")) {
            stopClusterPolling(clusterId);
            if($("#"+clusterId+"UnderConstructionDiv:visible").length) {
                setTimeout(function() { clusterWakeUp(clusterId, null); }, 4000);
            } else {
                clusterWakeUp(clusterId, data);
            }
        } else {
            var error = getConstructionError(data);
            if(error) {
                handleClusterConstructionError(clusterId, error);
            } else {
                updateClusterLoadingIndicator(clusterId, data);
                setTimeout(function() { pollClusterStatus(clusterId); }, 5000);
            }
        }
    }
}

function clusterWakeUp(clusterId, data) {
    DatabasesTable.populateDatabasesTable(clusterId+"-DATABASES", clusterId, null, false, true, false, true);
    if(data) {
        populateClusterStatus(clusterId, data);
    } else {
        fetchClusterStatus(clusterId, true);
    }
}
// called externally
function loadCluster(clusterId, noLinks) {
    if(!noLinks) {
        linkifyClusterStatus(clusterId);
        //linkifyClusterTitle(clusterId);
        linkifyClusterSection(clusterId);
    }
    var url = getRootPortalApiUrl()+"/clusters/"+clusterId+"/status";
    getJson(url, makeClusterStatusHandler(clusterId), null);
}

function pollClusterStatus(clusterId) {
    $("#"+clusterId+"UnderConstructionDiv").show();
    $("#"+clusterId+"ConstructionCompleteDiv").hide();
    var url = getRootPortalApiUrl()+"/clusters/"+clusterId+"/status";
    getJson(url, makeClusterStatusHandler(clusterId), null);
}

function updateClusterLoadingIndicator(clusterId, data) {
    // update indicator ellipsis
    var $indicator = $("#"+clusterId+"UnderConstructionDiv .loading");
    if($indicator.html().length < 3) {
        $indicator.html($indicator.html()+".");
    } else {
        $indicator.html("");
    }

    // update feedback message
    if(data && data.activity) {
        var activity = data.activity;
        var message = activity[activity.length-1].message;
        var $feedback = $("#"+clusterId+"UnderConstructionDiv .activity");
        if($feedback.html() !== message) {
            $feedback.animate({"opacity":0}, 500, function() {
                    $feedback.html(message);
                    $feedback.animate({"opacity":1}, 500);
                });
        }
    }

}

function linkifyNode(nodeSelector, linkUri) {
    var theNode = $(nodeSelector);
    theNode.addClass("link");
    theNode.click(function () {
            if($(this).hasClass("constructionError")) {
                return;
            }
            location.href = linkUri;
        });
}
function linkifyClusterTitle(clusterId) {
    linkifyNode("#" + clusterId + "-title", "/clusters/" + clusterId);
}
function linkifyClusterSection(clusterId) {
    linkifyNode("#" + clusterId + "-section", "/clusters/" + clusterId);
}
function linkifyClusterStatus(clusterId) {
    linkifyNode("#" + clusterId + "-status", "/clusters/" + clusterId + "#servers");
}

function stopClusterPolling(clusterId) {
    var $constructionDiv = $("#"+clusterId+"UnderConstructionDiv:visible");
    if($constructionDiv.length) {
        $constructionDiv.hide();
        $("#"+clusterId+"ConstructionCompleteDiv").show();
        /* TODO: re-add when the fix for effect method is found */
        // $("#"+clusterId+"-title").parent().effect("highlight", {color: "#A6CBE1"}, 3000);
    }
}

function fetchCollectionNames(success, error) {
    var collectionNamesUrl = getPortalApiUrl("database")+"/collections";
    var params = {"mode":"raw", "type":"collection"};
    collectionNamesUrl += serializeUrlParams(params);
    getJson(collectionNamesUrl, success, error);
}

function fetchViewNames(success, error) {
  var collectionNamesUrl = getPortalApiUrl("database")+"/collections";
  var params = {"mode":"raw", "type":"view"};
  collectionNamesUrl += serializeUrlParams(params);
  getJson(collectionNamesUrl, success, error);
}

function fetchCollectionStats(success, error) {
    var collectionNamesUrl = getPortalApiUrl("database")+"/status";
    var params = {"mode":"raw", "collectionStats":"true"};
    collectionNamesUrl += serializeUrlParams(params);
    getJson(collectionNamesUrl, success, error);
}

// logs
// monitoring
// currentOps
// stepDown
// replaceNode
// resyncNode
