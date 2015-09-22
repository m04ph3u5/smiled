angular.module("smiled.application").directive('userCard', [ 'CONSTANTS', 'userService',
	function(CONSTANTS, userService){
		return{
			templateUrl : "assets/private/partials/user-card.html",
			scope : {
				userid: "@"
//				post : "=",
//				currentCharacter : "=",
//				showComment : "=",
//				showMetaComment : "="
			},
			controller: function(){
				var self = this;
				self.user = null;
				self.profilePicture = null;
				self.userCover = null;
				self.ruolo = null;
			
				//qui dà undefined perché la crea quando non è ancora stato cliccato l'utente? come prendere il dato?
				console.log("OHIIIII SONO QUIII");
				userService.getUser(self.userid).then(
						function(data){
							self.user=data;
							self.profilePicture = CONSTANTS.urlUserCover(self.userid);
							self.userCover = CONSTANTS.urlUserCoverLarge(self.userid);
							var role = self.user.role;	
							if (role.authority=="ROLE_TEACHER")
								self.ruolo="DOCENTE";
							else self.ruolo="STUDENTE";
						},
						function(reason){
							console.log(reason);
						}
				);
				console.log(self.user);
				//prendere lo user in base all'ID
				//prendere il n° di scenari e di compiti dello user

			},
			controllerAs: "userCard",
			bindToController : true,
			link : function(scope, elem, attrs, ctrl){
				
			}
		}
}]);