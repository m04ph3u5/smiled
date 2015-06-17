angular.module('smiled.application').controller('createScenarioCtrl', [ 'apiService', 
                                                              function createScenarioCtrl(apiService){

	
	var self = this;

	self.scenario = {
			
	};
	var s1 = {};
	var listEmail = {};
	
	function produceListEmail(list){
		l = [];
		return l; 
	}
	
	
	self.showHideContent=function(e){
		var container1 = $("#basicinfobox");
		var container2 = $("#studentsbox");
		var container3 = $("#charactersbox");
		var container4 = $("#associationbox");
		var container5 = $("#collaboratorsbox");

		
		
		if (!container1.is(e.target) && container1.has(e.target).length === 0){
			/*Chiudi il div*/
			self.basicinfoboxOn=false;
			
			if(self.scenario.startDate==null || self.scenario.endDate==null || self.scenario.title==null){
				console.log("ATTENZIONE non tutti i campi sono formattati correttamente");
				console.log(self.scenario);
			}else{
				s1.title= self.scenario.title;
				s1.startDate = self.scenario.startDate;
				s1.endDate = self.scenario.endDate;
				console.log(s1);
			}
		}else{
			/*Apri il div*/
			self.basicinfoboxOn=true;
		}
		if (!container2.is(e.target) && container2.has(e.target).length === 0){
			/*Chiudi il div*/
			
			if(self.scenario.listEmail==null){
				console.log("ATTENZIONE nessuna email inserita");
			}else{
				listEmail = produceListEmail(self.scenario.listEmail);
			}
			self.studentsboxOn=false;
		}else{
			/*Apri il div*/
			self.studentsboxOn=true;
		}
		if (!container3.is(e.target) && container3.has(e.target).length === 0){
			/*Chiudi il div*/
			self.charactersboxOn=false;
		}else{
			/*Apri il div*/
			self.charactersboxOn=true;
		}
		if (!container4.is(e.target) && container4.has(e.target).length === 0){
			/*Chiudi il div*/
			self.associationboxOn=false;
		}else{
			/*Apri il div*/
			self.associationboxOn=true;
		}
		if (!container5.is(e.target) && container5.has(e.target).length === 0){
			/*Chiudi il div*/
			self.collaboratorsboxOn=false;
		}else{
			/*Apri il div*/
			self.collaboratorsboxOn=true;
		}
	}
}]);

