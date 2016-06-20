angular.module('smiled.application').factory('article',
		[ '$http', '$q', '$stateParams', 'apiService', 'CONSTANTS','alertingGeneric', function article($http, $q, $stateParams, apiService, CONSTANTS, alertingGeneric) {

			var idTemplate; 
			var newspaper = {}; 
			
			var articleById = {}; 
			var article = {};
			var scenId = $stateParams.id;
			var newspaperNumber; 
			var numberJustCreated = 0; 
			var nameJustCreated = ""; 
			
		
			//Oggetti articoli --> verranno scaricati da db
			article2col = {}; 
			article1colImg = {};
			article2colImg = {};
			articleColImage = {};
			article1colImgTemp2	= {};
			article2colTemp2 = {};
			article1col = {};
			
			idArticle = ""; 
			idCurrentTemplate = ""; 
			
			headline = {}; 
			headline.title = 'Assegna un nome al giornale';
			headline.date = ''; 
			headline.number = '';
			
			
			article2col.title = 'Titolo primo articolo';
			article2col.subtitle = "Sottotitolo dell'articolo";
			
					
			article2col.text1 ="Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!",
			article2col.text2 = "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!",	
			
			article2col.city = "";
			
			
			article1colImg.title = 'Rubrica personaggio';
			article1colImg.subtitle = '';
			article1colImg.text1 = "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!";
			article1colImg.image = 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg';
			
			
			article2colImg.title = 'Titolo di un altro articolo';
			article2colImg.subtitle = "Sottotitolo dell'articolo";
			article2colImg.text1 = "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!",
			article2colImg.text2 = 	"Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!",		
			
			article2colImg.image = 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg'
			article2colImg.city = "";
				
			article1colImgTemp2.title = "Il punto di vista dell'antagonista";
			article1colImgTemp2.subtitle = ""; 
			article1colImgTemp2.text = "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!";		
			article1colImgTemp2.image = 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg';	
			
			articleColImage.title = "L'evento principale dello scenario";
			articleColImage.subtitle = "Sottotitolo dell'articolo"; 
			articleColImage.text = "Qui comparira' il testo dell'articolo. Clicca sul campo che vuoi modificare e inizia a scrivere!"
			articleColImage.city = ""; 
				
			article1col.title = "La societa' nella storia";
			article1col.subtitle = "Sottotitolo dell'articolo";
			article1col.text = "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!";
			article1col.city = "";
			
			article2colTemp2.title = "Articolo di fondo";
			article2colTemp2.subtitle = "";
			article2colTemp2.text = {
					
				col1: "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!",
				col2: "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!",
					
			}
			article2colTemp2.city = ""; 
			
			var setArticleObject = function(input, id) {
				if(id == "1") {article2col = input; }
				if (id == "2") {article1colImg = input; }
				if (id == "3") {article2colImg = input; }
				if(id== "4") {article1colImgTemp2 = input;}
				if (id == "5") {articleColImage = input; }
				if(id == "6") {article1col = input; }
				if( id == "7") {article2colTemp2 = input; }
				
				 console.log(article2col);
			}
			
			var getArticleObject = function(id) {
				if (id == "1") return article2col;
				if (id == "2") return article1colImg;
				if (id == "3") return article2colImg;
				if(id == "4") return article1colImgTemp2; 
				if (id == "5") return articleColImage; 
				if(id == "6") return article1col; 
				if(id == "7") return article2colTemp2; 
				
			}
			
			var getTitle = function() {
				return headline;
			}
			
			var setTitle = function(headlineNewspaper){
				headline = headlineNewspaper; 
			}
			
			//FUNZIONE CHE RICEVE IL CURRENT id dal Newspaper 
			
			var setArticleId = function(id){
				
				if(id == "1") {
					idArticle = id;
				}
				
				if(id == "2"){
					
					idArticle = id; 
				}
				
				if(id == "3") {
					
					idArticle = id;
				}
				
				if(id == "4") {
					
					idArticle = id; 
					
				}
				
				if (id == "5") {
					idArticle = id; 
					
				}
				
				if (id == "6") {
					idArticle = id; 
					
				}
				
				if(id == "7"){
					
					idArticle = id; 
					
				}
			}
			
			
			
			var getArticleId = function(){
				
				return idArticle; 
			}
			
			var continueProduction = false; 
			
			
			var getBooleanRedazione = function (){
				
				return continueProduction; 
			}
			
			var setBooleanRedazione = function () {
				
				continueProduction = true; 
				
			}
			
			var getIdCurrentTemplate = function(){
				
				return idCurrentTemplate;
				
			}
			
			var setIdCurrentTemplate = function(id) {
				
				idCurrentTemplate = id; 
				
			}
			
			
			//restituisce l'id del template che lo studente sta utilizzando 

			var getIdTemplate = function(){
				var s = apiService.getMyLastNewspaper(scenId); 
				s.then(function(data){
					newspaper = data;  
				},function(reason){
				
					console.log("Errore.");	
				}
		)
					return newspaper.idTemplate;
			}
			
			
			
			var getNumberNewspaper = function () {
				
				var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							newspaper = data; 
							idTemplate = newspaper.idTemplate;
							var number = newspaper.number; 
							
						},function(reason){
						
							console.log("Errore.");	
						}
				)

				return newspaper.number; 
				
			}
			
			
	var getCurrentNewspaper = function () {
				var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							newspaper = data; 
						},function(reason){
							if(reason.status == "500") {
								newspaper.name = CONSTANTS.insertHeadline;	
								newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper; 
								console.log("Errore.");	
								alertingGeneric.addWarning("Non e' stato possibile visualizzare gli articoli, ricarica la pagina.");
							}
							
						}
				)
			
				return newspaper; 
				
			}
	
	
	var setNumberJustCreated = function (number){
		
		numberJustCreated = number; 
		
	}
	
	var getNumberJustCreated = function(){
		
		return numberJustCreated; 
		
		
	}
	

	var setArticle = function(a) {
		article = a;   
	}
	
	var getArticle = function(){
		return article; 
		
	}
	
	var setNameJustCreated = function(headline){
		nameJustCreated = headline; 
	}
	
	var getNameJustCreated = function (){
		
		return nameJustCreated; 
	}
		

			return {

				setArticleObject : setArticleObject, 
				getArticleObject : getArticleObject, 			
				getTitle : getTitle,
				setTitle : setTitle,
				setArticleId: setArticleId,
				getArticleId: getArticleId,
				setBooleanRedazione: setBooleanRedazione,
				getBooleanRedazione: getBooleanRedazione,
				setIdCurrentTemplate: setIdCurrentTemplate,
				getIdCurrentTemplate: getIdCurrentTemplate,
				getIdTemplate: getIdTemplate,
				getCurrentNewspaper: getCurrentNewspaper,
				getNumberNewspaper: getNumberNewspaper, 
				setNumberJustCreated: setNumberJustCreated,
				getNumberJustCreated:getNumberJustCreated, 
				getArticle: getArticle, 
				setNameJustCreated: setNameJustCreated,
				getNameJustCreated: getNameJustCreated,
				
				}

			

		} ]);
