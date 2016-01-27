<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link rel="shortcut icon" href="/assets/public/img/icon/favicon.ico">
	<link rel="icon" type="image/png" href="/assets/public/img/icon/favicon.png">
	<link rel="stylesheet"
		href="/assets/public/js/vendor/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="/assets/public/css/custom-style.css">
	<link rel="stylesheet" href="/assets/public/css/secondaryCss.css">
	<link href='https://fonts.googleapis.com/css?family=Coustard' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,300' rel='stylesheet'
        type='text/css'>
    <link href="/assets/public/js/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
	<title>Meschola</title>
</head>
<body>
	<nav class="navbar navbar-default">
		<div class="container-fluid">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed"
					data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a href="/"> 
				<img class="img imgPreviewM" src="assets/public/img/calderone1.png">
				</a>
				<a href="/"> 
				<span class="titleNav"><b><i>me</i>schola</b></span>
				</a>
			</div>
		</div>
		<!-- /.container-fluid -->
	</nav>
	<div class="container">
	<h1>Reset password</h1>
	<br>
	<p>Inserisci la tua nuova password. Ti ricordiamo che deve essere lunga almeno 8 caratteri.</p>

	<div style="margin-top:50px;" class="col-sm-offset-4 col-sm-4">
		<form role="form" novalidate action="/sendNewPassword.html" method="POST" onSubmit="return validate();" autocomplete="off">
			<div class="form-group">
				<label>Password</label>
				<input id="password" name="password" class="form-control" placeholder="Inserisci la tua password"
					 type="password"></input>
			</div>
			<div class="form-group">
				<label>Conferma password</label>
				<input id="rePassword" name="rePassword" class="form-control" placeholder="Reinserisci la tua password"
					 type="password"></input>
				<input name="token" type="hidden" value="${token}"></input>
				<input name="email" type="hidden" value="${email}"></input>		
				<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
			</div>
			<button class="btn btn-success confirm pull-right" type="submit"
				style="margin-bottom: 15px;">Invia</button>
		</form>
	</div>
		
	<div class="col-sm-offset-2 col-sm-8">	
		<div id="alert" style="display:none;" class="alert alert-warning">
			<span style="display:none;" id="minLengthError">La password deve essere almeno 8 caratteri</span>
			<span style="display:none;" id="notMatchError">Le password non corrispondono</span>
		</div>
	</div>	
	<div class="hidden-xs visible-sm visible-md visible-lg" style="margin-bottom:350px;"></div>

</div>
<script>
var validate = function(){
	var password = document.getElementById("password");
    var confirm = document.getElementById("rePassword");
    var alert = document.getElementById("alert");
    if(password.value.length<8){
    	var minError = document.getElementById("minLengthError");
    	alert.style.display = 'block';
    	minError.style.display = 'inline';
    	return false;
    }else if(password.value!=confirm.value){
    	var minError = document.getElementById("minLengthError");
    	minError.style.display = 'none';
    	var matchError = document.getElementById("notMatchError");
    	alert.style.display = 'block';
    	matchError.style.display = 'inline';
    	return false;
    }
    return true;
    	
}
</script>
<script src="/assets/public/js/vendor/jquery/dist/jquery.min.js"></script>
<script	src="/assets/public/js/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
</body>
</html>