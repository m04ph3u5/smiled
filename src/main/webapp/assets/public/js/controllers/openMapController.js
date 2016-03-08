angular.module("smiled.application").controller('openMapCtrl', [ 'post', 'scenarioMap', 'modalService', 
	function openMapCtrl(post, scenarioMap, modalService){
		var self = this;
		self.post = post;
		var oldPlace = angular.copy(post.place);
		if(scenarioMap)
			self.map = scenarioMap.url;
		else
			self.map=null;
	
		self.stylePin = {'visibility' : 'hidden'};
		self.pinPoint = function(event){
			
			var pin = {};
			pin.x = event.offsetX/event.target.width;
			pin.y = event.offsetY/event.target.height;
			post.place = pin;

			var x = event.offsetX-20;
			var y = event.offsetY-40;
			self.stylePin = {'visibility' : 'visible', 'top': y+'px', 'left': x+'px'};
			
		}
		
		self.removePoint = function(){
			console.log("removePoint");
		}
		
		self.ok = function(){
			modalService.closeModalOpenMap();
		}
		
		self.cancel = function(){
			modalService.closeModalOpenMap();
			post.place=oldPlace;
		}
}]);