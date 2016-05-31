angular.module("smiled.application").directive('headlineNewspaper', ['article', 'modalService','apiService', '$stateParams',
                                     function(article, modalService, apiService, $stateParams){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/headline-newspaper.html",
		scope : {
			
		},
		bindToController: true,
		controller: ['$scope',function($scope){
			var self = this;
			
			self.showWarning = false;
			
			var scenId = $stateParams.id;
			self.newspaper= {}; 
			self.number= ''; 
			self.headline = ''; 
			
			/*self.headline = article.getTitle();*/
			
		
			
			self.showPopUpCreationTitle = function (){
			modalService.showModalCreateTitle();	
		};
		
		
		
		// PROVA API - retrieve headline
			self.newspaper = apiService.getMyNewspapers(scenId).then(
					function(data){
						var myNews = []; 
						myNews = data;
						
						for(var i=0; myNews && i<myNews.length; i++){
							
							if(myNews[i].status == 'DRAFT') {
								//oggetto giornale
								self.newspaper = myNews[i];
								//solo nome 
								self.headline = myNews[i].name; 
								self.number = myNews[i].number; 
								break; 
								
							}
						
							
						}
						
					},function(reason){
						console.log("Errore.");
						
					}
		)
			
		
		//prova dataPicker
		
		/*self.startDate = angular.copy(self.scenario.history.startDate);
		if(!self.startDate.afterChrist)
			self.startDate.year*=-1;
		self.endDate = angular.copy(self.scenario.history.endDate);
		if(!self.endDate.afterChrist)
			self.endDate.year*=-1;
		
		self.setDateNewNumber = function(){
			modalService.showModalSetNewspaperDate(self.startDate, self.endDate);
			
		}*/
		
		
			
		}],
		
		controllerAs: "headlineNewspaper",
		link : function(scope,elem,attrs,ctrl){
			
			scope.$watch('headlineNewspaper.headline.title', function(val){
			if(val.length>30) {
				ctrl.showWarning = true; 
				console.log ("ATTENZIONE" + ctrl.showWarning);
				
			}
				
			else
				{
				ctrl.showWarning = false; 
				console.log ("VA BENE");
				
				}
			
			
			});	
			
			
			
		}
			
		
       

} 
}]);
