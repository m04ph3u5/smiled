angular.module("smiled.application").controller('openMapForPostCtrl', [ 'post', 'scenarioMap', 'modalService', 
	function openMapForPostCtrl(post, scenarioMap, modalService){
		var self = this;
		self.post = post;
		
		if(scenarioMap)
			self.map = scenarioMap.url;
		else
			self.map=null;
		
		console.log("OPENMAPFORPOSTCTRL: "+self.map);
			
		self.ok = function(){
			modalService.closeModalOpenMapForPost();
		}
		
		self.cancel = function(){
			modalService.closeModalOpenMapForPost();
		}
}]);