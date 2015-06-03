<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html ng-app="mainModule">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Imposta password</title>
<!-- Le styles -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="assets/css/bootstrap.css" rel="stylesheet">

<style>
body {
	padding-top: 60px; /* 60px to make the container go all the way
      to the bottom of the topbar */
}
</style>

<!-- Le fav and touch icons -->
<link rel="shortcut icon" href="assets/ico/favicon.ico">
<link rel="apple-touch-icon-precomposed" sizes="144x144"
	href="assets/ico/apple-touch-icon-144-precomposed.png">
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
		<div class="navbar-inner">
			<div class="container">
				<a class="brand" href="/ThesisProject"> Home </a>
			</div>
		</div>
	</div>

	<div class="container">
		<div class="hero-unit">
			<h1>Imposta la password</h1>
			<div>
				<p>Ci sei quasi. Imposta la tua nuova passsword ed inizia ad utilizzare SMILED!</p>
			</div>

			<form:form commandName="setPassword">
				<div class="form-group">
					<label for="textinputEmail"> Email: </label>
					<form:input path="email" type="email" cssErrorClass="error" placeholder="Inserisci qui la ta email"/>
					<form:errors path="email" cssClass="error" />
				</div>
				<div class="form-group">
					<label for="textinputOldPassword"> Vecchia password: </label>
					<form:input path="oldPassword" type="password" cssErrorClass="error" placheholder="Insersci la vecchia password"/>
					<form:errors path="oldPassword" cssClass="error" />
				</div>
				<div class="form-group">
				<label for="textinputNewPassword"> Nuova password: </label>
					<form:input path="newPassword" type="password" cssErrorClass="error" placeholder="Insersci la tua nuova password"/>
					<form:errors path="newPassword" cssClass="error" />
				</div>
				<button type="submit" class="btn btn-primary btn-lg" name="submit">Cambia la password</button>
			</form:form>
			
		</div>
	</div>

	<script src="assets/js/jquery.min.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>
</body>
</html>