package it.polito.applied.smiled.controllerRest;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.MongoException;

import it.polito.applied.smiled.dto.ArticleDTO;
import it.polito.applied.smiled.dto.NewspaperDTO;
import it.polito.applied.smiled.dto.NewspaperDTOPut;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.exception.UserNotFoundException;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.NewspaperService;
import it.polito.applied.smiled.service.ScenarioService;
import it.polito.applied.smiled.service.UserService;

@RestController
public class NewspaperController extends BaseController{

		@Autowired
		private NewspaperService newspaperService;
		@Autowired
		private ScenarioService scenarioService;
		@Autowired
		private UserService userService;
		
	
		//Ritorna l'id del giornale creato se si è riusciti a crearlo (e prende in ingresso un oggetto NewspaperDTO)
		//Quando viene creato un giornale l'unico campo obbligatorio è idTemplate
		//l'oggetto newspaperDTO contiene idTemplate (obbligatorio), name (opz), historicalDate (opz), article (opz).
		//Questo metodo scatena ForbiddenException se si prova a eseguire quando c'è ancora un giornale in creazione (in stato draft) nello scenario. E' quindi possibile
	    //creare un nuovo numero del giornale solo se il precedente è già stato pubblicato.
	    //idTemplate una volta scelto per un newspaper (un numero del giornale dello scenario) non è più modificabile per quel numero, ma numeri successivi potranno usare template diverso.
		@ResponseStatus(value = HttpStatus.CREATED)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers", method=RequestMethod.POST)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Newspaper', 'WRITE')")
		public Id createNewspaper(@PathVariable String idScenario, @RequestBody @Valid NewspaperDTO newspaperDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws ForbiddenException, MongoException, BadRequestException{
			/*Controllo se la validazione dei campi obbligatori va a buon fine*/
			System.out.println("CREAZIONE NUOVO GIORNALE IN CORSO...");
			if(result.hasErrors()){
				throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
			}
			
			NewspaperTemplate template = newspaperService.findNewspaperTemplateByIdTemplate(newspaperDTO.getIdTemplate());
			
			if(template == null )
				throw new BadRequestException("idTemplate not valid or constraints not observed!");
			Newspaper n = newspaperService.saveNewspaper(newspaperDTO, idScenario, activeUser.getId());
			Id id = new Id(n.getId());
			//logService.logCreateNewspaper(idScenario, id.getId(), activeUser.getId());
			return id;
		}
		
		//ritorna l'ultimo newspaper pubblicato per quello scenario
		//viene scatenata NotFoundException se non sono stati pubblicati ancora numeri
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers/last", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
		public Newspaper getLastNewspaper(@PathVariable String idScenario) throws MongoException, NotFoundException, ForbiddenException{

			System.out.println("Getting last newspaper ");
			Newspaper n = newspaperService.findLastNewspaperInScenarioPUBLIC(idScenario);
			if (n==null){	
				throw new NotFoundException("No public newspaper founded in scenario!");
			}

			return n;
		}
		
		//ritorna l'ultimo newspaper pubblicato o in bozza per quello scenario
		//viene scatenata NotFoundException se non sono stati creati ancora numeri
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/myNewspapers/last", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Newspaper', 'WRITE')")

		public Newspaper getMyLastNewspaper(@PathVariable String idScenario) throws MongoException, NotFoundException, ForbiddenException{

			System.out.println("Getting last newspaper ");
			Newspaper n = newspaperService.findLastNewspaperInScenarioPRIVATE(idScenario);
			if (n==null){	
				throw new NotFoundException("No public newspaper founded in scenario!");
			}

			return n;
		}
		
		//ritorna il newspaper specifico se è stato pubblicato
		//viene scatenata NotFoundException se il numero cercato non è stato ancora pubblicato
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers/{number}", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
		public Newspaper getNewspaperNumber(@PathVariable String idScenario, @PathVariable Integer number) throws MongoException, NotFoundException, ForbiddenException{

			System.out.println("Getting newspaper number: "+number);
			Newspaper n = newspaperService.findNewspaperNumberInScenarioPUBLIC(idScenario, number);
			if (n==null){	
				throw new NotFoundException("No public newspaper with number "+number+" founded in scenario");
			}
				
			return n;
		}
		
		//ritorna il newspaper specifico se è stato creato (draft o published)
		//viene scatenata NotFoundException se il numero cercato non è stato ancora pubblicato
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/myNewspapers/{number}", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Newspaper', 'WRITE')")
		public Newspaper getMyNewspaperNumber(@PathVariable String idScenario, @PathVariable Integer number) throws MongoException, NotFoundException, ForbiddenException{

			System.out.println("Getting newspaper number: "+number);
			Newspaper n = newspaperService.findNewspaperNumberInScenarioPRIVATE(idScenario, number);
			if (n==null){	
				throw new NotFoundException("No public or draft newspaper with number "+number+" founded in scenario");
			}

			return n;
		}
		//ritorna la lista di newspaper pubblicati di quello scenario
		//viene scatenata NotFoundException se non sono stati ancora pubblicati newspaper per quello scenario
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
		public List<Newspaper> getPublishedNewspapers(@PathVariable String idScenario) throws MongoException, NotFoundException, ForbiddenException{

			System.out.println("Getting newspaper");
			List<Newspaper> l = newspaperService.findNewspapersInScenarioPUBLIC(idScenario);
			if (l==null){
					throw new NotFoundException("No published newspaper founded in scenario");
			}

			return l;
		}
		
	
		//ritorna la lista di newspaper di quello scenario (sia pubblicati che in bozza)
		//viene scatenata NotFoundException se non sono stati ancora creati newspaper (draft o published) per quello scenario
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/myNewspapers", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Newspaper', 'WRITE')")
		public List<Newspaper> getMyNewspapers(@PathVariable String idScenario) throws MongoException, NotFoundException, ForbiddenException{

			System.out.println("Getting my newspaper");
			List<Newspaper> l = newspaperService.findNewspapersInScenarioPRIVATE(idScenario);
			if (l==null){
				throw new NotFoundException("No newspaper (published or draft) founded in scenario");
			}

			return l;
		}
		
		//utile per reperire l'ultimo nome assegnato al giornale dello scenario (l'utente è libero di modificare il nome ad ogni edizione del giornale e la modifica non è retroattiva)
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/lastNewspaperName", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
		public String getLastNewspaperName(@PathVariable String idScenario) throws MongoException, NotFoundException, ForbiddenException{

			
			System.out.println("Getting last newspaper name");
			Newspaper n = newspaperService.findLastNewspaperInScenarioPUBLIC(idScenario);
			if (n==null || n.getName()==null){
				throw new NotFoundException("No newspaper founded in scenario");
			}
			
			return n.getName();
			

		}
		
		//Ritorna un oggetto Newspaper (e prende in ingresso un oggetto NewspaperDTOPut ) 
		//Per prima cosa vedo se l'oggetto newspaperDTOPut ha publish a true, in quel caso chiamo la publishNewspaper che controllerà 
		//se gli articoli rispettano i vincoli ed in caso affermativo pubblicherà lo scenario. Se publish non è a true invece procedo con l'updateNewspaper.
		//Se publish è a true l'unica operazione che viene eseguita è la pubblicazione dello scenario (vengono ignorate eventuali altre modifiche passate in newspaperDTOPut)
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers", method=RequestMethod.PUT)
		@PreAuthorize("hasRole('ROLE_USER') and (hasPermission(#idScenario, 'Scenario', 'MODERATOR') or hasPermission(#idScenario, 'Newspaper', 'WRITE'))")
		public Newspaper updateNewspaper(@PathVariable String idScenario, @RequestParam(value = "number", required=true) Integer number, @RequestBody NewspaperDTOPut newspaperDTOPut, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, IllegalStateException, IOException{
			Newspaper n = null;
			if(newspaperDTOPut.getPublish()){
				n = newspaperService.publishNewspaper(idScenario, number);
			}else{
				n = newspaperService.updateNewspaper(idScenario, number, newspaperDTOPut);
				System.out.println("update newspaper!!!");
				//logService.logUpdateNewspaper(idScenario,n.getId(), activeUser.getId());
			}
			if(n==null)
				throw new BadRequestException("Impossible to update newspaper");
			return n;
		}
		
				
		@ResponseStatus(value = HttpStatus.NO_CONTENT)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers", method=RequestMethod.DELETE)
		@PreAuthorize("hasRole('ROLE_USER') and (hasPermission(#idScenario, 'Scenario', 'MODERATOR') or hasPermission(#idScenario, 'Newspaper', 'WRITE'))")
		public void deleteNewspaper(@PathVariable String idScenario, @RequestParam(value = "number", required=true) Integer number, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException, ForbiddenException{
			
			boolean dd = newspaperService.deleteNewspaper(idScenario, number);
			if(!dd)
				throw new BadRequestException("Impossible to delete newspaper");
			
			//logService.logDeleteScenario(id, activeUser.getId(), deleted);
			//scenarioService.lastUpdateScenario(id, new Date());
		}
		
		//metodo usato sia per aggiungere un nuovo articolo ad un numero di giornale sia per modificarne uno esistente
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers/{number}/articles", method=RequestMethod.PUT)
		@PreAuthorize("hasRole('ROLE_USER') and ( hasPermission(#idScenario, 'Scenario', 'MODERATOR') or hasPermission(#idScenario, 'Newspaper', 'WRITE'))")
		public Newspaper updateArticle(@PathVariable String idScenario, @PathVariable Integer number, @RequestBody ArticleDTO articleDTO, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, IllegalStateException, IOException{
			Newspaper n = newspaperService.updateArticle(idScenario, number, articleDTO, activeUser.getId());
			//logService.logUpdateNewspaper(idScenario,n.getId(), activeUser.getId());
			return n;
		}
		
		
		//metodo usato per assegnare il ruolo di giornalista a un nuovo user
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/journalist/{idUser}", method=RequestMethod.PUT)
		@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#idScenario, 'Scenario', 'MODERATOR')")
		public void updateUserJournalist(@PathVariable String idScenario, @PathVariable String idUser, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, IllegalStateException, IOException, UserNotFoundException{
			
			Reference newJournalist = userService.getUserReferenceById(idUser);
		    newspaperService.updateJournalist(idScenario, newJournalist);
			//logService.logUpdateQualcosa(idScenario,n.getId(), activeUser.getId());
			
		}
		
		//metodo usato per rimuovere uno user dal ruolo di giornalista
		@ResponseStatus(value = HttpStatus.NO_CONTENT)
		@RequestMapping(value="/v1/scenarios/{idScenario}/journalist", method=RequestMethod.DELETE)
		@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#idScenario, 'Scenario', 'MODERATOR')")
		public void removeUserFromJournalist(@PathVariable String idScenario, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException, ForbiddenException{
			newspaperService.updateJournalist(idScenario, null);
		}
}
