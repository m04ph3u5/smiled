angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope', 'apiService',
              function scenarioPostCtrl(CONSTANTS,$scope, apiService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.posts = [];
	self.newPost = {};
	self.newPost.date = {
			afterChrist : true
	};
	self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
	self.showDatePicker=false;
	
	self.addImageToNewPost = function(){
		console.log("addImageToNewPost");
		self.newPost.image="";
	}
	
	self.addFileToNewPost = function(){
		console.log("addFileToNewPost");
		self.newPost.file="";
	}
	
	self.setPositionNewPost = function(){
		console.log("setPositionNewPost");
	}
	
	self.setDateNewPost = function(){
		console.log("setDateNewPost");
		self.showDatePicker = !self.showDatePicker;
	}
	
	self.tagToNewPost = function(){
		console.log("tagToNewPost");
	}
	
	self.addSourceToNewPost = function(){
		console.log("addSourceToNewPost");
	}
	
	self.saveNewPost = function(){
		if(self.newPost.content && (self.newPost.date.formatted!=CONSTANTS.insertHistoricalDate)){
			console.log("saveNewPost");
			var toSendPost = {};
			toSendPost.text = self.newPost.content;
			toSendPost.historicalDate = self.newPost.date;
			toSendPost.status = "PUBLISHED";
			apiService.sendStatus($scope.scenario.scen.id, $scope.scenario.currentCharacter.id, toSendPost).then(
					function(data){
						console.log("sended: "+data);
						self.newPost.content="";
						self.newPost.image=null;
						self.newPost.file=null;
						self.newPost.date={afterChrist : true};
						self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
					},
					function(reason){
						console.log("error in send status: "+reason);
					}
			);
		}else{
			//TODO gestione alert errore
		}
	
	}
	
	self.draftNewPost = function(){
		if(self.newPost.content){
			var toSendPost = {};
			toSendPost.text = self.newPost.content;
			toSendPost.historicalDate = self.newPost.date;
			toSendPost.status = "DRAFT";
			apiService.sendStatus($scope.scenario.scen.id, $scope.scenario.currentCharacter.id, toSendPost).then(
					function(data){
						console.log("drafted: "+data);
					},
					function(reason){
						console.log("error in send status: "+reason);
					}
			);
		}	
	}
	
//	apiService.getPagedPosts(self.scen.id, 0, 5, false).then(
//			function(data){
//				
//			
//			}, function(reason){
//				console.log("errore");
//			}
//	);
}]);