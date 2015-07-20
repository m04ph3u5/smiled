angular.module("smiled.application").directive('bsSwitch', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope : {
    	onCustomText : "@",
    	offCustomText : "@"
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      $(element).bootstrapSwitch({
        onSwitchChange: function(event, state) {
          scope.$apply(function() {
        	 console.log("on switch change");
        	 console.log(state);
            ngModelCtrl.$setViewValue(state);
          });
        }
      });
      $(element).bootstrapSwitch("onText", scope.onCustomText);
      $(element).bootstrapSwitch("offText", scope.offCustomText);
 }
  }
});