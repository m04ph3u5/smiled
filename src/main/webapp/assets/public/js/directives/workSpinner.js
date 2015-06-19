angular.module('smiled.application').directive('workSpinner', ['requestCounter', function (requestCounter) {
    return {
        restrict: "EA",
        transclude: true,
        scope: {},
        template: "<ng-transclude ng-show='requestCount'></ng-transclude>",
        link: function (scope) {

            scope.$watch(function () {
                return requestCounter.getRequestCount();
            }, function (requestCount) {
                scope.requestCount = requestCount;
            });

        }
    };

                                                               
}]);