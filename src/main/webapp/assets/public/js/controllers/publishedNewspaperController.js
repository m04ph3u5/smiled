angular.module('smiled.application').controller('publishedNewspaperCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams','alertingGeneric', 'loggedUser', 'article',
              function publishedNewspaperCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams, alertingGeneric, loggedUser, article){
	
	var self = this; 
	self.newspaper = {};
	var scenId = $stateParams.id;
	self.scen = $scope.scenario.scen;
	self.newspaper = {}; 
	self.loggedUser = loggedUser;
	self.isJournalist; 
	self.isEditing; 
	self.idArticle; 
	
	
	
	if(self.loggedUser.id == self.scen.actualJournalist.id){
		self.isJournalist = true; 

	}
	
	
	apiService.getpublishedNewspapers(scenId).then (
			function(data) {
				self.publishedNewspapers = data; 
				self.publishedNewspaperNumber = article.getPublishedNewspaperNumber(); 
				var found = false;
				for(var i=0; !found && i<self.publishedNewspapers.length; i++) {
					if(self.publishedNewspapers[i].number == self.publishedNewspaperNumber) { 
						self.newspaper = self.publishedNewspapers[i]; 
						article.setIdPublishedTemplate(self.newspaper.idTemplate);
						console.log(self.newspaper.idTemplate + "VENGO SETTATO - TEMPLATE"); 
						found = true;
						break;
					}
				}
			},function(reason){
				
				
			}	
			);
	
	self.publishedNewspapers = [];
	
	
	
	self.goToDashboard = function(){
		
		$state.go('logged.scenario.editorial');
		
	}
	
	
	//vai alle bozze SOLO PER STUDENTE GIORNALISTA 
	self.goToDraft = function(id){
		if(self.isJournalist){
			
			article.setIsEditing(true); 
			
			switch (id){
			case 1: 
				article.setArticleId(id);
				$state.go('logged.scenario.draftArticle2col');
				break;
			case 2: 
				article.setArticleId(id);
				$state.go('logged.scenario.draftArticleSimple');
				break;	
			case 3: 
				article.setArticleId(id);
				$state.go('logged.scenario.draftArticle2col');
				break;
			default: 
				console.log("ERROR");
				
			}
			/*article.setArticleId(self.idArticle);*/

	}else {
		
		console.log("NON SEI ABILITATO ALLA MODIFICA"); 
		
	}
	
	} 
}]); 