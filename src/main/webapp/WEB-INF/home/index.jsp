<!doctype html>
<html data-ng-app="smiled.application">
<head>
 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
</head>
<base href="/ThesisProject/">
<body data-ng-controller="indexCtrl">

	<nav data-ng-if="isLogged" class="navbar navbar-default">
		<div class="container-fluid">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed"
					data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">Smiled</a>
			</div>

			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse"
				id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">
				</ul>

				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown"><a href="#" class="dropdown-toggle"
						data-toggle="dropdown" role="button" aria-expanded="false"><span
							class="glyphicon glyphicon-bullhorn"></span> <span class="caret"></span></a>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">Notifica 1</a></li>
							<li><a href="#">Notifica 2</a></li>
							<li><a href="#">Notifica 3</a></li>
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
					<li><a href="#"><img src="assets/public/img/user_ico.png"
							class="img-circle" width="20" height="20"> Nome utente</a></li>
					<li class="dropdown"><a href="#" class="dropdown-toggle"
						data-toggle="dropdown" role="button" aria-expanded="false"><span
							class="glyphicon glyphicon-cog"><span class="caret"></span></a>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">Impostazione 1</a></li>
							<li><a href="#">Impostazione 2</a></li>
							<li><a href="#">Impostazione 3</a></li>
							<li class="divider"></li>
							<li><a href="" data-ng-click="logout()">Log Out</a></li>
						</ul></li>
				</ul>
			</div>
			<!-- /.navbar-collapse -->
		</div>
		<!-- /.container-fluid -->
	</nav>

	<div class="container">

		<div class="content-main" data-ui-view></div>



		<div id="footer">
			<div class="container">
				<span class="pull-right text-info credit">Smiled Platform</span>
			</div>
		</div>
	</div>

	<!-- VENDOR SCRIPT -->
	<script src="assets/public/js/vendor/angular/angular.js"></script>
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
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	
	<!-- CUSTOM SCRIPT -->
	<script src="assets/public/js/app.js"></script>
	<script src="assets/public/js/router.js"></script>
	<script src="assets/public/js/controllers/shellController.js"></script>
	<script src="assets/public/js/controllers/loginController.js"></script>
	<script src="assets/public/js/controllers/dashboardController.js"></script>
	<script src="assets/public/js/controllers/indexController.js"></script>
	<script src="assets/public/js/services/userService.js"></script>
	<script src="assets/public/js/services/apiService.js"></script>
</body>
</html>
