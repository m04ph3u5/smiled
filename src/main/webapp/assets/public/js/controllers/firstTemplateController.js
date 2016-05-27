angular.module('smiled.application').controller('firstTemplateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state',
              function firstTemplateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state){
	
	var self = this; 
	self.showWarning = false;
	
	
	self.goToDraft = function (id){
		
		//go to draft session - ID PROVVISORIO ricevuto dalla vista
		
			if(id==1) {	
			var id = "1"; 
			article.setArticleId(id); 
			$state.go('logged.scenario.draftArticle2col');	
		}	
		
		if (id==2) {
			var id = "2";
			article.setArticleId(id);	
			$state.go('logged.scenario.draftArticleSimple');
			
		}
		
		if (id==3) {
			var id = "3";
			article.setArticleId(id);
			$state.go('logged.scenario.draftArticle2col');		
			
		}
		
	}
	
	
	
	
	
	
	
	
	//recupero i dati dal service 
	/*self.article = article.getArticleObject("1");
	
	
	$scope.titlearticle1 = storageData.articles.article1col.titlearticle1; 
	$scope.textarticle1 =  storageData.articles.article1col.textarticle1;
	
	$scope.imageUrl1 = storageData.articles.article2col.imageUrl;*/
	
	//titolo articolo 2 colonne orizzontali con immagine
    /*$scope.titlearticle2img = storageData.articles.article2colimg.titlearticle2img; 
    $scope.textcol1 = storageData.articles.article2colimg.text.textcol1; 
    $scope.textcol2 = storageData.articles.article2colimg.text.textcol2;
    $scope.imageUrl3 = storageData.articles.article2colimg.imageUrl;*/ 
    
    
    
    //Funzioni watch - per ora solo sul titolo. 
    
/*    $scope.$watch('self.article.titlearticle2', function(val) {
    	
    	if(self.article.titlearticle2.length>25) {
    		self.showWarning = true; 
			console.log ("ATTENZIONE" + self.showWarning);
			
		} else
			{
			self.showWarning = false; 
			console.log ("VA BENE");
			
			}
    		
});*/ 	   		

	
	
	
	
    
   
	
}]);