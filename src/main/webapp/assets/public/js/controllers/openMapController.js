angular.module("smiled.application").controller('openMapCtrl', [ 'post', 'scenarioMap', 'modalService', 
	function openMapCtrl(post, scenarioMap, modalService){
		var self = this;
		self.post = post;
		var oldPlace = post.place;
		self.map = scenarioMap.url;
		self.stylePin = {'visibility' : 'hidden'};
		self.pinPoint = function(event){
			console.log(event);
			var pin = {};
			pin.x = event.offsetX/event.target.width;
			pin.y = event.offsetY/event.target.height;
			post.place = pin;

			var x = event.offsetX-20;
			var y = event.offsetY-40;
			self.stylePin = {'visibility' : 'visible', 'top': y+'px', 'left': x+'px'};
			console.log(x+" "+y);
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