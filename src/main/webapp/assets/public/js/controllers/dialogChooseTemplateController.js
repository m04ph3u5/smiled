angular.module('smiled.application').controller('dialogChooseTemplateCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS', '$scope', 'article', '$stateParams',
       
                                                                  function dialogChooseTemplateCtrl(modalService, alertingGeneric, $state, CONSTANTS, $scope, article, $stateParams){
	var self = this; 
	var scenId = $stateParams.id;
	
    self.loadTemplate = function (idTemplate){
    	//A seconda del template scelto, viene caricata la pagina corrispondente
    	
    	if(idTemplate == "1") {
    		
        	article.setBooleanRedazione();
        	article.setIdCurrentTemplate(idTemplate);
            $state.go('logged.scenario.template1');
        	modalService.closeModalShowChooseTemplate();	
    		
    		
    	} else 
    		
    	if(idTemplate == "2") {
    		
    	article.setBooleanRedazione();
    	article.setIdCurrentTemplate(idTemplate);
        $state.go('logged.scenario.template1');
        modalService.closeModalShowChooseTemplate();		
    	} else 
    		
    		//cambiare lo state quando ci sarà anche il terzo template disponibile
    		
    	if(idTemplate == "3") {
    		article.setBooleanRedazione();
    		article.setIdCurrentTemplate(idTemplate); 
            $state.go('logged.scenario.template2');
            modalService.closeModalShowChooseTemplate();	
    	}
	};
	
	//carousel modal images
	
	$scope.myInterval = 4000;
	$scope.slides = [
	    {
	      image: 'assets/public/img/newspaper-img/template_I.png'
	    },
	    {
	      image: 'assets/public/img/newspaper-img/template_II.png'
	    },
	    {
	      image: 'assets/public/img/newspaper-img/primo-template.png'
	    },
	    {
	      image: 'assets/public/img/newspaper-img/primo-template.png'
	    }
	  ];
	
	
}]);