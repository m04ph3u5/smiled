angular.module("smiled.application").directive('headlineNewspaper', ['article', 'modalService',
                                     function(article, modalService){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/headline-newspaper.html",
		scope : {
			
		},
		bindToController: true,
		controller: ['$scope',function($scope){
			
			$scope.numero = "1";
			
			var self = this;
			self.showWarning = false; 
			self.headline = article.getTitle();
			
			self.showPopUpCreationTitle = function (){
			modalService.showModalCreateTitle();	
		};
			
		
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
