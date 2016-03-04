angular.module("smiled.application").constant("CONSTANTS",{
	"realDateFormatWithHour": "d-M-yyyy H:mm",
	"realDateFormatWithSecond": "d-M-yyyy H:mm:ss",
	"realDateFormatWithoutHour": "d-M-yyyy",
	
	"realDateFormatOnlyDay" : "d",
	"realDateFormatOnlyMonth" : "MMM",
//	"baseUrl" : "https://localhost:8443/ThesisProject",
	"insertHistoricalDate" : "Data il post", 
	"insertHistoricalDateEvent" : "Data l'evento", 
	"historicalDateOutInterval": "Inserisci una data valida nell'intervallo dello scenario",
	"lengthOfTooltipLikesList" : 10,
	"visibleComment": 3,
	"numberOfPostForScroll" : 10,
	"basicTeacherCover" : "assets/public/img/ic_teacher.png",
	"basicStudentCover" : "assets/public/img/ic_student.png",
//	"regexForSearchTag" : "/\b[A-Z][-'a-zA-Z]+,?\s[A-Z][-'a-zA-Z]{0-19}\b/",
	"urlMeCover" : "api/v1/me/cover",
	"urlMeCoverLarge" : "api/v1/me/coverLarge",
	"urlUserCover" : function(id){
							return "api/v1/users/"+id+"/cover"
						},
	"urlUserCoverLarge" : function(id){
		return "api/v1/users/"+id+"/coverLarge"
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
	"urlTrustedMediaScenarioPost": function(idScenario){
		return "api/v1/scenarios/"+idScenario+"/trustedMedia";
	},
	"urlMetaMediaScenarioPost": function(idScenario, idMedia){
		return "api/v1/scenarios/"+idScenario+"/media/"+idMedia+"/meta";
	},
	"urlTrustedMediaScenario": function(idScenario){
		return "api/v1/scenarios/"+idScenario+"/media/trusted/meta";
	},
	"urlDeleteTrustedMedia" : function(idScenario, idMedia){
		return "api/v1/scenarios/"+idScenario+"/trustedMedia/"+idMedia;
	},
	"urlMedia" : function(id){
		return "api/v1/media/"+id;
	},
	"urlMediaThumb" : function(id){
		return "api/v1/media/"+id+"?thumb=true";
	},
	"urlPostMedia" : function(idScenario){
		return "api/v1/scenarios/"+idScenario+"/media";
	},
	"urlPost" : function(idScenario, idPost){
			return "api/v1/scenarios/"+idScenario+"/posts/"+idPost;
	},
	"urlToolMap" : function(i){
		return "api/v1/toolMap?version="+i;
	},
	"urlMarker" : "assets/public/img/marker.png",
	"monthString": function(month){
		var m;
		switch(month){
			case 1: {
				m = "gennaio";
				break;
			}
			case 2: {
				m = "febbraio";
				break;
			}
			case 3: {
				m = "marzo";
				break;
			}
			case 4: {
				m = "aprile";
				break;
			}
			case 5: {
				m = "maggio";
				break;
			}
			case 6: {
				m = "giugno";
				break;
			}
			case 7: {
				m = "luglio";
				break;
			}
			case 8: {
				m = "agosto";
				break;
			}
			case 9: {
				m = "settembre";
				break;
			}
			case 10: {
				m = "ottobre";
				break;
			}
			case 11: {
				m = "novembre";
				break;
			}case 12: {
				m = "dicembre";
				break;
			}
		}
		return m;
	},
	"getMonths" : function(lang){
		var months = new Array();
		var month = {};
		if(lang=="it"){
			month = {value : 1, name: "gennaio"};
			months.push(angular.copy(month));
			month = {value : 2, name: "febbraio"};
			months.push(angular.copy(month));
			month = {value : 3, name: "marzo"};
			months.push(angular.copy(month));
			month = {value : 4, name: "aprile"};
			months.push(angular.copy(month));
			month = {value : 5, name: "maggio"};
			months.push(angular.copy(month));
			month = {value : 6, name: "giugno"};
			months.push(angular.copy(month));
			month = {value : 7, name: "luglio"};
			months.push(angular.copy(month));
			month = {value : 8, name: "agosto"};
			months.push(angular.copy(month));
			month = {value : 9, name: "settembre"};
			months.push(angular.copy(month));
			month = {value : 10, name: "ottobre"};
			months.push(angular.copy(month));
			month = {value : 11, name: "novembre"};
			months.push(angular.copy(month));
			month = {value : 12, name: "dicembre"};
			months.push(angular.copy(month));
		}else if(lang=="en"){
			month = {value : 1, name: "January"};
			months.push(angular.copy(month));
			month = {value : 2, name: "February"};
			months.push(angular.copy(month));
			month = {value : 3, name: "March"};
			months.push(angular.copy(month));
			month = {value : 4, name: "April"};
			months.push(angular.copy(month));
			month = {value : 5, name: "May"};
			months.push(angular.copy(month));
			month = {value : 6, name: "June"};
			months.push(angular.copy(month));
			month = {value : 7, name: "July"};
			months.push(angular.copy(month));
			month = {value : 8, name: "Agoust"};
			months.push(angular.copy(month));
			month = {value : 9, name: "September"};
			months.push(angular.copy(month));
			month = {value : 10, name: "October"};
			months.push(angular.copy(month));
			month = {value : 11, name: "November"};
			months.push(angular.copy(month));
			month = {value : 12, name: "December"};
			months.push(angular.copy(month));
		}else
			throw new Error("Not supported language");
		
		return months;
	},
	"getDays" : function(month){
		var days = new Array();
		var numDay;
		if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12){
			numDay=31;
		}else if(month==2){
			numDay=28;
		}else{
			numDay=30;
		}
			
		for(var i=1; i<=numDay; i++){
			var day = {value : i};
			days.push(day);
		}
		return days;
	},
	"dayOfWeekString": function(day){
		var d="";
		switch(day){
		case 0: {
			d="Lun";
			break;
		}
		case 1: {
			d="Mar";
			break;
		}
		case 2: {
			d="Mer";
			break;
		}
		case 3: {
			d="Gio";
			break;
		}
		case 4: {
			d="Ven";
			break;
		}
		case 5: {
			d="Sab";
			break;
		}
		case 6: {
			d="Dom";
			break;
		}
		}
		return d;
	}
});
