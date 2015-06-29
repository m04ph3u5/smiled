<!doctype html>
<html data-ng-app="smiled.application">
<head>
<!-- <meta charset="UTF-8"> -->
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/css/custom-style.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/css/jquery-ui.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/css/validation-form.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/js/vendor/ngDialog/css/ngDialog.css">
</head>
<base href="/ThesisProject/">
<body data-ng-cloak>
<div  class="container-fluid fillContent">
	
	<div data-ui-view></div>


</div>
	<!-- VENDOR SCRIPT -->
	
	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script
		src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/jquery-ui.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular/angular.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-ui-date/src/date.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-ui-date/datepicker-it.js"></script>
		
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-cookies/angular-cookies.js"></script>
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-ui-router/release/angular-ui-router.js"></script>
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ngstorage/ngStorage.js"></script>
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-resource/angular-resource.js"></script>
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-permission/dist/angular-permission.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/lodash/lodash.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/restangular/src/restangular.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/stomp-websocket/lib/stomp.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ng-file-upload/ng-file-upload.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ng-file-upload/ng-file-upload-shim.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/sockjs-client/dist/sockjs-0.3.4.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ngDialog/js/ngDialog.js"></script>

<!-- 	<script src="http://cdn.sockjs.org/sockjs-0.3.min.js"></script> -->
	
	<!-- CUSTOM SCRIPT -->
	<script src="https://localhost:8443/ThesisProject/assets/public/js/app.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/router.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/loggedController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/loginController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/registerController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/registrationConfirmController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/dashboardController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenariosListController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenarioWizardController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/navbarController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/updateScenarioController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenarioController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/personalProfileController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/studentsListController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/dialogCreateScenarioController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/userService.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/apiService.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/scenarioService.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/alertingLogin.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/alertingGeneric.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/constantService.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/alertingRegistration.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/alertLogin.js"></script> 
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/alertRegistration.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/workSpinner.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/errSrc.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/support/jqSupport.js"></script>
	
	<!-- CUSTOM SCRIPT WRAPPING -->
	<script src="https://localhost:8443/ThesisProject/assets/public/js/wrapping/exceptionHandler.js"></script>  
	<script src="https://localhost:8443/ThesisProject/assets/public/js/wrapping/interpolateDebug.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/wrapping/requestCounter.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/wrapping/stateChangeErrors.js"></script>
	
	
<!-- <script> 
// 	var url = 'https://'+window.location.host+'/ThesisProject/websocket/marcopolo';
// 	var sock = new SockJS(url);
	
// 	var stomp = Stomp.over(sock);
	
// 	var payload = JSON.stringify({ 'message': 'Marco!' });
// 	stomp.connect('guest', 'guest', function(frame) {
// 		stomp.send("/marco", {}, payload);
// 	});
	
// // 	sock.onopen = function() {
	
// // 		console.log('Opening');
// // 		sayMarco();
// // 	};
// // 	sock.onmessage = function(e) {
// // 		console.log('Received message: ', e.data);
// // 		setTimeout(function(){sayMarco()}, 2000);
// // 	};
// // 	sock.onclose = function() {
// // 		console.log('Closing');
// // 	};
// // 	function sayMarco() {
// // 		console.log('Sending Marco!');
// // 		sock.send("Marco!");
// // 	}
  </script> -->

</body>
</html>
