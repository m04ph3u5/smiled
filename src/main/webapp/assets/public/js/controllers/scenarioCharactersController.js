angular.module('smiled.application').controller('scenarioCharactersCtrl', ['CONSTANTS', '$scope',
              function scenarioCharactersCtrl(CONSTANTS,$scope){
	
	var self = this;
	self.scen = $scope.scenario.scen;
	
	var onStartup = function(){
		self.associations = self.scen.characters;
		if(self.associations){
			for(var i=0; i<self.associations.length; i++){
				self.associations[i].cover = CONSTANTS.urlCharacterCover(self.scen.id, self.associations[i].id);
				console.log(self.associations[i].cover);
				if(self.associations[i].userId){
					if(self.scen.attendees){
						for(var j=0; j<self.scen.attendees.length; j++){
							if(self.scen.attendees[j].id==self.associations[i].id){
								self.associations[i].userFirstName=self.scen.attendees[j].firstname;
								self.associations[i].userLastName=self.scen.attendees[j].lasstname;
								self.associations[i].userCover=CONSTANTS.urlUserCover(self.scen.attendees[j].id);
								break;
							}
						}
					}
				}
			}
		}
	}
	onStartup();
}]);