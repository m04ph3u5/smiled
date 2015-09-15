angular.module('smiled.application').controller('issuesCtrl', ['CONSTANTS', 'apiService', '$state', '$timeout',
              function issuesCtrl(CONSTANTS, apiService, $state, $timeout){
	
	var self = this;
	self.sended=false;
	self.postIssue = function(){
		var problema = {};
		problema.preOperation = self.preOperation;
		problema.issue = self.issue;
		problema.expect = self.expect;
		apiService.postIssue(problema).then(
			function(data){
				self.preOperation="";
				self.issue="";
				self.expect="";
				self.sended=true;
				$timeout( function(){
					$state.go("logged.dashboard");
				}, 7000);
			},
			function(reason){
				console.log("Errore nell'invio della segnalazione"+reason);
			}
		);
	}

}])