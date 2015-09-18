angular.module("smiled.application").directive("customDatePicker",[ 'CONSTANTS', function(CONSTANTS){
	return {
		restrict: "AE",
        templateUrl: "assets/private/partials/customDatePicker.html",
        scope: {
        	startDateNumber : "@",
        	endDateNumber : "@",
        	dateNumber : "="
        },
        controller : function (){
        	var self = this;
        	
        	console.log("CUSTOM DATE PICKER DIRECITVE");
        	self.startDate = {};
        	self.endDate = {};
        	self.currentMonthDate = {};
        	
        	        	
//        	var dateToJulianNumber = function(date){
//        	     return Math.floor(( 1461 * ( date.year + 4800 + Math.floor(( date.month - 14 ) / 12) ) ) / 4) + 
//        	     Math.floor(( 367 * ( date.month - 2 - 12 * ( Math.floor(( date.month - 14 ) / 12) ) ) ) / 12) -
//        	     Math.floor(( 3 * ( Math.floor(( date.year + 4900 + Math.floor(( date.month - 14 ) / 12) ) / 100) ) ) / 4) +
//                 date.day - 32075 ;
//        	}
        	
//        	var dateToJulianNumber = function(date){
//        		var d = angular.copy(date);
////        		if(d.era=="A.C.")
////        			d.year=d.year*(-1);
//        		var c0 = Math.floor((d.month-3)/12);
//        		var x4 = d.year+c0;
//        		var x3 = parseInt(x4/100);
//        		var x2 = Math.abs(x4%100);
//        		var x1 = d.month - 12*c0 -3;
//        		return Math.floor((146097*x3)/4) + Math.floor((36525*x2)/100) + Math.floor((153*x1 + 2)/5) + d.day + 1721119;
//        	}
        	
//        	var julianNumberToDate = function(jd,date){
//        		var l = jd + 68569;
//    	        var n = Math.floor(( 4 * l ) / 146097);
//    	        l = l - Math.floor(( 146097 * n + 3 ) / 4);
//    	        var i = Math.floor(( 4000 * ( l + 1 ) ) / 1461001);
//    	        l = l - Math.floor(( 1461 * i ) / 4) + 31;
//    	        var j = Math.floor(( 80 * l ) / 2447);
//    	        date.day = l - Math.floor(( 2447 * j ) / 80);
//    	        l = Math.floor(j / 11);
//    	        date.month = j + 2 - ( 12 * l );
//    	        date.year = 100 * ( n - 49 ) + i + l;
//    	        if(date.year<0){
//    	        	date.era="A.C.";
//    	        	date.year=date.year*(-1);
//    	        }else{
//    	        	date.era="";
//    	        }
//    	        date.dow = (Math.floor(jd))%7;
//        	}
        	
//        	var julianNumberToDate = function(jd,date){
//        		var x3 = parseInt((4*jd - 6884477)/146097);
//        		var r3 = Math.abs((4*jd - 6884477)%146097);
//        		
//        		var x2 = parseInt((100*Math.floor(r3/4)+99)/36525);
//        		var r2 = Math.abs((100*Math.floor(r3/4)+99)%36525);
//        		
//        		var x1 = parseInt((5*Math.floor(r2/100)+2)/153);
//        		var r1 = Math.abs((5*Math.floor(r2/100)+2)%153);
//        		
//        		date.day = Math.floor(r1/5)+1;
//        		c0 = Math.floor((x1+2)/12);
//        		date.year = 100*x3 + x2 +c0;
//        		date.month = x1 - 12*c0 + 3;
//        		
////        		 if(date.year<0){
////     	        	date.era="A.C.";
////     	        	date.year=date.year*(-1);
////     	        }else{
////     	        	date.era="";
////     	        }
//     	        date.dow = (Math.floor(jd))%7;
//        	}
        	
        	var dateToJulianNumber = function(date){
        		var J0 = 1721117;
        		c0 = Math.floor((date.month-3)/12);
        		var j1 = Math.floor((1461*(date.year+c0))/4);
        		var j2 = Math.floor((153*date.month-1836*c0-457)/5);
        		return j1 +j2 + date.day + J0;
        	}
        	
        	var julianNumberToDate = function(jd,date){
        		var y2 = jd - 1721118;
        		var k2 = (4*y2) + 3;
        		var k1 = 5*Math.floor(Math.abs(parseInt(k2%1461))/4)+2;
        		var x1 = Math.floor(k1/153);
        		var c0 = Math.floor((x1+2)/12);
        		date.year = Math.floor(k2/1461) + c0;
        		date.month = x1 -12*c0 + 3;
        		date.day = Math.floor((Math.abs(parseInt(k1%153)))/5) + 1;
        	}
        	
        	julianNumberToDate(parseInt(self.startDateNumber), self.startDate);
        	console.log(self.startDate);
       		julianNumberToDate(self.startDateNumber-(self.startDate.day-1),self.currentMonthDate);
        
        	julianNumberToDate(parseInt(self.endDateNumber), self.endDate);
        	
        	console.log(self.currentMonthDate);
        	
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
        	
        	var elaborateDaysOfMonth = function(currentMonthDate){
	        	var numDaysOfMonth = getNumDaysOfMonth(currentMonthDate.month, currentMonthDate.year);
	        	var inserted=1;
	        	var passed=1;
	        	self.days = new Array();
	        	for(var i=0; i<5; i++){
	        		self.days[i] = new Array();
	        		for(var j=0; j<7; j++){
	        			if(currentMonthDate.dow>=passed){
	        				self.days[i][j]="";
	        			}else{
	        				if(inserted<=numDaysOfMonth){
	        					self.days[i][j]=inserted;
	        					inserted++;
	        				}
	        			}
	        			passed++;
	        		}
	        	}
	        	
        	}
        	elaborateDaysOfMonth(self.currentMonthDate);
        	console.log(self.currentMonthDate);
        	self.getMonthString = function(month){
        		return CONSTANTS.monthString(month);
        	}    
        	
        	self.getDayOfWeekString = function(day){
        		return CONSTANTS.dayOfWeekString(day);
        	}
        	
        	self.nextMonth =function(){
        		var n = dateToJulianNumber(self.currentMonthDate);
        		n+=getNumDaysOfMonth(self.currentMonthDate.month,self.currentMonthDate.year);
        		julianNumberToDate(n,self.currentMonthDate);
        		elaborateDaysOfMonth(self.currentMonthDate);
        	}
        	
        	self.prevMonth = function(){
        		var n = dateToJulianNumber(self.currentMonthDate);
        		n-=getNumDaysOfMonth(self.currentMonthDate.month-1,self.currentMonthDate.year);
        		julianNumberToDate(n,self.currentMonthDate);
        		elaborateDaysOfMonth(self.currentMonthDate);
        	}
        
        },
        controllerAs: 'vm',
        bindToController: true
    };
}]);