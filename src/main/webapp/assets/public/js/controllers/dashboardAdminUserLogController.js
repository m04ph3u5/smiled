angular.module('smiled.application').controller('dashboardAdminUserLogCtrl' ,['apiService','CONSTANTS','$stateParams',
   function dashboardCtrl(apiService, CONSTANTS, $stateParams){
	
	var self = this;
	var idUser = $stateParams.idUser;
	var nItemDefault=20;
	var nPagDefault=0;
	var maxItemDefault=20;
	self.nItemLogs=nItemDefault;
	
	self.nPagLogs=nPagDefault;
	
	self.myListOfLogs = [];
	
	
	self.numLogsFounded=0;
	
	
	self.showErrorSearchBy = false;
	
	
	self.noMoreLogs = "";


	
	/*
	 * INIZIO-----------------------------------------------------------Seleziona intervallo date per i log
	 */
	self.showTwoCal=false;
	var today = new Date();
	self.dateStartOptions = {
			"regional" : "it",
			"minDate" : new Date(2015,0,1,0,0,0,0),
			"maxDate" : today,
		    "numberOfMonths": 1
	};
	self.dateEndOptions = {
			"regional" : "it",
			"minDate" : new Date(2015,0,1,0,0,0,0),
			"maxDate" : today,
            "numberOfMonths": 1
	};
	
	var weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate()-7);
	self.dateEnd=today;
	self.dateStart=weekAgo;
	/*
	 * FINE-----------------------------------------------------------Seleziona intervallo date per i log
	 */
	self.typeOfLog="ALL";
	var count = 0;

	
	
	self.toggleShowClose = function(){
		self.showClose = !self.showClose;
	}

	self.getInfoStatistics = function(user){
		
		self.infoStatistics = {};
		self.nameOfUser = user.firstName+" "+user.lastName;
		apiService.getInfoStatistics(user.id, null).then(
    			function(data){
    				console.log("getInfoStatistics done!!!");
    				console.log(data);
    				self.infoStatistics=data;

    			}, function(reason){
    				console.log("errore in getInfoStatistics!!!");

    			}
    	);
	}
	
	self.changeLogsToPrev = function(){
		self.nPagLogs--;
		self.searchLogs();
	}
	self.changeLogsToNext = function(){
		self.nPagLogs++;
		self.searchLogs();
	}
	
	
	self.searchLogs = function(){
		if(self.nItemLogs>maxItemDefault)
			self.nItemLogs=maxItemDefault;
		var start=null;
		var end = null;
		var type=null;
		console.log("searchLogs");
		console.log(self.typeOfLog);
		type=self.typeOfLog;
		if(type=="ALL")
			type=null;
		if(self.showTwoCal){
			start = self.dateStart;
			end = self.dateEnd;
		}
		apiService.getPagedLogs(start, end, type, self.nPagLogs, self.nItemLogs, null, null).then(
    			function(data){
    				self.numLogsFounded= data.totalElements;
    				self.myListOfLogs = data.content;
    				if(self.myListOfLogs.length==0)
    					self.noMoreLogs = "Nessun log trovato in questa pagina";
    				else{
    					self.noMoreLogs = "";
    					for(var i=0; i< self.myListOfLogs.length; i++){
    						self.whoIsUser(self.myListOfLogs[i]);
    						self.whoIsScenario(self.myListOfLogs[i]);
    					}
    				}
    			}, function(reason){
    				console.log("errore");
    				self.numLogsFounded= 0;
    			}
    	);
	}
	
	
	self.showResetLogs = function(){
		if (self.myListOfLogs.length>0 || self.nPagLogs!=nPagDefault || self.nItemLogs!=nItemDefault || self.noMoreLogs!="")
			return true;
		else return false;
	}
	
	
	self.resetLogs = function(){
		self.myListOfLogs = [];
		self.nItemLogs=nItemDefault;
		self.nPagLogs=0;
		self.noMoreLogs = "";
		self.numLogsFounded=0;
		self.showTwoCal=false;
		self.typeOfLog="ALL";
	}
	

	
}]);
