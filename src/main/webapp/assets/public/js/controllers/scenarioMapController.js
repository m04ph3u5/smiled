angular.module('smiled.application').controller('scenarioMapCtrl', ['CONSTANTS', '$scope', 'apiService', 'Fullscreen',
              function scenarioMapCtrl(CONSTANTS,$scope,apiService, Fullscreen){
	
	var self = this;
	self.isFullScreen = false;
	self.scen = $scope.scenario.scen;
	if(self.scen.history.mapId)
		self.map = CONSTANTS.urlMedia(self.scen.history.mapId);
	
	self.posts = apiService.getPagedPosts(self.scen.id, 0, 300, false);
	
	self.slide = 0;

	self.startDateString = "";
	self.endDateString = "";
	
	
	self.actualDate = "";
	
	self.bars = {};
//	self.topBarHeight = angular.element(document.querySelector('#container-canvas')).height+10;	
//	console.log("TOP: "+self.topBarHeight);
	self.getHeight = function(i){
		if(self.bars && self.bars[i]){
			var max = Math.max.apply(Math, self.bars);
			if(max==0)
				return "0%";
			else 
				return parseInt((self.bars[i]*100)/max)+"%";
		}else
			return "0%";
	}
	
	self.getDisplace = function(){
		var widthDiv = angular.element(document.querySelector('#slider')).width();
		var displace = parseInt((widthDiv/100)*self.slide); 
		if(displace>((3/4)*widthDiv))
			displace-=widthDiv/4;
		else
			displace-=widthDiv/8;
		return displace+"px";
	}
	
	self.options = {
		orientation: 'horizontal',
		min: 0,
		max: 100,
		range: 'min',
	};
	
	self.toggleFullScreen = function(){
		self.isFullScreen = !self.isFullScreen;
		if(self.isFullScreen)
			Fullscreen.all();
		else
			Fullscreen.cancel();
	}
	
}]);