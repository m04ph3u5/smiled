angular.module('smiled.application').controller('dashboardAdminCtrl', ['loggedUser','modalService','apiService','CONSTANTS',
   function dashboardCtrl(loggedUser,modalService,apiService, CONSTANTS){
	
	var self = this;
	var order=true;
	self.typeOrder="creationDate";
	
	self.user = loggedUser;
	var nItemDefault=10;
	var nPagDefault=0;
	var maxItemDefault=20;
	
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	
	self.nItemStudents=nItemDefault;
	self.nItemTeachers=nItemDefault;
	self.nItemExceptions=nItemDefault;
	self.nItemScenarios=nItemDefault;
	
	self.nPagStudents=nPagDefault;
	self.nPagTeachers=nPagDefault;
	self.nPagExceptions=nPagDefault;
	self.nPagScenarios=nPagDefault;
	
	self.myListOfTeachers = [];
	self.myListOfStudents = [];
	self.myListOfExceptions = [];
	self.myListOfScenarios = [];
	
	self.numExceptionsFounded=0;
	self.numTeachersFounded=0;
	self.numStudentsFounded=0;
	self.numScenariosFounded=0;
	
	self.calculateCover = function (id){
		return CONSTANTS.urlScenarioCover(id);
	}
	
	self.switchTypeOrder = function(){
		self.searchScenarios();
	}
	self.searchScenarios = function(){
		if(self.nItemScenarios>maxItemDefault)
			self.nItemScenarios=maxItemDefault;
		
		if(self.typeOrder=="creationDate"){
			order = true;
		}else{
			order = false;
		}
		apiService.getPagedScenarios(self.nPagScenarios, self.nItemScenarios, order).then(
    			function(data){
    				self.numScenariosFounded= data.totalElements;
    				self.myListOfScenarios = data.content;
    				if(self.myListOfScenarios.length==0)
    					self.noMoreScenarios = "Nessun utente trovato in questa pagina";
    				else
    					self.noMoreScenarios = "";
    			}, function(reason){
    				console.log("errore");
    				self.numScenariosFounded= 0;
    			}
    	);
	}
	
	self.searchTeachers = function(){
		if(self.nItemTeachers>maxItemDefault)
			self.nItemTeachers=maxItemDefault;
		apiService.getPagedTeachers(self.nPagTeachers, self.nItemTeachers).then(
    			function(data){
    				self.numTeachersFounded= data.totalElements;
    				self.myListOfTeachers = data.content;
    				if(self.myListOfTeachers.length==0)
    					self.noMoreTeachers = "Nessun utente trovato in questa pagina";
    				else
    					self.noMoreTeachers = "";
    			}, function(reason){
    				console.log("errore");
    				self.numTeachersFounded= 0;
    			}
    	);
	}
	self.searchStudents = function(){
		if(self.nItemStudents>maxItemDefault)
			self.nItemStudents=maxItemDefault;
		apiService.getPagedStudents(self.nPagStudents, self.nItemStudents).then(
    			function(data){
    				self.numStudentsFounded= data.totalElements;
    				self.myListOfStudents = data.content;
    				if(self.myListOfStudents.length==0)
    					self.noMoreStudents = "Nessun utente trovato";	
    				else
    					self.noMoreStudents = "";
    			}, function(reason){
    				console.log("errore");
    				self.numStudentsFounded= 0;
    			}
    	);
	}
	
	self.searchExceptions = function(){
		if(self.nItemExceptions>maxItemDefault)
			self.nItemExceptions=maxItemDefault;
		apiService.getPagedExceptions(self.nPagExceptions, self.nItemExceptions).then(
    			function(data){
    				self.numExceptionsFounded= data.totalElements;
    				self.myListOfExceptions = data.content;
    				if(self.myListOfExceptions.length==0)
    					self.noMoreExceptions = "Nessuna eccezione trovata in questa pagina";
    				else{
    					self.noMoreExceptions = "";
    					console.log(self.myListOfExceptions[0]);
    				}
    			}, function(reason){
    				console.log("errore");
    				self.numExceptionsFounded= 0;
    			}
    	);
	}
	
	self.showResetExceptions = function(){
		if (self.myListOfExceptions.length>0 || self.nPagExceptions!=nPagDefault || self.nItemExceptions!=nItemDefault)
			return true;
		else return false;
	}
	self.showResetScenarios = function(){
		if (self.myListOfScenarios.length>0 || self.nPagScenarios!=nPagDefault || self.nItemScenarios!=nItemDefault)
			return true;
		else return false;
	}
	
	self.showResetTeachers = function(){
		if (self.myListOfTeachers.length>0 || self.nPagTeachers!=nPagDefault || self.nItemTeachers!=nItemDefault)
			return true;
		else return false;
	}
	self.showResetStudents = function(){
		if (self.myListOfStudents.length>0 || self.nPagStudents!=nPagDefault || self.nItemStudents!=nItemDefault)
			return true;
		else return false;
	}
	
	self.resetExceptions = function(){
		self.myListOfExceptions = [];
		self.nItemExceptions=nItemDefault;
		self.nPagExceptions=0;
		self.noMoreExceptions = "";
		self.numExceptionsFounded=0;
	}
	self.resetScenarios = function(){
		self.myListOfScenarios = [];
		self.nItemScenarios=nItemDefault;
		self.nPagScenarios=0;
		self.noMoreScenarios = "";
		self.numScenariosFounded=0;
	}
	self.resetTeachers = function(){
		self.myListOfTeachers = [];
		self.nItemTeachers=nItemDefault;
		self.nPagTeachers=0;
		self.noMoreTeachers = "";
		self.numTeachersFounded=0;
	}
	self.resetStudents = function(){
		self.myListOfStudents = [];
		self.nItemStudents=nItemDefault;
		self.nPagStudents=0;
		self.noMoreStudents = "";
		self.numStudentsFounded=0;
	}
	
}]);
