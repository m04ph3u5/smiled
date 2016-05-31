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
			self.isFirst; 
		
			
			self.showPopUpCreationTitle = function (){
			modalService.showModalCreateTitle();	
			};
		
		
		//retrieve object newspaper 
			self.newspaper = apiService.getMyLastNewspaper(scenId).then(
					function(data){
						if(data.status == 'DRAFT'){
							self.newspaper = data; 	
						}
						 else 
							//TO DO, inserire redirect alla vista del nuovo numero 
							console.log("Non è stato possibile scaricare l'ultimo giornale");
					},function(reason){
						self.isFirst = true; 
						
						console.log("Errore. " + self.isFirst );	
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
			
			scope.$watch('self.newspaper.name', function(val){
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
