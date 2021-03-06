angular.module("smiled.application").directive('alertscenario',['alertingScenario', function(alertingScenario) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingScenario.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingScenario.currentAlerts;
            }
        };

}]);