angular.module("smiled.application").directive('alertgeneric',['alertingGeneric', function(alertingGeneric) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingGeneric.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingGeneric.currentAlerts;
            }
        };

}]);