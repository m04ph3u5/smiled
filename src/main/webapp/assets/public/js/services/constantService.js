angular.module("smiled.application").constant("CONSTANTS",{
	"realDateFormatWithHour": "d-M-yyyy H:mm",
	"realDateFormatWithoutHour": "d-M-yyyy",
	"baseUrl" : "https://localhost:8443/ThesisProject",
	"urlMeCover" : "api/v1/me/cover",
	"urlUserCover" : function(id){
							return "api/v1/users/"+id+"/cover"
						},
	"urlScenarioCover" : function(id){
						 	return "api/v1/scenarios/"+id+"/cover";
						 },
	"urlCharacterCover" : function(idScenario, idCharacter){
		 					return "api/v1/scenarios/"+idScenario+"/characters/"+idCharacter+"/cover";
		 				  }
});