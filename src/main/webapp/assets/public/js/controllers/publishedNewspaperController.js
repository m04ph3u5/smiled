angular.module('smiled.application').controller('publishedNewspaperCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams','alertingGeneric', 'loggedUser',
              function publishedNewspaperCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams, alertingGeneric, loggedUser){
	
	var self = this; 
	var scenId = $stateParams.id;
	self.scen = $scope.scenario.scen;
	self.newspaper = {}; 
	self.loggedUser = loggedUser;
	self.isJournalist=false; 
	self.isEditing; 
	self.idArticle; 
	if($stateParams.number){
		self.publishedNewspaperNumber = $stateParams.number;
		article.setPublishedNewspaperNumber($stateParams.number);

	} else {
		self.publishedNewspaperNumber = article.getPublishedNewspaperNumber();
		
	}
	if(self.scen.actualJournalist!=null && self.loggedUser.id == self.scen.actualJournalist.id){
		self.isJournalist = true; 
	} 
	
	apiService.getnewspaperNumber(scenId,self.publishedNewspaperNumber).then(
			function(data) {
				self.newspaper = data;
				console.log(self.newspaper.name);
				console.log("GIORNALE PUBBLICATO CTRL")
				article.setIdPublishedTemplate(self.newspaper.idTemplate);
	
			}, function(reason) {	
				$state.go('logged.scenario.editorial');
			}
	)
	
	
	
	self.publishedNewspapers = [];
	
	
	
	self.goToDashboard = function(){
		if(self.scen.newspaperEnabled){
		  $state.go('logged.scenario.editorial');
		} else {
	      $state.go('logged.scenario.posts');
		}
		
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