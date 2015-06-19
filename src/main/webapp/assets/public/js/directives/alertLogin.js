angular.module("smiled.application").directive('alertlogin',['alertingLogin', function(alertingLogin) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingLogin.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingLogin.currentAlerts;
            }
        };

}]);