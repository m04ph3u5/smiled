angular.module("smiled.application").directive('blurElement',[
    function(){
		return {
			scope : {
				open : "="
			},
            restrict: 'A',
			link : function(scope,elem,attrs,ctrl){
				scope.$watch("open", function(currentValue, previousValue) {
					if (currentValue === true && !previousValue) {
						elem[0].focus();
					}else if (currentValue === false && previousValue === true) {
						elem[0].blur();
					}
				})
			}
		};
}]);