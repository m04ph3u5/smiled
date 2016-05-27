angular.module('smiled.application').controller('dashboardNewspaperCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService','$stateParams', '$state',
              function firstTemplateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $stateParams, $state){
	
	
	var self = this; 
	self.continueProduction = article.getBooleanRedazione();
	self.idTemplate = article.getIdCurrentTemplate();
	
	//modal Carousel scelta impaginazione
	
    self.showPopUpTemplates = function (){
    	modalService.showChooseTemplate();  
		//modalService.showModalChooseTemplate();
	};
	
	self.goToTemplate = function (){	
		if(self.idTemplate == "1")
		{		$state.go('logged.scenario.template1');
	}
		if(self.idTemplate == "2"){
			$state.go('logged.scenario.template2');
			
			
		}
	}
	
	
	
	
}]);