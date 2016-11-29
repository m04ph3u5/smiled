angular.module("smiled.application").directive('realMapPostView', [ 'CONSTANTS',
                                                                function(CONSTANTS){
	return {
		restrict : "E",
		scope : {
			stPost : "=",
		//	map : "@",
			stMaxbounds : "=",
			stTile : "=",
			stDefaults : "=",
			stMarker : "="
		},
		templateUrl: 'assets/private/partials/realMap/studentMap.html',
		bindToContrller : true,
		controller: [function(){
			var self = this;
			console.log(self.stPost);
			console.log(self.stMaxbounds);
			console.log(self.stTile);
			console.log(self.stDefaults);
			console.log(self.stMarker);
		}],
		controllerAs : "realMapPostViewCtrl"
	}
}]);
