angular.module('smiled.application').factory('alertingScenario',['$timeout', '$location', '$anchorScroll',
    function($timeout, $location, $anchorScroll) {
        
        var currentAlerts = [];
        var alertTypes = ["success", "info", "warning", "danger"];

        var addWarning = function (message) {
            addAlert("warning", message);
        };

        var addDanger = function (message) {
            addAlert("danger", message);
        };

        var addInfo = function (message) {
            addAlert("info", message);
        };

        var addSuccess = function (message) {
            addAlert("success", message);
        };

        var addAlert = function (type, message) {
        	
        	if(currentAlerts.length>0)
        		currentAlerts.splice(0, 1);
  
    		var alert = { type: type, message: message };
    		currentAlerts.push(alert);
    		$location.hash("topBox");
			$anchorScroll();
			$location.url($location.path());

    		$timeout(function () {
    			removeAlert(alert);
    		}, 5000);
        	
        };

        var removeAlert = function (alert) {
            for (var i = 0; i < currentAlerts.length; i++) {
                if (currentAlerts[i] === alert) {
                    currentAlerts.splice(i, 1);
                    break;
                }
            }
        };

        var errorHandler = function (description) {
            return function () {
                addDanger(description);
            };
        };

        return {
            addWarning: addWarning,
            addDanger: addDanger,
            addInfo: addInfo,
            addSuccess: addSuccess,
            addAlert: addAlert,
            removeAlert: removeAlert,
            errorHandler: errorHandler,
            currentAlerts: currentAlerts,
            alertTypes: alertTypes
        };
           

}]);