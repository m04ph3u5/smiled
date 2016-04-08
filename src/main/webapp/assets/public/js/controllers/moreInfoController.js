angular.module('smiled.application').controller('moreInfoCtrl',['$window',
  function moreInfoCtrl($window){
	
	var self = this;
	self.content=null;
	
	
//	var getPdf = function(){
//		$http.get('/assets/public/pdf/meschola_guida.ppt', {responseType:'arraybuffer'})
//			.success(function (response) {
//	       var file = new Blob([response], {type: 'application/pdf'});
//	       var fileURL = URL.createObjectURL(file);
//	       self.content = $sce.trustAsResourceUrl(fileURL);
//		});
//	}
	
	self.downloadPdf = function(){
		
		$window.location = "assets/public/pdf/meschola_guida.pdf";	
	}
	
	//CAROUSEL
	var scen1 = {img:"assets/public/img/green.jpg"};
	var scen2 = {img:"assets/public/img/landing page/Personalizzabile.png"};
	var scen3 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen4 = {img:"assets/public/img/landing page/Collaborativa.png"};
	var scen5 = {img:"assets/public/img/cover_default.jpg"};
	var scen6 = {img:"assets/public/img/calderone1.png"};
	var scen7 = {img:"assets/public/img/icon/pg.png"};
	var scen8 = {img:"assets/public/img/wizard/wiz_att.png"};
	var scen9 = {img:"assets/public/img/wizard/wiz_char.png"};
	var scen10 = {img:"assets/public/img/wizard/wiz_coll.png"};
	var scen11 = {img:"assets/public/img/ic_creatingscenario.png"};
	var scen12 = {img:"assets/public/img/ic_openscenario.png"};
	var scen13 = {img:"assets/public/img/wizard/wiz_info.png"};
	var scen14 = {img:"assets/public/img/wizard/wiz_rel.png"};
	var scen15 = {img:"assets/public/img/landing page/ic_teacher.png"};
	var scenarios = [scen1, scen2, scen3, scen4, scen5, scen6, scen7, scen8, scen9, scen10, scen11, scen12, scen13];
	
	var scenarioIndex = 0;
	
	// LARGE AND MEDIUM DISPLAY
	self.hideArrowsL = false;
	self.scenariosToShowL = scenarios.slice(0,5);		
	if (scenarios.length <= 5){
		self.hideArrowsL = true;
	}	
	self.shiftScenariosAfterL = function(){
		scenarioIndex = scenarioIndex+5;		
		if (scenarioIndex>11 || scenarioIndex>=scenarios.length){
			//se sono arrivato alla fine degli scenari li rivedo da capo
			scenarioIndex = 0;
		}if (scenarios.length-scenarioIndex<=5){
			//se ho meno di 15 scenari quelli aggiuntivi li vedo in coda 
			scenarioIndex = scenarios.length-5;
		}
		self.scenariosToShowL = scenarios.slice(scenarioIndex,scenarioIndex+5);
	}
	
	self.shiftScenariosBeforeL = function(){
		if(scenarioIndex == 0){
			scenarioIndex = scenarios.length - 5;
		}else{
			scenarioIndex = scenarioIndex-5;
		}if(scenarioIndex<0){
			scenarioIndex = 0;
		}
		self.scenariosToShowL = scenarios.slice(scenarioIndex,scenarioIndex+5);

	}
	
	//SMALL DISPLAY
	self.hideArrowsM = false;
	self.scenariosToShowM = scenarios.slice(0,3);
	if(scenarios.length <= 3){
		hideArrowsM = true;
	}
	self.shiftScenariosAfterM = function(){
		scenarioIndex = scenarioIndex+3;
		if (scenarioIndex>12 || scenarioIndex>=scenarios.length){
			scenarioIndex = 0;
		}if(scenarios.length-scenarioIndex<=3){
			scenarioIndex = scenarios.length - 3;
		}
		self.scenariosToShowM = scenarios.slice(scenarioIndex,scenarioIndex+3);
	}
	self.shiftScenariosBeforeM = function(){
		if(scenarioIndex==0){
			scenarioIndex = scenarios.length-3;
		}else{
			scenarioIndex = scenarioIndex-3;
			if(scenarioIndex<0){
				scenarioIndex = 0;
			}
		}
		self.scenariosToShowM = scenarios.slice(scenarioIndex,scenarioIndex+3);
	}
	
	//EXTRA SMALL DISPLAY
	self.hideArrowsS = false;
	self.scenariosToShowS = scenarios.slice(0,1);
	if(scenarios.length <= 1){
		hideArrowsM = true;
	}
	self.shiftScenariosAfterS = function(){
		scenarioIndex = scenarioIndex+1;
		if(scenarioIndex>=scenarios.length){
			scenarioIndex = 0;
		}
		self.scenariosToShowS = scenarios.slice(scenarioIndex,scenarioIndex+1);
	}
	self.shiftScenariosBeforeS = function(){
		if(scenarioIndex==0){
			scenarioIndex = scenarios.length-1;
		}else{ scenarioIndex = scenarioIndex-1;
			if(scenarioIndex<0){
				scenarioIndex = 0;
			}
		}
		self.scenariosToShowS = scenarios.slice(scenarioIndex,scenarioIndex+1);
	}
	
	
}]);