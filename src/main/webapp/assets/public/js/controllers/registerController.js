angular.module('smiled.application').controller('registerCtrl', ['apiService', '$state', 'alertingRegistration',
                                                                 function registerCtrl(apiService, $state, alertingRegistration){

	var self = this;
	self.user= {};

	self.dateOptions = {
			"regional" : "it",
			"changeYear" : true,
			"maxDate" : "0",
			"minDate" : new Date(1900,0,1,0,0,0,0),
			"yearRange" : "1900:c"
	};
	
	self.postRegister = function (){

		if(validateRegister()){
			apiService.postRegister(self.user).then(
					function(data){
						//il server ha accettato la registrazione
						console.log("success register");
						self.user.email="";
						self.user.firstName="";
						self.user.lastName="";
						self.user.bornDate="";
						self.user.password="";
						self.user.confirmPassword="";
						alertingRegistration.addSuccess("La tua richiesta e' stata accettata. A breve riceverai una mail per confermare la tua registrazione");
					},
					//il server ha rifiutato la registrazione
					function(reason){ 
						self.user.email="";
						self.user.firstName="";
						self.user.lastName="";
						self.user.bornDate="";
						self.user.password="";
						self.user.confirmPassword="";
						alertingRegistration.addDanger("Non e' stato possibile completare la registrazione, ti preghiamo di riprovare!");
						throw new Error ("Non e' stato possibile completare la registrazione, ti preghiamo di riprovare!");
						
						
					}
			);
		//la validazione lato client è fallita
		}else{
			self.user.password="";
			self.user.confirmPassword="";
		}
	}
	var validateRegister = function(){

		if(self.user.email==null || self.user.email=="" || self.user.firstName==null || self.user.firstName=="" || 
				self.user.lastName==null || self.user.lastName=="" || self.user.bornDate==null || self.user.password==null ||
				self.user.password=="" || self.user.confirmPassword==null || self.user.confirmPassword==""){
			alertingRegistration.addWarning("Compilare tutti i campi!");
			return false;
		}
		else if(!validateEmail(self.user.email)){
			alertingRegistration.addWarning("Email non valida!");
			return false;
		}
		else if(self.user.password!=self.user.confirmPassword){
			alertingRegistration.addWarning("Attenzione le due password digitate non corrispondono!");
			return false;
		}
		else if(self.user.password.length<8){
			alertingRegistration.addWarning("Password troppo corta!");
			return false;
		}
		else
			return true;
	}
	
	var validateEmail = function (email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{1,6}(?:\.[a-z]{1})?)$/i;
	    return re.test(email);
	}
	
	//CAROUSEL
	var scen1 = {img:"assets/public/img/green.jpg"};
	var scen2 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen3 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen4 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen5 = {img:"assets/public/img/cover_default.jpg"};
	var scen6 = {img:"assets/public/img/calderone1.png"};
	var scen7 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen8 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen9 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen10 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen11 = {img:"assets/public/img/cover_default.jpg"};
	var scen12 = {img:"assets/public/img/calderone1.png"};
	var scen13 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen14 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen15 = {img:"assets/public/img/landing page/Sicura.png"};
	var scenarios = [scen1, scen2, scen3, scen4, scen5, scen6, scen7, scen8, scen9, scen10, scen11, scen12, scen13, scen14, scen15];
	self.hideArrows = false;
	self.scenariosToShow = scenarios.slice(0,5);
	var scenarioIndex = 0;
	if (scenarios.length <= 5){
		self.hideArrows = true;
	}
	
	self.shiftScenariosAfter = function(){
		scenarioIndex = scenarioIndex+5;
		
		if (scenarioIndex>11 || scenarioIndex>=scenarios.length){
			//se sono arrivato alla fine degli scenari li rivedo da capo
			scenarioIndex = 0; //sarà tutto FANTASTICO!!! Pioveranno applausi dalla commisione
		}if ((scenarios.length<15 && scenarioIndex>5 && scenarioIndex!=11)||(scenarios.length<10 && scenarioIndex>0)){
			//se ho meno di 15 scenari quelli aggiuntivi li vedo in coda 
			scenarioIndex = scenarios.length-5;
		}
		self.scenariosToShow = scenarios.slice(scenarioIndex,scenarioIndex+5);
	}
	
	self.shiftScenariosBefore = function(){
		if(scenarioIndex == 0){
			scenarioIndex = scenarios.length - 5;
		}else{
			scenarioIndex = scenarioIndex-5;
		}if(scenarioIndex<0){
			scenarioIndex = 0;
		}
		self.scenariosToShow = scenarios.slice(scenarioIndex,scenarioIndex+5);

	}

}]);
