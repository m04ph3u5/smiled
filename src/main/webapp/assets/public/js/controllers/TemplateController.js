angular.module('smiled.application').controller('templateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams',
              function templateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams){
	
	var self = this; 
	self.showWarning = false;
	self.currentIdTemplate = article.getIdCurrentTemplate();
	self.scen = $scope.scenario.scen;
	var scenId = $stateParams.id;
	
	//TO DO --> gestione se il giornale non fosse in bozza  
	self.newspaper = apiService.getMyLastNewspaper(scenId).then(
			function(data){
				self.newspaper = data; 
				self.idTemplate = self.newspaper.idTemplate; 
				
			},function(reason){
				self.newspaper = {}; 
				self.newspaper.name = CONSTANTS.insertHeadline;
				console.log("Errore.");	
			}
)

	
	

	self.showPopUpDeleteNewspaper = function (){
		console.log("5555555555555555555");
		modalService.showModalDeleteNewspaper(scenId, self.newspaper.number);			
	}
	
	
}]);