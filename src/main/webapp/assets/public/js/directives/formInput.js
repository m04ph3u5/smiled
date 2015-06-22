angular.module("smiled.application").directive('forminput',['$compile', function($compile) {

	
		var setupDom= function(element){
			var input = element.querySelector("input, textArea, select");
			var type = input.getAttribute("type");
			var name = input.getAttribute("name");
			if(type!== "checkbox" && type!== "radio"){
				input.classList.add("form-control");
			}else{
				
			}
//			var label = element.querySelector("label");
//			label.classList.add("control-label");
			//element.classlist.add("form-group");
			return name;
		};
		
		var watcherFor= function (form, name){
			return function(){
				if( name && form[name]){
					if(form[name].$invalid && form[name].$dirty)
						return form[name].$invalid;
				}
				//otherwise just return undefined
			};
		};
		
		var updaterFor = function(element){
			//angular passa a questa funzione il valore che il watcher ritorna, quindi hasError è un flag che mi dice se l'input ha un errore
			return function(hasError){
				if(hasError){
					element.removeClass("has-success").addClass("has-error");
				}else{
					element.removeClass("has-error").addClass("has-success");
				}
			};
		};
		
		var addMessages = function(form, element, name, $compile, scope){
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			console.log(form +" "+element +" "+ name+" "+ form.$name);
			var messages = "<div class='help-block' ng-messages='" + form.$name + "."+
				name + ".$error" + "' ng-messages-include='assets/public/partials/messages.html'></div>";
			console.log(messages);
			element.append($compile(messages)(scope));
			//scope-$watch guarda all'invalid flag associato al form e chiama l'updater se il watcher restituisce true
			scope.$watch(watcherFor(form, name), updaterFor(element));
		};
	
		var link = function($compile){
			return function(scope, element, attributes, form){
				var name = setupDom(element[0]);
				addMessages(form, element, name, $compile, scope);
			};
		};
        return {
            restrict: "A",
            require:"^form",
            link: link($compile)
        }

}]);