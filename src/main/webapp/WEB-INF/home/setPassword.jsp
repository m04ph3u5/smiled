<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html ng-app="mainModule">
<head>
<link rel="stylesheet"
	href="/assets/public/js/vendor/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/assets/public/css/custom-style.css">

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Imposta password</title>
<!-- Le styles -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
body {
	padding-top: 60px; /* 60px to make the container go all the way
      to the bottom of the topbar */
}
</style>

<!-- Le fav and touch icons -->
<link rel="shortcut icon" href="./assets/ico/favicon.ico">
<link rel="apple-touch-icon-precomposed" sizes="144x144"
	href="/assets/ico/apple-touch-icon-144-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114"
	href="assets/ico/apple-touch-icon-114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72"
	href="assets/ico/apple-touch-icon-72-precomposed.png">
<link rel="apple-touch-icon-precomposed"
	href="assets/ico/apple-touch-icon-57-precomposed.png">
	
<style>
      body { padding-top: 60px; /* 60px to make the container go all the way
      to the bottom of the topbar */ }
    </style>
<style type="text/css">

.error {
	color: #ff0000;
}
.errorblock {
	color: #ff0000;
	background-color: #ffEEEE;
	border: 3px solid #ff0000;
	padding: 8px;
	margin: 16px;
}
</style>
</head>

<body>
	<div class="navbar navbar-fixed-top navbar-inverse">
		<div class="container-fluid">
	
			<div class="navbar-inner">
				<div class="navbar-header">
					<a href="/login"> <img class="img imgPreviewM" src="assets/public/img/logo_calderone.png"><b><i>me</i>schola</b></img>
					</a>
					
				</div>
	
			</div>
		</div>
	</div>

	<div class="container-fluid">
		<div class="row">
		<div class="col-sm-2"></div>
		<div class="col-sm-3 box textLeft">
			<h1>Imposta la password</h1>
			<div>
				<p>Ci sei quasi. Imposta la tua nuova passsword ed inizia ad utilizzare SMILED!</p>
			</div>

			<form:form commandName="firstPassword">
				<div class="form-group row">
					<label style="margin-right: 25px;" for="textinputEmail" class=" col-sm-3"> EMAIL: </label>
					<form:input class="generalInput col-sm-8" path="email" type="email" cssErrorClass="error" placeholder="INSERISCI LA TUA EMAIL"/>
					<form:errors path="email" cssClass="error" />
				</div>
				<div class="form-group row">
					<label style="margin-right: 25px;" for="textinputEmail" class=" col-sm-3"> NOME: </label>
					<form:input class="generalInput col-sm-8" path="firstname" type="text" cssErrorClass="error" placeholder="NOME"/>
					<form:errors path="firstname" cssClass="error" />
				</div>
				<div class="form-group row">
					<label style="margin-right: 25px;" for="textinputEmail" class=" col-sm-3"> COGNOME: </label>
					<form:input class="generalInput col-sm-8" path="lastname" type="text" cssErrorClass="error" placeholder="COGNOME"/>
					<form:errors path="lastname" cssClass="error" />
				</div>
				<div class="form-group row">
					<label style="margin-right: 25px;" for="textinputOldPassword" class=" col-sm-3"> VECCHIA PASSWORD: </label>
					<form:input class="generalInput col-sm-8" path="oldPassword" type="password" cssErrorClass="error" placeholder="INSERISCI LA VECCHIA PASSWORD"/>
					<form:errors path="oldPassword" cssClass="error" />
				</div>
				<div class="form-group row">
				<label style="margin-right: 25px;" for="textinputNewPassword" class=" col-sm-3"> NUOVA PASSWORD: </label>
					<form:input class="generalInput col-sm-8" path="newPassword" type="password" cssErrorClass="error" placeholder="INSERISCI LA TUA NUOVA PASSWORD"/>
					<form:errors path="newPassword" cssClass="error" />
				</div>
				<button type="submit" class="btn generalButton textRight" name="submit">CAMBIA PASSWORD</button>
			</form:form>
			</div>
		</div>
	</div>

	<script
		src="/assets/public/js/vendor/jquery/dist/jquery.min.js"></script>

	<script
		src="/assets/public/js/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
	

</body>
</html>