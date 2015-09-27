angular.module('smiled.application').controller('dashboardAdminCtrl', ['loggedUser','modalService','apiService',
   function dashboardCtrl(loggedUser,modalService,apiService){
	
	var self = this;
	console.log("dashboard admin");
	console.log(loggedUser);
	self.user = loggedUser;
	var nItemDefault=10;
	var nPagDefault=0;
	var maxItemDefault=20;
	
	self.nItemStudents=nItemDefault;
	self.nItemTeachers=nItemDefault;
	self.nItemExceptions=nItemDefault;
	
	self.nPagStudents=nPagDefault;
	self.nPagTeachers=nPagDefault;
	self.nPagExceptions=nPagDefault;
	
	self.myListOfTeachers = [];
	self.myListOfStudents = [];
	self.myListOfExceptions = [];
	
	self.numExceptionsFounded=0;
	self.numTeachersFounded=0;
	self.numStudentsFounded=0;
	

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
