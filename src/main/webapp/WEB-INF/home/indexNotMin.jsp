<!doctype html>
<html data-ng-app="smiled.application">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta description="Meschola è la piattaforma digitale per la didattica che consente a docenti e studenti di interpretare fatti, argomenti e personaggi in modo originale e collaborativo, sfruttando i meccanismi comunicativi e relazionali tipici dei social network.">
<link rel="shortcut icon" href="/assets/public/img/icon/favicon.ico">
<link rel="icon" type="image/png" href="/assets/public/img/icon/favicon.png">



<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
<link rel="stylesheet" href="/assets/public/js/vendor/angular-ui-bootstrap-bower/ui-bootstrap-csp.css">
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/ui-lightness/jquery-ui.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ng-dialog/0.5.1/css/ngDialog.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/3.0.0/ng-tags-input.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/angular-bootstrap-lightbox/0.9.0/angular-bootstrap-lightbox.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/css/bootstrap3/bootstrap-switch.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.7.2/css/bootstrap-select.min.css">

<!-- Own Style file -->
<!-- <link rel="stylesheet" href="/assets/public/css/custom-style.css"> -->
<!-- <link rel="stylesheet" href="/assets/public/css/secondaryCss.css"> -->
<!-- <link rel="stylesheet" href="/assets/public/css/storyline.css"> -->
<!-- <link rel="stylesheet" href="/assets/public/css/validation-form.css"> -->
<!-- <link rel="stylesheet" href="assets/public/js/vendor/ui-slider/slider.css"> -->



<!-- Own Style file MIN -->
<link rel="stylesheet" href="/assets/public/css/meschola.min.css">



  <!-- Google Web Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Coustard' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,300' rel='stylesheet'
        type='text/css'>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet" />

<title data-ng-bind="$state.current.data.pageTitle">Meschola</title>    

<!-- Begin Cookie Consent plugin by Silktide - http://silktide.com/cookieconsent -->
<script type="text/javascript">
    window.cookieconsent_options = {"message":"I cookie consentono una gamma di funzionalit� che migliorano la tua fruizione di questo sito. Utilizzando il sito, l'utente accetta l'uso dei cookie in conformit� con le nostre linee guida. Scrollando o cliccando sulla pagina l'utente accetta l'utilizzo dei cookie del sito.","dismiss":"Accetto","learnMore":"Policy","link":"http://www.meschola.it/cookie-policy","theme":"dark-top"};
</script>

<script type="text/javascript" 

src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/1.0.9/cookieconsent.min.js"></script>
<!-- End Cookie Consent plugin -->
</head>
<base href="/">

<body data-ng-cloak>
<div  class="">
	
	<div data-ui-view></div>

</div>
	<!-- VENDOR SCRIPT -->
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"
			  integrity="sha256-xNjb53/rY+WmG+4L6tTl9m6PpqknWZvRt0rO1SRnJzw="
			  crossorigin="anonymous"></script>	
			  
	<script src="/assets/public/js/vendor/jquery-ui/ui/i18n/datepicker-it.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js"></script>
	<script src="/assets/public/js/support/angular-locale_it-it.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-date/0.0.8/date.min.js"></script>
		
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular-cookies.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min.js"></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.13.4/ui-bootstrap-tpls.min.js"></script>
	<script src="https://cdn.jsdelivr.net/ngstorage/0.3.9/ngStorage.min.js"></script>
	<script
		src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular-resource.min.js"></script>
	<script
		src="/assets/public/js/vendor/angular-permission/dist/angular-permission.min.js"></script>
	<script src="https://cdn.jsdelivr.net/lodash/3.10.1/lodash.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.0.3/sockjs.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/danialfarid-angular-file-upload/7.3.8/ng-file-upload.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/danialfarid-angular-file-upload/7.3.8/ng-file-upload-shim.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/ng-dialog/0.5.1/js/ngDialog.min.js"></script>
	<script src="/assets/public/js/vendor/angular-native-dragdrop/draganddrop.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/ngInfiniteScroll/1.0.0/ng-infinite-scroll.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/3.0.0/ng-tags-input.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-bootstrap-lightbox/0.9.0/angular-bootstrap-lightbox.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/js/bootstrap-switch.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.7.2/js/bootstrap-select.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular-sanitize.min.js"></script>
	<script src="/assets/public/js/vendor/ui-slider/slider.js"></script>
	<script src="/assets/public/js/vendor/angular-fullscreen/angular-fullscreen.js"></script>
	<script src="/assets/public/js/support/angular-p5.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.9/p5.min.js" type="text/javascript"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.9/addons/p5.dom.min.js" type="text/javascript"></script>
	<script src="/assets/public/js/support/datepicker.min.js"></script>
	
<!-- 	<script src="http://cdn.sockjs.org/sockjs-0.3.min.js"></script> -->
	
	<!-- CUSTOM SCRIPT -->
<!-- 	<script src="/assets/public/js/app.js"></script> -->
<!-- 	<script src="/assets/public/js/router.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/mainController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/loggedController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/loginController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/registerController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/setPasswordController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/registrationConfirmController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/dashboardController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/dashboardAdminController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/scenariosListController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/scenarioWizardController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/navbarController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/updateScenarioController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/scenarioController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/scenarioPostController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/singlePostController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/scenarioCharactersController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/scenarioMapController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/personalProfileController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/notificationController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/studentsListController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/colleaguesListController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/filesListController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/characterProfileController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/dialogScenarioController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/dialogMissionController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/dialogSetDateController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/scenarioStorylineController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/openMapController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/openMapForPostController.js"></script> -->
<!-- 	<script src="/assets/public/js/controllers/issuesController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/customDatePickerTemplateController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/oldCharacterChangeOnCommentController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/toolMapController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/scenarioMissionsCtrl.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/scenarioResourcesController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/deleteResourceController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/personalMissionController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/draftsListController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/editDraftController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/controllers/forgotController.js"></script>	 -->
<!-- 	<script src="/assets/public/js/services/userService.js"></script> -->
<!-- 	<script src="/assets/public/js/services/notifyService.js"></script> -->
<!-- 	<script src="/assets/public/js/services/messageService.js"></script> -->
<!-- 	<script src="/assets/public/js/services/webSocketService.js"></script>	 -->
<!-- 	<script src="/assets/public/js/services/apiService.js"></script> -->
<!-- 	<script src="/assets/public/js/services/modalService.js"></script> -->
<!-- 	<script src="/assets/public/js/services/alertingLogin.js"></script> -->
<!-- 	<script src="/assets/public/js/services/alertingGeneric.js"></script> -->
<!-- 	<script src="/assets/public/js/services/alertingScenario.js"></script> -->
<!-- 	<script src="/assets/public/js/services/constantService.js"></script> -->
<!-- 	<script src="/assets/public/js/services/alertingRegistration.js"></script> -->
<!-- 	<script src="/assets/public/js/services/unauthorizedInterceptor.js"></script> -->
<!-- 	<script src="/assets/public/js/services/dateUtil.js"></script> -->
<!-- 	<script src="/assets/public/js/services/social-graph-sketch.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/alertLogin.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/showOnHoverParent.js"></script>  -->
<!-- 	<script src="/assets/public/js/directives/hideOnHoverParent.js"></script>  -->
<!-- 	<script src="/assets/public/js/directives/insertStatus.js"></script>  -->
<!-- 	<script src="/assets/public/js/directives/insertMission.js"></script>  -->
<!-- 	<script src="/assets/public/js/directives/insertEvent.js"></script>  -->
<!-- 	<script src="/assets/public/js/directives/insertPost.js"></script>  -->
<!-- 	<script src="/assets/public/js/directives/tagBox.js"></script>  -->
<!-- 	<script src="/assets/public/js/directives/alertRegistration.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/alertGeneric.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/alertScenario.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/workSpinner.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/historicalDatePicker.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/showNewsPost.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/summarizeInfoPost.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/likeTo.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/commentTo.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/metaCommentTo.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/errSrc.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/pin-point-canvas.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/bsSwitch.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/updatePostOnScroll.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/mapPostView.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/mapScenario.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/customDatePicker.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/userCard.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/editDraftPost.js"></script> -->
<!-- 	<script src="/assets/public/js/directives/blurElement.js"></script> -->

	
<!-- 	<script src="/assets/public/js/controllers/dialogConfirmRegistrationController.js"></script> -->
	
 	<!-- CUSTOM SCRIPT WRAPPING --> 
<!-- 	<script src="/assets/public/js/wrapping/exceptionHandler.js"></script>   -->
<!-- 	<script src="/assets/public/js/wrapping/requestCounter.js"></script> -->
<!-- 	<script src="/assets/public/js/wrapping/stateChangeErrors.js"></script> -->

	<script src="/assets/public/build/meschola.min.js"></script>
	
	<!-- SCRIPT PER VETRINA -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-backstretch/2.0.4/jquery.backstretch.min.js" type="text/javascript"></script>
    <script src="/assets/public/js/vendor/scrollReveal.js/dist/scrollReveal.min.js" type="text/javascript"></script>
   	<script src="/assets/public/js/vendor/fox-angular-scrollReveal.js/dist/fox-angular-scrollReveal.min.js"></script>
    <script src="/assets/public/js/support/jquery.downCount.min.js" type="text/javascript"></script>
<!--     <script src="/assets/public/js/support/showcase-custom.js" type="text/javascript"></script> -->
	<!-- FINE SCRIPT PER VETRINA -->
	
	<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-67446742-1', 'auto');
  ga('send', 'pageview');

	</script>

	
	
</body>
</html>
