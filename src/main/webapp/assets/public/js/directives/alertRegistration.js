angular.module("smiled.application").directive('alertregistration',['alertingRegistration', function(alertingRegistration) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingRegistration.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingRegistration.currentAlerts;
            }
        };

}]);