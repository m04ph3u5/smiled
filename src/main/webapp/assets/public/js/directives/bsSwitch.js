angular.module("smiled.application").directive('bsSwitch', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope : {
    	onCustomText : "@",
    	offCustomText : "@"
    },
    controller : function($scope) {
    	$scope.state;
    },
    controllerAs: "bsSwitch",
    link: function(scope, element, attrs, ngModelCtrl) {
      $(element).bootstrapSwitch({
        onSwitchChange: function(event, state) {
          scope.state = state;
          scope.$apply(function() {
        	 
            ngModelCtrl.$setViewValue(state);
          });
        }
      });
      $(element).bootstrapSwitch("onText", scope.onCustomText);
      $(element).bootstrapSwitch("offText", scope.offCustomText);
      $(element).bootstrapSwitch("labelText", "<span class='glyphicon glyphicon-resize-horizontal'></span>");

 }
  }
});