angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope', 'apiService',
              function scenarioPostCtrl(CONSTANTS,$scope, apiService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.posts = [];
	self.newPost = {};
	
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
		self.newPost.date="";
	}
	
	self.saveNewPost = function(){
		console.log("saveNewPost");
		self.newPost.content="";
		self.newPost.image="";
		self.newPost.file="";
		self.newPost.date="";
	}
	
	self.draftNewPost = function(){
		console.log("draftNewPost");
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