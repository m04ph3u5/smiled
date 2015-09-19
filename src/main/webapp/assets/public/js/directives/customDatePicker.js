angular.module("smiled.application").directive("customDatePicker",[ 'CONSTANTS', function(CONSTANTS){
	return {
		restrict: "AE",
        templateUrl: "assets/private/partials/customDatePicker.html",
        scope: {
        	startDateNumber : "@?",
        	endDateNumber : "@?",
        	dateNumber : "="
        },
        controller : function (){
        	var self = this;
        	/*Se non viene passata una data iniziale il datepicker prende come valore minimo assumibile il minimo
        	 * rappresentabile da un Julian Day Number (di seguito JDN), ovvero il 24 novembre del 4713 A.C. */
        	if(!self.startDateNumber)
        		self.startDateNumber=0;
        	/*Se non viene passata una data finale il datepicker prende come valore massimo assumibile un valore di JDN
        	 * che rappresenta l'anno 100.000 D.C */
        	if(!self.endDateNumber)
        		self.endDateNumber=38245427;
        	
        	console.log("CUSTOM DATE PICKER DIRECITVE");
        	self.startDate = {};
        	self.endDate = {};
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
        	      if(date.year<0){
        	    	  date.year *=-1;
        	    	  date.era = "A.C.";
        	      }
        	      else
        	    	  date.era = "";
        	}
        	
        	        	
        	var dateToJulianNumber = function(date){
        		  if(date.era=="A.C.")
        			  date.year*=-1;
        		  console.log("dateToJulianNumber: "+date.year);
        		  var jd = parseInt(( 1461 * ( date.year + 4800 + parseInt(( date.month - 14 ) / 12) ) ) / 4) +
                  parseInt(( 367 * ( date.month - 2 - 12 *  parseInt(( date.month - 14 ) / 12)  ) ) / 12) -
                  parseInt(( 3 * parseInt(( date.year + 4900 + parseInt(( date.month - 14 ) / 12) ) / 100)  ) / 4) +
                  date.day - 32075 ;
        		return jd;
        	}
        	
        	julianNumberToDate(parseInt(self.startDateNumber), self.startDate);
        	console.log(self.startDate);
        	julianNumberToDate(self.startDateNumber-(self.startDate.day-1),self.currentMonthDate);
           	julianNumberToDate(parseInt(self.endDateNumber), self.endDate);
        	
           	
           	var t=self.startDate.year;
           	var k=0;
    		while(t<self.endDate.year){
    			years[k]=t;
    			t++;
    			k++;
    		}
    		if(years.length%(yearMatrixSize*yearMatrixSize)==0)
    			maxPage = years.length/(yearMatrixSize*yearMatrixSize) -1;
    		else
    			maxPage = parseInt(years.length/(yearMatrixSize*yearMatrixSize));
        	
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
	        	if(inserted<=numDaysOfMonth){
	        		self.days[5] = new Array();
	        		for(var k=0; inserted<=numDaysOfMonth; k++){
	        			self.days[5][k] = inserted;
	        			inserted++;
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
        		if(self.showDays){

	        		var n = dateToJulianNumber(self.currentMonthDate);
	        		n+=getNumDaysOfMonth(self.currentMonthDate.month,self.currentMonthDate.year);
	        		if(n<=self.endDateNumber){
	        			julianNumberToDate(n,self.currentMonthDate);
	        			elaborateDaysOfMonth(self.currentMonthDate);
	        		}
	        		else
	        			console.log("No more next");//TODO cambiare classe freccia dx per non renderla più cliccabile
        		}else{
        			if(yearPage<maxPage){
        				yearPage++;
        				var index=yearPage*(yearMatrixSize*yearMatrixSize);
        				for(var i=0; i<yearMatrixSize; i++)
                			for(var j=0; j<yearMatrixSize && index<years.length; j++){
                				self.yearMatrix[i][j]=years[index];
                				console.log(self.yearMatrix[i][j]);
                				index++;
                			}
        				
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
	        		}
	        		else
	        			console.log("No more prev");//TODO cambiare classe freccia sx per non renderla più cliccabile
        		}else{
        			if(yearPage!=0){
        				yearPage--;
        				var index=yearPage*(yearMatrixSize*yearMatrixSize);
        				for(var i=0; i<yearMatrixSize; i++)
                			for(var j=0; j<yearMatrixSize && index<years.length; j++){
                				self.yearMatrix[i][j]=years[index];
                				console.log(self.yearMatrix[i][j]);
                				index++;
                			}
        				
        			}
        		}

        	}
        	
        	self.selectDate = function(row, col){
        		console.log("Giorno scelto: "+self.days[row][col]+"/"+self.currentMonthDate.month+"/"+self.currentMonthDate.year+" "+self.currentMonthDate.era);
        		var date = {};
        		date.day = self.days[row][col];
        		date.month = self.currentMonthDate.month;
        		if(date.era=="A.C.")
        			date.year = self.currentMonthDate.year * (-1);
        		else
        			date.year = self.currentMonthDate.year;
        		self.dateNumber=dateToJulianNumber(date);
        	}
        	
        	self.switchToShowYears = function(){
        		self.showDays=false;
        		var index = self.currentMonthDate.year-self.startDate.year;
        		yearPage = index%(yearMatrixSize*yearMatrixSize);
        		for(var i=0; i<yearMatrixSize; i++)
        			for(var j=0; j<yearMatrixSize && index<years.length; j++){
        				self.yearMatrix[i][j]=years[index];
        				console.log(self.yearMatrix[i][j]);
        				index++;
        			}
        	}
        	
        	self.switchToShowDays = function(){
        		self.showDays=true;
        	}
        
        },
        controllerAs: 'vm',
        bindToController: true,
        link : function(scope, elem, attrs, ctrl){
        	
        }
    };
}]);