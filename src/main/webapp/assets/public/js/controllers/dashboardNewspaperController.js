angular.module('smiled.application').controller('dashboardNewspaperCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService','$stateParams', '$state','loggedUser',
              function dashboardNewspaperCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $stateParams, $state, loggedUser){
	
	
	var self = this; 
	var scenId = $stateParams.id;
	self.scen = $scope.scenario.scen;
	self.isModerator = false;
	self.isJournalist = false; 
	self.newspaper = {};
	//info dell'utente loggato, servono per fare i controlli sulla visualizzazione del giornale 
	self.loggedUser = loggedUser;
	self.currentCharacter = {}; 
	self.myNews = []; 
	self.publishedNews = []; 

	
	if(self.scen.teacherCreator.id==self.loggedUser.id){
		/*self.isCreator=true;*/
		self.isModerator=true;	
	}

	if(self.loggedUser.id == self.scen.actualJournalist.id){
		self.isJournalist = true; 
		article.setIsJournalist(true); 
	} else {
		
		article.setIsJournalist(false); 
		
	} 
	

	if(self.isJournalist){
		self.myNews = apiService.getMyNewspapers(scenId).then(
				function(data)	{
					self.myNews = data; 
				}, function(reason){
					console.log("Non esistono giornali, nè pubblicati, nè in bozza"); 
				}
		)
	}

	self.newspaper = apiService.getMyLastNewspaper(scenId).then(
			function(data){
				self.newspaper = data;  
			},function(reason){
				$state.go('logged.scenario.editorial');
				console.log("Non c'è l'ultimo giornale.");	
			}
	)

	apiService.getpublishedNewspapers(scenId).then(
    
			function(data){
				self.publishedNews = data; 
				
			}, function(reason){
				console.log("Non ci sono giornali pubblicati.");
			}

	)
	
	console.log(self.publishedNews);

	self.idTemplate = self.newspaper.idTemplate; 
	
	
	//modal Carousel scelta impaginazione
	
    self.showPopUpTemplates = function (){
    	modalService.showChooseTemplate();  
		//modalService.showModalChooseTemplate();
	};
	
	self.goToTemplate = function (){
	$state.go('logged.scenario.template1');
	}
	
	
	/*
		if(self.idTemplate == "2"){
			$state.go('logged.scenario.template2');
			
			
		}*/
	
	
	
	
	
}]);