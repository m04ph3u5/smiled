angular.module("smiled.application").directive('historicaldate',[ function() {

        return {
            restrict: "AE",
            templateUrl: "assets/private/partials/historicalDate.html",
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