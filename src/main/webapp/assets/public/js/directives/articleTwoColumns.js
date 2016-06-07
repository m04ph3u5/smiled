angular.module("smiled.application").directive('articleTwoColumns', ['article', '$state',
                                     function(article, $state){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-two-columns.html",
		scope: {
			newspaper: '=?'
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
			self.showWarningTitle = false; 
			self.showWarningSubtitle = false; 
			self.showWarningTextCol1 = false; 
			self.showWarningTextCol2 = false; 
			//id articolo provvisorio 
			self.idArticle = "";
			self.idTemplate = article.getIdCurrentTemplate();
			/*self.idTemplate = $scope.newspaper.idTemplate; */
			self.article = {};
	
			//caricamento articoli in base al template scelto dall'utente
			self.loadArticle = function(idTemplate) {
				
				switch (idTemplate) {
				case "id1":
				self.idArticle = "1";
				self.article = article.getArticleObject(self.idArticle);
				console.log(self.article);
				break;
				
				case "id2":
				self.idArticle = "7";
				self.article = article.getArticleObject(self.idArticle);	
				break;
				

				default:
				console.log("ERROR" + " " + self.idTemplate);
					
				}	
				
			}
			
			self.loadArticle("id" + self.idTemplate);
			
			
			
			self.goToDraft = function(){
				
				article.setArticleId(self.idArticle);
				console.log(self.idArticle + "ARTICOLO");
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
		
		controllerAs: "articleTwoColumns",
		link : function(scope,elem,attrs,ctrl){
			
		
			
			/*controllo testo titolo */
			scope.$watch('articleTwoColumns.article.title', function(newVal, oldVal){
				if(newVal){	
			if(newVal.length>25) {
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
			
			scope.$watch('articleTwoColumns.article.subtitle', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>27) {
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
			
			scope.$watch('articleTwoColumns.article.text.col1', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>682) {
					ctrl.showWarningTextCol1 = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol1= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
	
			/*controllo testo seconda colonna */
			
			scope.$watch('articleTwoColumns.article.text.col2', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>682) {
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
