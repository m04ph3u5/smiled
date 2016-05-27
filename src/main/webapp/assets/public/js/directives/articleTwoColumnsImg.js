angular.module("smiled.application").directive('articleTwoColumnsImg', ['article', '$state',
                                     function( article, $state){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-two-columns-img.html",
		scope: {
			
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
			self.showWarningTitle = false; 
			self.showWarningTextCol1 = false; 
			self.showWarningTextCol2 = false; 
			self.showWarningSubtitle = false; 
			self.id = "3";
			self.article = article.getArticleObject(self.id);
			
			self.goToDraft = function(){
				
				article.setArticleId(self.id);
				$state.go('logged.scenario.draftArticle2col');
				
			}
			
			
	self.closeWarning = function (s){
				
				switch (s) {
				
				case "title":
				self.showWarningTitle = false;
				break;
				
				case "subtitle":
				self.showWarningSubtitle = false;
				console.log ("CHIUDI!");
				break;
				
				case "col1":
				self.showWarningTextCol1 = false; 
				break;
				
				case "col2":
				self.showWarningTextCol2 = false;
				break;
				
				default:
				console.log("ERROR");
					
				}
			}
			
			
			
		}],
		
		controllerAs: "articleTwoColumnsImg",
		link : function(scope,elem,attrs,ctrl){
			/*controllo titolo */
			scope.$watch('articleTwoColumnsImg.article.title', function(newVal, oldVal){
				if(newVal){	
			if(newVal.length>28) {
				ctrl.showWarningTitle = true;
				console.log ("ATTENZIONE");
				
			} else
				{
				ctrl.showWarningTitle = false; 
				console.log ("VA BENE");
				
				}
				}
			
			});	
			
			
			
			/*controllo testo sottotitolo */
			
			scope.$watch('articleTwoColumnsImg.article.subtitle', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>26) {
					ctrl.showWarningSubtitle = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol1= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
			/*controllo testo prima colonna */
			
			scope.$watch('articleTwoColumnsImg.article.text.col1', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>574) {
					ctrl.showWarningTextCol1 = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol1= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
			
			scope.$watch('articleTwoColumnsImg.article.text.col2', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>574) {
					ctrl.showWarningTextCol2 = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol2= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
	
			
		}


} 
}]);
