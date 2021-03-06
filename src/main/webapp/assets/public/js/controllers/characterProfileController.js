angular.module('smiled.application').controller('characterProfileCtrl', ['CONSTANTS', '$scope', '$stateParams', 'apiService', 'Upload',
              function characterProfileCtrl(CONSTANTS,$scope,$stateParams, apiService, Upload){
	
	
	var self = this;
	self.character = {};
	//due variabili identiche perché ad api service non piaceva self.idchar
	var idChar = $stateParams.idCharacter;
	self.idChar = idChar;
	var scenarioId = $scope.scenario.scen.id;
	self.scen = $scope.scenario.scen;
	self.editProfile = false;
	
	self.actualUserCover = null;
	self.newCharacter = {};
	self.genderBool = true;
	
	self.numberOfPastUsers;
	self.viewPastUsers = false;
	self.viewBiography = false;
	
	//var idUser = $scope.scenario.loggedUser.id;
	self.currentChar = $scope.scenario.currentCharacter.id;
	

	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	
	
	self.openViewPastUsers = function(){
		self.viewPastUsers = true;
	}
	self.closeViewPastUsers = function(){
		self.viewPastUsers = false;
	}
	
	self.openViewBiography = function(){
		self.viewBiography = true;
	}
	self.closeViewBiography = function(){
		self.viewBiography = false;
	}
	
	apiService.getCharacter(scenarioId, idChar).then(
			function(data){
				
				self.character = data;
				self.newCharacter = angular.copy(data);
				if(self.character.actualUser != null && self.character.actualUser.id != null)
					self.actualUserCover = CONSTANTS.urlUserCover(self.character.actualUser.id);
				
				if(self.character.gender == "F")
					self.genderBool = false;
				else
					self.character.gender == "M";   //assumo che se manca il genere, di default è M
				
				self.numberOfPastUsers = Object.size(self.character.pastUserId);
				
			
				
			},
			function(reason){
				console.log("ERROR RETRIEVE CHARACTER: ");
				console.log(reason);
			}
	);
	self.cover = CONSTANTS.urlCharacterCover(scenarioId, idChar);
	
	self.toggleEditProfile = function(){
		self.editProfile = !self.editProfile;		
	}
	
	self.getBornMonth = function(){
		if(self.character.bornDate!=null)
			return CONSTANTS.monthString(self.character.bornDate.month);
		else return "";
	}
	
	self.getDeadMonth = function(){
		if(self.character.deadDate!=null)
			return CONSTANTS.monthString(self.character.deadDate.month);
		else return "";
	}
	self.deleteUpdateChar = function(){
		self.newCharacter = angular.copy(self.character);
	}
	
	self.updateChar = function(){	
		if(self.genderBool == false)
			self.newCharacter.gender="F";
		else
			self.newCharacter.gender="M";
		
		var isEquals = isEqualsCharacter();
		
		if(!isEquals){
			
			var charDTO = self.newCharacter;	
			
			apiService.updateCharacter(scenarioId, charDTO , idChar).then(
					
					function(data){
						self.character = data;
						self.newCharacter = angular.copy(data);
						if (self.character.gender =="F")
							self.genderBool=false;
						else 
							self.genderBool=true;
						
						
					},
					function(reason){
						self.newCharacter = angular.copy(self.character);
						if (self.character.gender =="F")
							self.genderBool=false;
						else 
							self.genderBool=true;
					}
			);
		}
		else{
			//NESSUN CAMBIAMENTO - NO PUT!;
		}
		
		
	}
	self.uploadCharacterCover = function(file){
		if(file && file.length){
			Upload.upload({
	            url: CONSTANTS.urlCharacterCover(scenarioId,idChar),
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	        })
	        .success(function (data, status, headers, config) {
	            
	            var d = new Date();

	            self.cover = CONSTANTS.urlCharacterCover(scenarioId, idChar)+"?"+d.toString();
	            $scope.scenario.currentCharacter.cover = self.cover;
	            for(var i=0; i<self.posts.length; i++){
					self.posts[i].character.cover = CONSTANTS.urlCharacterCover(scenarioId, idChar)+"?"+d.toString();;
	            }
//	            for(var i=0; i<self.scenario.characters.length; i++){
//	            	if(self.scenario.characters[i].id==idCharacter){
//	            		var d = new Date();
//	            		self.scenario.characters[i].cover = CONSTANTS.urlCharacterCover(id, idCharacter)+"?"+d.toString();
//	            	}
//	            }
	        });
		}
	}
	self.showDeadDatePicker = false;
	self.switchShowDeadDate = function(){
		if(!self.showDeadDatePicker && self.showBornDatePicker){
			self.showBornDatePicker = false;
		}
		self.showDeadDatePicker = !self.showDeadDatePicker;
	}
	
	self.showBornDatePicker = false;
	self.switchShowBornDate = function(){
		if(!self.showBornDatePicker && self.showDeadDatePicker){
			self.showDeadDatePicker = false;
		}
		self.showBornDatePicker = !self.showBornDatePicker;
	}
	
	self.hideDatePicker = function(){
		self.showDeadDatePicker = false;
		self.showBornDatePicker = false;
	}
	
	var isEqualsCharacter = function (){
		
		
		if(self.character.nickname != self.newCharacter.nickname)
			return false;
		if(self.character.quote != self.newCharacter.quote)
			return false;
		if(self.character.description != self.newCharacter.description)
			return false;
		if(self.character.gender != self.newCharacter.gender)
			return false;
		if(self.character.role != self.newCharacter.role)
			return false;
		if(self.genderBool == true && self.character.gender=="F")
			return false;
		if(self.genderBool==false && self.character.gender=="M")
			return false;
		if(self.character.gender==false && self.genderBool==false)
			return false;
		
		if(self.character.bornDate && self.newCharacter.bornDate){
			if(self.character.bornDate.day != self.newCharacter.bornDate.day)
				return false;
			if(self.character.bornDate.month!=self.newCharacter.bornDate.month)
				return false;
			if(self.character.bornDate.year!=self.newCharacter.bornDate.year)
				return false;
			if(self.character.bornDate.afterChrist!=self.newCharacter.bornDate.afterChrist)
				return false;
			
		}else{
			if(self.character.bornDate || self.newCharacter.bornDate) //significa che uno dei due c'è e l'altro no
				return false;
		}
		if(self.character.deadDate && self.newCharacter.deadDate){
			if(self.character.deadDate.day!=self.newCharacter.deadDate.day)
				return false;
			if(self.character.deadDate.month!=self.newCharacter.deadDate.month)
				return false;
			if(self.character.deadDate.year!=self.newCharacter.deadDate.year)
				return false;
			if(self.character.deadDate.afterChrist!=self.newCharacter.deadDate.afterChrist)
				return false;
		}else{
			if(self.character.deadDate || self.newCharacter.deadDate)
				return false;
		}
		
		if(self.character.bornTown != self.newCharacter.bornTown)
			return false;
		if(self.character.deadTown != self.newCharacter.deadTown)
			return false;
		
		return true;
		
	}

	var getPost =function(date, time){
		console.log("GET POST");
		apiService.getLastCharacterPosts(self.scen.id, idChar, scrollable, date, time).then(
				function(data){
					console.log(data);
					var newPosts = [];
					newPosts = data;
					if(data.length==0)
						stopScroll=true;

					for(var i=0; newPosts && i<newPosts.length;i++){
						if(newPosts[i].character){
							newPosts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,newPosts[i].character.id);
						
							for(var j=0; j<newPosts[i].likes.length; j++){
								if(newPosts[i].likes[j].id==idChar){
									newPosts[i].youLike=true;
									break;
								}
							}
						}
						self.posts.push(angular.copy(newPosts[i]));
					}
					self.busy=false;
					
				}, function(reason){
					console.log("errore");
					self.busy=false;
				}
			);
	}
	
	self.posts = [];
	self.busy = false;
	var scrollable = CONSTANTS.numberOfPostForScroll;
	var stopScroll = false;
	
	self.nextPost = function(){
		if(self.busy || stopScroll)
			return;
		self.busy=true;
		if(self.posts.length==0){
			getPost();
		}else{
			getPost(self.posts[self.posts.length-1].julianDayNumber,self.posts[self.posts.length-1].timeNumber);
		}
	}
	
	
//	self.getUserCover = function(){
//		self.userCover = CONSTANTS.urlUserCover(id);				
//	}

}]);