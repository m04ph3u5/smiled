angular.module('smiled.application').controller('issuesCtrl', ['CONSTANTS', 'apiService', '$state', '$timeout',
              function issuesCtrl(CONSTANTS, apiService, $state, $timeout){
	
	var self = this;
	self.sended=false;
	self.suggestionSended=false;
	self.error=false;
	
	self.postSuggestion = function(){
		var suggestion = {};
		suggestion.newFeature = self.newFeature;
		suggestion.modifyFeature = self.modifyFeature;
		suggestion.deleteFeature = self.deleteFeature;
		
		apiService.postSuggestion(suggestion).then(
			function(data){
				self.error=false;
				self.newFeature="";
				self.modifyFeature="";
				self.deleteFeature="";
				self.suggestionSended=true;
				$timeout( function(){
					$state.go("logged.dashboard");
				}, 7000);
			},
			function(reason){
				self.error=true;
				console.log("Errore nell'invio della segnalazione"+reason);
			}
		);
	}
	
	
	self.postIssue = function(){
		var problema = {};
		problema.preOperation = self.preOperation;
		problema.issue = self.issue;
		problema.expect = self.expect;
		apiService.postIssue(problema).then(
			function(data){
				self.error=false;
				self.preOperation="";
				self.issue="";
				self.expect="";
				self.sended=true;
				$timeout( function(){
					$state.go("logged.dashboard");
				}, 7000);
			},
			function(reason){
				self.error=true;
				console.log("Errore nell'invio della segnalazione"+reason);
			}
		);
	}

}])