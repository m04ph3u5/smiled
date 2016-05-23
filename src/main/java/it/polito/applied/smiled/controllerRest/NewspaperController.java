package it.polito.applied.smiled.controllerRest;

import java.io.IOException;

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
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.newspaper.Article;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.NewspaperService;

@RestController
public class NewspaperController extends BaseController{

		@Autowired
		private NewspaperService newspaperService;
		
	
		//Ritorna l'id del giornale creato se si è riusciti a crearlo (e prende in ingresso un oggetto NewspaperDTO)
		//Quando viene creato un giornale l'unico campo obbligatorio è idTemplate
		//l'oggetto newspaperDTO contiene idTemplate (obbligatorio), name (opz), historicalDate (opz), article (opz).
		//Questo metodo scatena ForbiddenException se si prova a eseguire quando c'è ancora un giornale in creazione (in stato draft) nello scenario. E' quindi possibile
	    //creare un nuovo numero del giornale solo se il precedente è già stato pubblicato.
	    //idTemplate una volta scelto per un newspaper (un numero del giornale dello scenario) non è più modificabile per quel numero, ma numeri successivi potranno usare template diverso.
		@ResponseStatus(value = HttpStatus.CREATED)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers", method=RequestMethod.POST)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
		public Id createNewspaper(@PathVariable String idScenario, @RequestBody @Valid NewspaperDTO newspaperDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws ForbiddenException, MongoException, BadRequestException{
			/*Controllo se la validazione dei campi obbligatori va a buon fine*/
			System.out.println("CREAZIONE NUOVO GIORNALE IN CORSO...");
			if(result.hasErrors()){
				throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
			}
			
			NewspaperTemplate template = newspaperService.findNewspaperTemplateByIdTemplate(newspaperDTO.getIdTemplate());
			
			if(template == null || !newspaperService.validateCheckingConstraintsOnCreation(newspaperDTO, template))
				throw new BadRequestException("idTemplate not valid or constraints not observed ");
			Newspaper n = newspaperService.saveNewspaper(newspaperDTO, idScenario, activeUser.getId());
			Id id = new Id(n.getId());
			//logService.logCreateNewspaper(idScenario, id.getId(), activeUser.getId());
			return id;
		}
		
		//il parametro number è opzionale. Se non viene passato questo metodo ritorna l'ultimo numero creato per quello scenario.
		//viene scatenata NotFoundException se non sono stati ancora creati newspaper per quello scenario oppure se si ricerca un numero specifico che non viene trovato
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
		public Newspaper getNewspaper(@PathVariable String idScenario, @RequestParam(value = "number", required=false) Integer number) throws MongoException, NotFoundException, ForbiddenException{

			System.out.println("Getting newspaper");
			Newspaper n = newspaperService.findNewspaperByIdScenarioAndNumber(idScenario, number);
			if (n==null){
				if(number==null)
					throw new NotFoundException("No newspaper founded in scenario");
				else
					throw new NotFoundException("No newspaper with number "+number+" founded in scenario");
			}
				
			return n;
		}
		
		//utile per settare già il nome del giornale per numeri successivi al primo (l'utente è comunque libero di modificare il nome ad ogni edizione del giornale e la modifica non è retroattiva)
		//se il giornale esiste ma non ha ancora un nome ritorna null
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/lastNewspaperName", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
		public String getLastNewspaperName(@PathVariable String idScenario) throws MongoException, NotFoundException, ForbiddenException{

			
			System.out.println("Getting last newspaper name");
			Newspaper n = newspaperService.findNewspaperByIdScenarioAndNumber(idScenario, null);
			if (n==null){
				throw new NotFoundException("No newspaper founded in scenario");
			}
			if(n.getName()!=null)
				return n.getName();
			else
				return null;
				
			
		}
		
		//Ritorna un oggetto Newspaper (e prende in ingresso un oggetto NewspaperDTOPut )
		
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers/{number}", method=RequestMethod.PUT)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'NEWSPAPER')")
		public Newspaper updateNewspaper(@PathVariable String idScenario, @PathVariable int number, @RequestBody NewspaperDTOPut newspaperDTOPut, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, IllegalStateException, IOException{
			newspaperService.updateNewspaper(idScenario, number, newspaperDTOPut);
			//logService.logUpdateNewspaper(idScenario,n.getId(), activeUser.getId());
			return null;
		}
		
		@ResponseStatus(value = HttpStatus.NO_CONTENT)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers/{number}", method=RequestMethod.DELETE)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'NEWSPAPER')")
		public void deleteNewspaper(@PathVariable String idScenario,@PathVariable int number, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException, ForbiddenException{
			if(idScenario == null)
				throw new BadRequestException();
			newspaperService.deleteNewspaper(idScenario, number);
			
			//logService.logDeleteScenario(id, activeUser.getId());
			//scenarioService.lastUpdateScenario(id, new Date());
		}
		
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/newspapers/{number}/articles/{idArticleTemplate}", method=RequestMethod.PUT)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'NEWSPAPER')")
		public Article updateArticle(@PathVariable String id, @RequestBody ArticleDTO articleDTO, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, IllegalStateException, IOException{
			Article n = new Article();
			//logService.logUpdateNewspaper(idScenario,n.getId(), activeUser.getId());
			return null;
		}
		
		
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{idScenario}/journalist/users/{idUser}", method=RequestMethod.PUT)
		@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#idScenario, 'Scenario', 'MODERATOR')")
		public Reference updateUserJournalist(@PathVariable String id, @RequestBody ArticleDTO articleDTO, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, IllegalStateException, IOException{
			
			//logService.logUpdateQualcosa(idScenario,n.getId(), activeUser.getId());
			return null;
		}
		
		@ResponseStatus(value = HttpStatus.NO_CONTENT)
		@RequestMapping(value="/v1/scenarios/{idScenario}/journalist/users/{idUser}", method=RequestMethod.DELETE)
		@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#idScenario, 'Scenario', 'MODERATOR')")
		public void deleteUserFromJournalist(@PathVariable String idScenario, @PathVariable String idUser, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException, ForbiddenException{
			if(idScenario == null)
				throw new BadRequestException();

		}
}
