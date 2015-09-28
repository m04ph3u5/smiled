angular.module('smiled.application').controller('toolMapCtrl', ['CONSTANTS',
      function toolMapCtrl(CONSTANTS){

	var self = this;

	self.Win64="MapTool-Windows_x64.zip";
	self.Win32="MapTool-Windows_x86.zip";
	self.Mac="MapTool-MacOSX.zip";
	self.Tux64="MapTool-linux_x64.zip";
	self.Tux32="MapTool-linux_x86.zip";
	
	self.getFile = function(i){
		return  CONSTANTS.urlToolMap(i);
	}
	
}]);