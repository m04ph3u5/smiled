angular.module("smiled.application").directive('userCard', [ 'CONSTANTS',
	function(CONSTANTS){
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
				//qui dà undefined perché la crea quando non è ancora stato cliccato l'utente? come prendere il dato?
				console.log(self.userid + "OCCHEI")
				//prendere lo user in base all'ID
				//prendere il n° di scenari e di compiti dello user

			},
			controllerAs: "userCard",
			bindToController : true,
			link : function(scope, elem, attrs, ctrl){
				
			}
		}
}]);