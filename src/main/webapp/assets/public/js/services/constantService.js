angular.module("smiled.application").constant("CONSTANTS",{
	"realDateFormatWithHour": "d-M-yyyy H:mm",
	"realDateFormatWithoutHour": "d-M-yyyy",
	"baseUrl" : "https://localhost:8443/ThesisProject",
	"insertHistoricalDate" : "Data il post", 
	"insertHistoricalDateEvent" : "Data l'evento", 
	"urlMeCover" : "api/v1/me/cover",
	"urlUserCover" : function(id){
							return "api/v1/users/"+id+"/cover"
						},
	"urlScenarioCover" : function(id){
						 	return "api/v1/scenarios/"+id+"/cover";
						 },
	"urlCharacterCover" : function(idScenario, idCharacter){
		 					return "api/v1/scenarios/"+idScenario+"/characters/"+idCharacter+"/cover";
		 				  },
	"urlMediaScenarioPost": function(idScenario){
								return "api/v1/scenarios/"+idScenario+"/media";
	},
	"urlMedia" : function(id){
		return "api/v1/media/"+id;
	},
	"urlPost" : function(idScenario, idPost){
			return "api/v1/scenarios/"+idScenario+"/posts/"+idPost;
	},
	"monthString": function(month){
		var m;
		console.log(month);
		switch(month){
			case '1': {
				m = "gennaio";
				break;
			}
			case '2': {
				m = "febbraio";
				break;
			}
			case '3': {
				m = "marzo";
				break;
			}
			case '4': {
				m = "aprile";
				break;
			}
			case '5': {
				m = "maggio";
				break;
			}
			case '6': {
				m = "giugno";
				break;
			}
			case '7': {
				m = "luglio";
				break;
			}
			case '8': {
				m = "agosto";
				break;
			}
			case '9': {
				m = "settembre";
				break;
			}
			case '10': {
				m = "ottobre";
				break;
			}
			case '11': {
				m = "novembre";
				break;
			}case '12': {
				m = "dicembre";
				break;
			}
		}
		console.log(m);
		return m;
	}
});
