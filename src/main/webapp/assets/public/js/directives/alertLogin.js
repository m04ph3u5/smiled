angular.module("smiled.application").directive('alerts',['alerting', function(alerting) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alerting.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alerting.currentAlerts;
            }
        };

}]);