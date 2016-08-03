angular.module('smiled.application').factory('article',
		[ '$http', '$q', '$stateParams', 'apiService', 'CONSTANTS','alertingGeneric', '$sce', function article($http, $q, $stateParams, apiService, CONSTANTS, alertingGeneric, $sce) {

			var idTemplate; 
			var newspaper = {}; 
			
			var articleById = {}; 
			var article = {};
			var scenId = $stateParams.id;
			var newspaperNumber; 
			var numberJustCreated = 0; 
			var nameJustCreated = ""; 
			var publishedNewspaperNumber = 0; 
			var isDraft = false; 
			var isJustDeleted; 
			var isEditing; 
			var idPublishedTemplate = 0; 
			var isPublished = false; 
			var isJournalist;  
			
			//Oggetti articoli --> verranno scaricati da db
			article2col = {}; 
			article1colImg = {};
			article2colImg = {};
			articleColImage = {};
			article1colImgTemp2	= {};
			article2colTemp2 = {};
			article1col = {};
			
			idArticle = 0; 
			idCurrentTemplate = ""; 
			
			headline = {}; 
			headline.title = 'Assegna un nome al giornale';
			headline.date = ''; 
			headline.number = '';
	
				
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
			
			//SETTAGGIO VALORI DI SUGGERIMENTO ARTICOLI PER GIORNALE APPENA CREATO 
			var setArticleObject = function(id) {
				if(id == 1) 
				{
					article2col.title = 'Articolo di CRONACA';
					article2col.subtitle = "Suggerimenti di scrittura";
					
							
					article2col.text1 ="Questo tipo di articolo e' solitamente collocato in prima pagina ed e' caratterizzato da una narrazione oggettiva su un avvenimento.  In questo spazio potrai raccontare l'evento piu' importante che si e' verificato nello scenario.",
					article2col.text2 = "Esistono diverse tipologie di cronaca -la cronaca bianca: notizie di eventi di vario tipo; -la cronaca nera:  crimini e delitti -la cronca rosa: sulla vita privata dei personaggi della storia. Clicca sul bottone di modifica e inizia a scrivere l'articolo!",	
					
					article2col.city = "";
				 }
				if (id == 2) {
					article1colImg.title = 'Rubrica del quotidiano';
					article1colImg.subtitle = '';
					article1colImg.text1 = "La Rubrica e' una tipologia di articolo che si trova molto spesso sulla prima pagina dei maggiori quotidiani.  Si tratta di uno spazio in cui il giornalista scrive le proprie riflessioni su un tema specifico:  ad esempio costume, vita politica, societa', inquinamento etc.  Oltre a trattare un tema legato alla società o all'epoca storica in cui e' ambientata la storia questo spazio puo' essere dedicato anche all'analisi di un personaggio dello scenario. Clicca sul bottone di modifica e inizia a scrivere! Ricorda di caricare anche un'immagine in questo articolo!";
					article1colImg.image = 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg';
					}
				if (id == 3) {
					 
					article2colImg.title = 'Editoriale e commento';
					article2colImg.subtitle = "Altre tipologie";
					article2colImg.text1 = "L'articolo Editoriale o Commento  sono tipologie di articoli caratterizzati dall'analisi di una tesi a partire da una notizia di cronaca; per sua natura e' spesso scritto da un'opinionista che argomenta il proprio punto di vista. In genere si sceglie un tema di politica interna o estera oppure riflessioni intorno a problemi di particolare rilievo.",
					article2colImg.text2 = 	"Oltre all'editoriale esiste una tipologia di articolo, il Reportage, che puo' essere suddiviso anche in piu' puntate e quindi essere riproposto al prossimo numero. Solitamente si sceglie un avvenimento importante con approfondimenti sul contesto e sulle problematiche legate all'evento.",		
					
					article2colImg.image = 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg'
					article2colImg.city = "";

				}
				
				
				if(id== "4") {article1colImgTemp2 = input;}
				if (id == "5") {articleColImage = input; }
				if(id == "6") {article1col = input; }
				if( id == "7") {article2colTemp2 = input; }
				
			}
			
			var getArticleObject = function(id) {
				if (id == 1) return article2col;
				if (id == 2) return article1colImg;
				if (id == 3) return article2colImg;
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
				
				if(id == 1) {
					idArticle = id;
				}
				
				if(id == 2){
					
					idArticle = id; 
				}
				
				if(id == 3) {
					
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
				var p = $q.defer();
				var s = apiService.getMyLastNewspaper(scenId); 
				s.then(function(data){
					newspaper = data; 
					p.resolve(newspaper.idTemplate);
				},function(reason){
					p.reject(reason);
					console.log("Errore.");	
				});
				return p.promise;
			}
			
			
			
			
		/*	var getNumberNewspaper = function () {
				
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
				
			}*/
			
			
/*	var getCurrentNewspaper = function () {
				var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							console.log("vengo chiamato ora, scarico giornale"); 
							if(data.status == "DRAFT"){
								newspaper = data; 	
							}
							
							else if (data.status == "PUBLISHED") {
								
								newspaper = {};
								newspaper.name = CONSTANTS.insertHeadline;	
								newspaper.articles = [];
								newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper; 
								
							}

						},function(reason){
							if(reason.status == "500") {
								newspaper = {};
								newspaper.name = CONSTANTS.insertHeadline;	
								newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper; 
									
								alertingGeneric.addWarning("Non e' stato possibile visualizzare gli articoli, ricarica la pagina.");
							}
							
						}
				)
				
			
				return newspaper; 
				
			}*/
	
	
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
	
	
	var setPublishedNewspaperNumber = function(number){
		publishedNewspaperNumber = number; 
		
		
	}
	
	var getPublishedNewspaperNumber = function (){
		return publishedNewspaperNumber; 
	}
	
	var setIsDraft = function(isNew) {	
		isDraft = isNew; 
	}
	
	var getIsDraft = function(){
		
		return isDraft; 
		
	}
	
	var setIsJustDeleted = function(value){
		isJustDeleted = value; 
		
	}
	
	var getIsJustDeleted = function(){
		
		return isJustDeleted; 
	}
	var setIsEditing = function(isEditingPublished){
		
		isEditing = isEditingPublished; 
		
	}
	
var getIsEditing = function(){
		return isEditing;
		
	}


var setIdPublishedTemplate = function(id) {
	idPublishedTemplate = id; 
	
}

	
var getIdPublishedTemplate = function() {
	
	return idPublishedTemplate; 
	
	
}


var setIsPublished = function(value){
	
	isPublished = value; 
	
}

var getIsPublished = function(){
	
	return isPublished; 
}

var setIsJournalist = function(value){
	
	isJournalist = value;
	
}

var getIsJournalist = function(){
	
	return isJournalist;
	
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
				/*getCurrentNewspaper: getCurrentNewspaper,*/
				/*getNumberNewspaper: getNumberNewspaper,*/ 
				setNumberJustCreated: setNumberJustCreated,
				getNumberJustCreated:getNumberJustCreated, 
				getArticle: getArticle, 
				setNameJustCreated: setNameJustCreated,
				getNameJustCreated: getNameJustCreated,
				setPublishedNewspaperNumber: setPublishedNewspaperNumber,
				getPublishedNewspaperNumber: getPublishedNewspaperNumber,
				setIsDraft: setIsDraft,
				getIsDraft: getIsDraft,
				setIsJustDeleted: setIsJustDeleted,
				getIsJustDeleted: getIsJustDeleted,
				setIsEditing: setIsEditing,
				getIsEditing: getIsEditing,
				setIdPublishedTemplate: setIdPublishedTemplate,
				getIdPublishedTemplate: getIdPublishedTemplate,
				getIsPublished: getIsPublished,
				setIsPublished: setIsPublished,
				setIsJournalist: setIsJournalist,
				getIsJournalist: getIsJournalist
				}

			

		} ]);
