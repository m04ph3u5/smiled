<!doctype html>
<html data-ng-app="smiled.application">
<head>
<!-- <meta charset="UTF-8"> -->
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/public/css/custom-style.css">
<link rel="stylesheet" href="assets/public/css/jquery-ui.css">
<link rel="stylesheet" href="assets/public/js/vendor/ngDialog/css/ngDialog.css">
</head>
<base href="/ThesisProject/">
<body data-ng-cloak data-ng-controller="indexCtrl as index">
<div  class="container-fluid fillContent">
	<nav data-ng-if="index.isLogged" class="navbar navbar-default">
		<div class="container-fluid">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed"
					data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				 <a data-ui-sref="logged" href="">
				 	<img width="35px" height="35px" src="assets/public/img/logo.png">Smiled</img>
				 </a>
				
			</div>

			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse"
				id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">
				</ul>

				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
							<span class="glyphicon glyphicon-bullhorn"></span>
							<span class="caret"></span>
						</a>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">Guidi Marco ha inserito un nuovo post</a></li>
							<li><a href="#">A Rea Anna piace il post di Renzo</a></li>
							<li><a href="#">Rea Anna ha completato un compito</a></li>
							<li><a href="#">Bello Antonio ha commentato il suo post</a></li>
							
							<li class="divider"></li>
							<li><a href="#">Vedi tutte</a></li>
						</ul></li>
					<li class="dropdown"><a href="#" class="dropdown-toggle"
						data-toggle="dropdown" role="button" aria-expanded="false"><span
							class="glyphicon glyphicon-envelope"></span><span class="caret"></span></a>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">Messaggio 1</a></li>
							<li><a href="#">Messaggio 2</a></li>
							<li><a href="#">Messaggio 3</a></li>
							<li class="divider"></li>
							<li><a href="#">Vedi tutti</a></li>
						</ul></li>
					<li>
						<a href="" data-ng-hide="index.isLogged"><img src="assets/public/img/user_ico.png" class="img-circle" width="20" height="20"> Utente </a>
						<a data-ui-sref="personalProfile" href="" data-ng-show="index.isLogged"><img data-ng-src="api/v1/me/cover" class="img-circle" width="30" height="30"> {{index.user.firstName}} {{index.user.lastName}}</a>
					</li>
					<li class="dropdown"><a href="#" class="dropdown-toggle"
						data-toggle="dropdown" role="button" aria-expanded="false"><span
							class="glyphicon glyphicon-cog"><span class="caret"></span></a>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">Invita un collega</a></li>
							<li><a href="#">Modifica profilo</a></li>
							<li><a href="#">Crea nuovo compito</a></li>
							<li class="divider"></li>
							<li><a href="" data-ng-click="index.logout()">Log Out</a></li>
						</ul></li>
				</ul>
			</div>
			<!-- /.navbar-collapse -->
		</div>
		<!-- /.container-fluid -->
	</nav>

	<div data-ui-view></div>
	
	<footer>
	Smiled 2015 ©
	</footer>

</div>
	<!-- VENDOR SCRIPT -->
	
	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script
		src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script src="assets/public/js/vendor/jquery-ui.js"></script>
	<script src="assets/public/js/vendor/angular/angular.js"></script>
	<script src="assets/public/js/vendor/angular-ui-date/src/date.js"></script>
	<script src="assets/public/js/vendor/angular-ui-date/datepicker-it.js"></script>
		
	<script
		src="assets/public/js/vendor/angular-cookies/angular-cookies.js"></script>
	<script
		src="assets/public/js/vendor/angular-ui-router/release/angular-ui-router.js"></script>
	<script
		src="assets/public/js/vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js"></script>
	<script src="assets/public/js/vendor/ngstorage/ngStorage.js"></script>
	<script
		src="assets/public/js/vendor/angular-resource/angular-resource.js"></script>
	<script
		src="assets/public/js/vendor/angular-permission/dist/angular-permission.js"></script>
	<script src="assets/public/js/vendor/lodash/lodash.js"></script>
	<script src="assets/public/js/vendor/restangular/src/restangular.js"></script>
	<script src="assets/public/js/vendor/stomp-websocket/lib/stomp.js"></script>
	<script src="assets/public/js/vendor/ng-file-upload/ng-file-upload.js"></script>
		<script src="assets/public/js/vendor/ng-file-upload/ng-file-upload-shim.js"></script>
	<script src="assets/public/js/vendor/sockjs-client/dist/sockjs-0.3.4.js"></script>
	<script src="assets/public/js/vendor/ngDialog/js/ngDialog.js"></script>

	
	<!-- CUSTOM SCRIPT -->
	<script src="assets/public/js/app.js"></script>
	<script src="assets/public/js/router.js"></script>
	<script src="assets/public/js/controllers/shellController.js"></script>
	<script src="assets/public/js/controllers/loginController.js"></script>
	<script src="assets/public/js/controllers/registerController.js"></script>
	<script src="assets/public/js/controllers/dashboardController.js"></script>
	<script src="assets/public/js/controllers/expandScenarioController.js"></script>
	<script src="assets/public/js/controllers/indexController.js"></script>
	<script src="assets/public/js/controllers/updateScenarioController.js"></script>
	<script src="assets/public/js/controllers/personalProfileController.js"></script>
	<script src="assets/public/js/controllers/dialogCreateScenarioController.js"></script>
	<script src="assets/public/js/services/userService.js"></script>
	<script src="assets/public/js/services/apiService.js"></script>
	<script src="assets/public/js/services/alertingLogin.js"></script>
	<script src="assets/public/js/services/alertingRegistration.js"></script>
	<script src="assets/public/js/directives/alertLogin.js"></script> 
	<script src="assets/public/js/directives/alertRegistration.js"></script>
	<script src="assets/public/js/directives/workSpinner.js"></script>
	<script src="assets/public/js/support/jqSupport.js"></script>
	
	<!-- CUSTOM SCRIPT WRAPPING -->
	<script src="assets/public/js/wrapping/exceptionHandler.js"></script>  
	<script src="assets/public/js/wrapping/interpolateDebug.js"></script>
	<script src="assets/public/js/wrapping/requestCounter.js"></script>
	<script src="assets/public/js/wrapping/stateChangeErrors.js"></script>
	
	


</body>
</html>
