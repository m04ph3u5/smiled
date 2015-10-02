 angular.module('smiled.application').factory('dateUtil', ['CONSTANTS',
     function apiService(CONSTANTS){
	 
	var julianNumberToDate = function(jd, date){
  		  var l = jd + 68569;
  	      var n = parseInt(( 4 * l ) / 146097);
  	      l = l - parseInt(( 146097 * n + 3 ) / 4);
  	      var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
  	      l = l - parseInt(( 1461 * i ) / 4) + 31;
  	      var j = parseInt(( 80 * l ) / 2447);
  	      date.day = l - parseInt(( 2447 * j ) / 80);
  	      l = parseInt(j / 11);
  	      date.month = j + 2 - ( 12 * l );
  	      date.year = 100 * ( n - 49 ) + i + l;
  	      date.dow = jd%7;
  	}
  	
  	        	
  	var dateToJulianNumber = function(date){
  		 
  		  console.log("dateToJulianNumber: "+date.year);
  		  var jd = parseInt(( 1461 * ( date.year + 4800 + parseInt(( date.month - 14 ) / 12) ) ) / 4) +
            parseInt(( 367 * ( date.month - 2 - 12 *  parseInt(( date.month - 14 ) / 12)  ) ) / 12) -
            parseInt(( 3 * parseInt(( date.year + 4900 + parseInt(( date.month - 14 ) / 12) ) / 100)  ) / 4) +
            date.day - 32075 ;
  		return jd;
  	}
  	
	var getMonthString = function(month){
		return CONSTANTS.monthString(month);
	} 
	
	var getTimeToSeconds=function(timeNumber,t){
		t.hours=parseInt(timeNumber/3600);
		timeNumber=timeNumber%3600;
		t.minutes=parseInt(timeNumber/60);
		timeNumber=timeNumber%60;
		t.seconds=timeNumber;
	}
	
 	var getNumDaysOfMonth = function(month, year){
		if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)
			return 31;
		else if(month==4 || month==6 || month==9 || month==11)
			return 30;
		else{
			if((year%4==0 && year%100!=0) || (year%400==0))
				return 29;
			else
				return 28;
		}
	}
 	
 	var dateTimeToString = function(jdn,tn){
 		var date = {};
 		var t = {};
 		if(jdn)
 			julianNumberToDate(jdn, date);	
 		if(tn && (typeof tn !== "undefined"))
 			getTimeToSeconds(tn, t);
 		var s="";
 		if(date)
 			s+=date.day+" "+getMonthString(date.month)+" "+Math.abs(date.year);
 		if(date.year<0)
 			s+=" a.C.";
 		
 		if(t && t.hours && t.minutes){
 			if(t.hours<10)
 				s+=" 0"+t.hours;
 			else
 				s+=" "+t.hours;
 			if(t.minutes<10)
 				s+=":0"+t.minutes;
 			else
 				s+=":"+t.minutes;
 		}
 		
 		return s;
 	}
 	
 	var dateTimeToStringShort = function(jdn,tn){
 		var date = {};
 		var t = {};
 		if(jdn)
 			julianNumberToDate(jdn, date);	
 		if(tn && (typeof tn !== "undefined"))
 			getTimeToSeconds(tn, t);
 		var s="";
 		if(date)
 			s+=date.day+"/"+date.month+"/"+Math.abs(date.year);
 		if(date.year<0)
 			s+=" a.C.";
 		
 		if(t && t.hours && t.minutes){
 			if(t.hours<10)
 				s+=" 0"+t.hours;
 			else
 				s+=" "+t.hours;
 			if(t.minutes<10)
 				s+=":0"+t.minutes;
 			else
 				s+=":"+t.minutes;
 		}
 		
 		return s;
 	}
  	
  	return {
  		julianNumberToDate : julianNumberToDate,
  		dateToJulianNumber : dateToJulianNumber,
  		getMonthString : getMonthString,
  		getTimeToSeconds : getTimeToSeconds,
  		getNumDaysOfMonth : getNumDaysOfMonth,
  		dateTimeToString : dateTimeToString,
  		dateTimeToStringShort: dateTimeToStringShort
  	}
	 	
 }]);