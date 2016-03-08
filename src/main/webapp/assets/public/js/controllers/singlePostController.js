angular.module('smiled.application').controller('singlePostCtrl', ['$state', '$stateParams', 'CONSTANTS', '$scope', 'apiService', 'Upload','$interval','notifyService',
              function singlePostCtrl($state, $stateParams, CONSTANTS, $scope, apiService,Upload,$interval, notifyService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.currentCharacter = $scope.scenario.currentCharacter;
	self.post={};
	var idPost =$stateParams.idPost;
	var scenId = $stateParams.id;
	self.postReady=false;
	
	var onStartup = function (){
		
		if(!scenId || scenId==""){
			$state.go('logged.dashboard');
		}else if(!idPost || idPost==""){
			$state.go('logged.scenario.posts', {"id":scenId});
		}else{
			self.post= apiService.getSingleStatus(scenId, idPost).then(
						function(data){
							self.post=data;
							self.postReady=true;
						},function(reason){
							self.post={};
							self.postReady=false;
							console.log("Errore. C'è stato qualche problema nel download del post");
							
						}
			)
		};
		
	}
	
	
	onStartup();
	
}]);