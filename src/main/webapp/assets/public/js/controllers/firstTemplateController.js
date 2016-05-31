angular.module('smiled.application').controller('firstTemplateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams',
              function firstTemplateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams){
	
	var self = this; 
	self.showWarning = false;
	var scenId = $stateParams.id;
	
	
	//TO DO --> gestione se il giornale non fosse in bozza  
	self.newspaper = apiService.getMyLastNewspaper(scenId).then(
			function(data){
				self.newspaper = data; 
				console.log(self.newspaper.status + "STATO");  
			},function(reason){
				console.log("Errore.");	
			}
)

	self.idTemplate = self.newspaper.idTemplate; 

	/*self.idTemplate = article.getIdCurrentTemplate();*/
	
	// PROVA API
	self.loadNews = function(){
		self.newspaper = apiService.getMyNewspapers(scenId).then(
				function(data){
					var myNews = []; 
					myNews = data;
					
					for(var i=0; myNews && i<myNews.length; i++){
						
						if(myNews[i].status == 'DRAFT') {
							
							self.lastNews = myNews[i];
							console.log(self.lastNews.name +  self.lastNews.idTemplate +  self.lastNews.historicalDate); 
							break; 
							
						}
					
						
					}
					
				},function(reason){
					console.log("Errore.");
					
				}
	)
		
		
	}

	/*self.loadNews(); */
	
	
	
	
	self.showPopUpDeleteNewspaper = function (){
		modalService.showModalDeleteNewspaper();	
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