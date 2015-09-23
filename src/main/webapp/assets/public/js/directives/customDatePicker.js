angular.module("smiled.application").directive("customDatePicker",[ 'CONSTANTS', function(CONSTANTS){
	return {
		restrict: "AE",
        templateUrl: "assets/private/partials/customDatePicker.html",
        scope: {
        	startDateNumber : "=?",
        	endDateNumber : "=?",
        	dateNumber : "=?",
        	date : "=?",
        	startDate : "=?",
        	endDate : "=?",
        	dateString : "=?",
        	timeNumber : "=?"
        },
        controller : function (){
        	var self = this;
        	
        	var selected={};
        	
//        	if(!self.timeNumber){
//        		self.timeNumber=0;
//        		console.log("RESET TIME NUMBER");
//        	}
        	if(self.startDate){
        		self.startDate.day=parseInt(self.startDate.day);
        		self.startDate.month=parseInt(self.startDate.month);
        		self.startDate.year=parseInt(self.startDate.year);
        	}
         	
        	if(self.endDate){
        		self.endDate.day=parseInt(self.endDate.day);
        		self.endDate.month=parseInt(self.endDate.month);
        		self.endDate.year=parseInt(self.endDate.year);
        	}
        	/*Se non viene passata una data iniziale il datepicker prende come valore minimo assumibile il minimo
        	 * rappresentabile da un Julian Day Number (di seguito JDN), ovvero il 24 novembre del 4713 A.C. */
        	if(!self.startDate && !self.startDateNumber){
        		self.startDateNumber=0;
        		self.startDate = {};
        	}
        		
        	/*Se non viene passata una data finale il datepicker prende come valore massimo assumibile un valore di JDN
        	 * che rappresenta l'anno 100.000 D.C */
        	if(!self.endDateNumber && !self.endDate){
        		self.endDateNumber=38245427;
        		self.endDate = {};
        	}
        
        	console.log("CUSTOM DATE PICKER DIRECITVE");
        	
        	self.currentMonthDate = {};
        	self.days;
        	var years = new Array();
        	var yearPage=0;
        	var yearPageSize=16;
        	var maxPage=0;
        	var yearMatrixSize=4;
        	self.showDays=true;
        	self.yearMatrix = new Array();
        	for(var i=0;i<yearMatrixSize;i++){
            	self.yearMatrix[i] = new Array();
        	}


        	var emptyYearMatrix = function(){
        		for(var i=0; i<yearMatrixSize;i++)
        			for(var j=0; j<yearMatrixSize;j++)
        				self.yearMatrix[i][j]="";
        	}
        	
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
        	
        	if(self.dateNumber){
        		self.currentDate = {};
        		julianNumberToDate(self.dateNumber, self.currentDate);
        	}
        	
        	if(self.startDateNumber)
        		julianNumberToDate(parseInt(self.startDateNumber), self.startDate);
        	else
        		self.startDateNumber=dateToJulianNumber(self.startDate);
        	if(self.endDateNumber)
        		julianNumberToDate(parseInt(self.endDateNumber), self.endDate);
        	else
        		self.endDateNumber=dateToJulianNumber(self.endDate);

        	if(self.dateNumber){
        		julianNumberToDate(self.dateNumber-(self.currentDate.day-1),self.currentMonthDate);
        	}else
        		julianNumberToDate(self.startDateNumber-(self.startDate.day-1),self.currentMonthDate);
        		

//        	if(!self.startDate)
//        		julianNumberToDate(parseInt(self.startDateNumber), self.startDate);
//        	else
//        	{
//        		self.startDateNumber = dateToJulianNumber(self.startDate);
//        		console.log(self.startDateNumber);
//        	}
//        	
//        	if(!self.endDate)
//        		julianNumberToDate(parseInt(self.endDateNumber), self.endDate);
//        	else{
//        		self.endDateNumber = dateToJulianNumber(self.endDate);
//        		console.log(self.endDateNumber);
//        	}
//
//        	if(!self.dateNumber && !self.date)
//           		julianNumberToDate(self.startDateNumber-(self.startDate.day-1),self.currentMonthDate);
//           	else if(!self.date)
//           		julianNumberToDate(self.dateNumber,self.currentMonthDate);
//           	else{
//           		var nDate = dateToJulianNumber(self.date);
//           		if(nDate)
//           			julianNumberToDate(nDate-(self.startDate.day-1),self.currentMonthDate);
//           		else
//           			julianNumberToDate(self.startDateNumber-(self.startDate.day-1),self.currentMonthDate);
//           	}
           		

        	console.log(self.currentMonthDate);
        	
        	var getTimeToSeconds=function(timeNumber,t){
        		t.hours=parseInt(timeNumber/3600);
        		timeNumber=timeNumber%3600;
        		t.minutes=parseInt(timeNumber/60);
        		timeNumber=timeNumber%60;
        		t.seconds=timeNumber;
        	}
        	
        	var writeStringCurrent = function(){
        		var era = self.currentMonthDate.year > 0 ? "" : " a.C.";
        		var s = getMonthString(self.currentMonthDate.month) + " "+ Math.abs(self.currentMonthDate.year) + era;
        		self.currentMonthDate.title=s;
        	}
        	
        	writeStringCurrent();
           	
           	var st=angular.copy(self.startDate);
           	var en=angular.copy(self.endDate);
           	var k=0;
    		while(st.year<=en.year){
    			years[k]=st.year;
    			st.year++;
    			k++;
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
        	
        	var elaborateDaysOfMonth = function(currentMonthDate){
        		selected = {};
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
	        					self.days[i][j] = {};
	        					self.days[i][j].val=inserted;
	        					self.days[i][j].selected=false;
	        					if((currentMonthDate.year==self.startDate.year && currentMonthDate.month<self.startDate.month) ||
	        							(currentMonthDate.year==self.startDate.year && currentMonthDate.month==self.startDate.month && inserted<self.startDate.day) ||
	        							(currentMonthDate.year==self.endDate.year && currentMonthDate.month>self.endDate.month) ||
	        							(currentMonthDate.year==self.endDate.year && currentMonthDate.month==self.endDate.month && inserted>self.endDate.day)){
	        						self.days[i][j].inactive=true;
	        					}
	        					if(self.currentDate && self.currentDate.year==currentMonthDate.year && self.currentDate.month==currentMonthDate.month && self.currentDate.day==inserted){
	        						self.days[i][j].selected=true;
	        						selected=self.days[i][j];
	        					}
	        					
	        					inserted++;
	        				}
	        			}
	        			passed++;
	        		}
	        	}
	        	if(inserted<=numDaysOfMonth){
	        		self.days[5] = new Array();
	        		for(var k=0; inserted<=numDaysOfMonth; k++){
	        			self.days[5][k] = {};
	        			self.days[5][k].val = inserted;
    					self.days[5][k].selected=false;
	        			if((currentMonthDate.year==self.startDate.year && currentMonthDate.month<self.startDate.month) ||
    							(currentMonthDate.year==self.startDate.year && currentMonthDate.month==self.startDate.month && inserted<self.startDate.day) ||
    							(currentMonthDate.year==self.endDate.year && currentMonthDate.month>self.endDate.month) ||
    							(currentMonthDate.year==self.endDate.year && currentMonthDate.month==self.endDate.month && inserted>self.endDate.day)){
    						self.days[5][k].inactive=true;
    					}
	        			if(self.currentDate && self.currentDate.year==currentMonthDate.year && self.currentDate.month==currentMonthDate.month && self.currentDate.day==inserted){
    						self.days[5][k].selected=true;
    						selected=self.days[5][k];
	        			}
	        			inserted++;
	        		}
	        	}
	        	
	        	writeStringCurrent();
	        	
        	}
        	elaborateDaysOfMonth(self.currentMonthDate);
        	console.log(self.currentMonthDate);
           
        	
        	
        	self.getDayOfWeekString = function(day){
        		return CONSTANTS.dayOfWeekString(day);
        	}
        	
        	self.nextMonth =function(){
        		if(self.showDays){

	        		var n = dateToJulianNumber(self.currentMonthDate);
	        		n+=getNumDaysOfMonth(self.currentMonthDate.month,self.currentMonthDate.year);
	        		console.log(n+" - "+self.endDateNumber);
	        		if(n<=self.endDateNumber){
	        			julianNumberToDate(n,self.currentMonthDate);
	        			elaborateDaysOfMonth(self.currentMonthDate);
	        		}
	        		else
	        			console.log("No more next");//TODO cambiare classe freccia dx per non renderla più cliccabile
        		}else{
            		var index = self.yearMatrix[yearMatrixSize-1][yearMatrixSize-1]+1-self.startDate.year;
            		if(index<years.length && index>0){
	        			emptyYearMatrix();
	        			if(years[index]>=0)
	        				self.yearsInterval = ""+years[index]+" d.C.";
	        			else
	        				self.yearsInterval = ""+Math.abs(years[index])+" a.C.";

	            		console.log(self.yearMatrix[yearMatrixSize-1][yearMatrixSize-1]);
	    				for(var i=0; i<yearMatrixSize; i++)
	            			for(var j=0; j<yearMatrixSize && index<years.length && index>0; j++){
	            				self.yearMatrix[i][j]=years[index];
	            				index++;
	            			}
	    				if(years[index-1]>=0)
	    					self.yearsInterval +=" - "+years[index-1]+" d.C.";
	        			else
	    					self.yearsInterval +=" - "+Math.abs(years[index-1])+" a.C.";
	            		
            		}
        		}
        	}
        	
        	self.prevMonth = function(){
        		if(self.showDays){
	        		var n = dateToJulianNumber(self.currentMonthDate);
	        		n-=getNumDaysOfMonth(self.currentMonthDate.month-1,self.currentMonthDate.year);
	        		if(n>=self.startDateNumber){
	            		julianNumberToDate(n,self.currentMonthDate);
	        			elaborateDaysOfMonth(self.currentMonthDate);
	        		}else{
	        			n+=self.startDate.day;
	        			if(n>=self.startDateNumber){
		            		julianNumberToDate(n,self.currentMonthDate);
		        			elaborateDaysOfMonth(self.currentMonthDate);
		        		}else{
		        			console.log("No more prev");//TODO cambiare classe freccia sx per non renderla più cliccabile	        			
		        		}
	        		}
        		}else{
            		var index = self.yearMatrix[0][0]-(yearMatrixSize*yearMatrixSize)-self.startDate.year;
            		if(index<0)
            			index=0;
            		if(index<years.length){
	        			emptyYearMatrix();
	        			if(years[index]>=0)
	        				self.yearsInterval = ""+years[index]+" d.C.";
	        			else
	        				self.yearsInterval = ""+Math.abs(years[index])+" a.C.";	    				
	        			for(var i=0; i<yearMatrixSize; i++)
	            			for(var j=0; j<yearMatrixSize && index<years.length && index>=0; j++){
	            				self.yearMatrix[i][j]=years[index];
	            				index++;
	            			}    
	        				if(years[index-1]>=0)
		    					self.yearsInterval +=" - "+years[index-1]+" d.C.";
		        			else
		    					self.yearsInterval +=" - "+Math.abs(years[index-1])+" a.C.";            		}
        		}

        	}
        	
        	self.selectDate = function(row, col){
        		if(!self.days[row][col].inactive){
        			if(selected)
        				selected.selected = false;
	        		var date = {};
	        		date.day = self.days[row][col].val;
	        		date.month = self.currentMonthDate.month;
	        		date.year = self.currentMonthDate.year;
	        		self.dateNumber=dateToJulianNumber(date);
	        		console.log(self.dateNumber);
	        		self.days[row][col].selected=true;
	        		selected = self.days[row][col];
	        		self.dateString=self.days[row][col].val+" "+self.currentMonthDate.title;
	        		var t = {};
	        		getTimeToSeconds(self.timeNumber,t);
	        		self.dateString+=" "+t.hours+":";
	        		if(t.minutes<10)
	        			self.dateString+="0"+t.minutes;
	        		else
	        			self.dateString+=t.minutes;
	        	}
        	}
        	
        	self.switchToShowYears = function(){
        		self.showDays=false;
        		emptyYearMatrix();
        		var index = self.currentMonthDate.year-self.startDate.year;
        		if(years[index]>=0)
    				self.yearsInterval = ""+years[index]+" d.C.";
    			else
    				self.yearsInterval = ""+Math.abs(years[index])+" a.C.";	    		        		
        		for(var i=0; i<yearMatrixSize; i++)
        			for(var j=0; j<yearMatrixSize && index<years.length; j++){
        				self.yearMatrix[i][j]=years[index];
        				console.log(self.yearMatrix[i][j]);
        				index++;
        			}
        		if(years[index-1]>=0)
					self.yearsInterval +=" - "+years[index-1]+" d.C.";
    			else
					self.yearsInterval +=" - "+Math.abs(years[index-1])+" a.C.";
        	}
        	
        	self.switchToShowDays = function(){
        		self.showDays=true;
        	}
        	
        	self.selectYear = function(row,col){
        		self.currentMonthDate.year = self.yearMatrix[row][col];
        		if(self.currentMonthDate.year==self.startDate.year)
        			self.currentMonthDate.month==self.startDate.month;
        		else
        			self.currentMonthDate.month = 1;
        		self.currentMonthDate.day = 1;
        		self.switchToShowDays();
    			elaborateDaysOfMonth(self.currentMonthDate);
        	}
        	
        	
        	/*TIMEPICKER*/
        	
        	var getSecondsOfTime = function(date){
        		var hour = date.getHours();
        		var minute = date.getMinutes();
        		var seconds = date.getSeconds();
        		
        		self.timeNumber=seconds+minute*60+hour*3600;
        		console.log(self.timeNumber);
        	}
        	if(!self.timeNumber){
        		console.log("NOT TIME NUMBER");
        		self.myTime = new Date();
            	getSecondsOfTime(self.myTime);
        	}
        	else{
        		var d = new Date();
        		var t = {};
        		getTimeToSeconds(self.timeNumber,t);
        		self.myTime = new Date(d.getFullYear(),d.getMonth(),d.getDay(), t.hours, t.minutes, t.seconds);
        	}
        	self.changed = function () {
        		getSecondsOfTime(self.myTime);
        	};
        	/**/
        },
        controllerAs: 'vm',
        bindToController: true
    };
}]);