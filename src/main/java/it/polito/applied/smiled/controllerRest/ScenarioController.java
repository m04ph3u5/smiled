package it.polito.applied.smiled.controllerRest;

import it.polito.applied.smiled.dto.CharacterDTO;
import it.polito.applied.smiled.dto.EmailDTO;
import it.polito.applied.smiled.dto.EventDTO;
import it.polito.applied.smiled.dto.RevisionDTO;
import it.polito.applied.smiled.dto.ScenarioDTO;
import it.polito.applied.smiled.dto.StatusDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.CommentDTO;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.ScenarioService;
import it.polito.applied.smiled.validator.CharacterDTOPostValidator;
import it.polito.applied.smiled.validator.CharacterDTOPutValidator;
import it.polito.applied.smiled.validator.ScenarioDTOPostValidator;
import it.polito.applied.smiled.validator.ScenarioDTOPutValidator;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

@RestController
public class ScenarioController extends BaseController{
	
	//TODO
	/*Implementare le funzionalità di ScenarioDTOPostValidator e ScenarioDTOPutValidator */
	
	//Ci sono due validatori differenti, uno per la POST e uno per la PUT
	@Autowired
	private ScenarioDTOPostValidator scenarioDTOPostValidator;
	
	@Autowired
	private ScenarioDTOPutValidator scenarioDTOPutValidator;
	
	@Autowired
	private CharacterDTOPostValidator characterDTOPostValidator;
	
	@Autowired
	private CharacterDTOPutValidator characterDTOPutValidator;
	
	@Autowired
	private ScenarioService scenarioService;
	
	
	//Ritorna l'id dello scenario creato se si è riusciti a crearlo (e prende in ingresso un oggetto ScenarioDTO)
	//Quando viene creato, uno scenario è privo di users, collaborators e characters, ma ha il teacherCreator
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_TEACHER')")
	public Id createScenario(@RequestBody @Valid ScenarioDTO scenarioDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, IllegalStateException, IOException{
		/*Controllo se la validazione dei campi obbligatori va a buon fine(per le modifiche si utilizza il metodo PUT)*/
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
		scenarioDTO.setId(null); //non dovrebbe servire
		
		//TODO controllare che alcuni campi siano null (es. lista di partecipanti) + altre validazioni logiche
		scenarioDTOPostValidator.validate(scenarioDTO, result);
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
						
		Id id = new Id(scenarioService.createScenario(scenarioDTO,activeUser.getUsername()));
		return id;
	}
	
	//Ritorna un oggetto Scenario (e prende in ingresso un oggetto ScenarioDTO )
	/*Le modifiche ad uno scenario possono essere effettuate da tutti i moderatori dello scenario, se TEACHER
	 * Dopo la chiusura, solo il creatore conserverà i permessi per poter modificare lo scenario, tutti gli altri (collaboratori e partecipanti)
	 * manterranno i permessi in sola lettura.*/
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Scenario updateScenario(@PathVariable String id, @RequestBody ScenarioDTO scenarioDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, IllegalStateException, IOException{
		/*Sulle PUT effettuiamo solo validazioni custom,  
		 * in quanto � possibile modificare arbitrariamente solo alcuni campi
		 * e lasciare altri a null quando si fa una update
		 * */
		
		scenarioDTO.setId(id);
		//TODO Qui bisogna mettere tutte le validazioni custom sulla update di uno scenario
		/*scenarioDTOPutValidator.validate(scenarioDTO, result);
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}*/
		return scenarioService.updateScenario(id, scenarioDTO,activeUser.getId());
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ')")
	public Scenario getScenario(@PathVariable String id) throws MongoException, NotFoundException, ForbiddenException{
		
		//Non � possibile fare la GET di uno scenario se non fa parte della propria lista di scenari aperti o chiusi
//		if(!activeUser.containsOpenScenario(id) && !activeUser.containsClosedScenario(id))
//			throw new ForbiddenException();
		System.out.println("Getting scenarios");

		return scenarioService.getScenario(id);
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'CREATOR')")
	public void deleteScenario(@PathVariable String id) throws MongoException, NotFoundException, BadRequestException, ForbiddenException{
		if(id == null)
			throw new BadRequestException();
		
		scenarioService.removeScenario(id);
	}
	
	//Aggiungo una lista di partecipanti allo scenario  
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/users", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public List<Reference> subscribeStudents(@PathVariable String id, @RequestBody @Valid List<EmailDTO> studentsEmail, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException{
		
		//Valido la lista di email che ricevo. Tutte le email che arrivano devono essere corrette
		if(result.hasErrors()){
			throw new BadRequestException();
		}	
		
		return scenarioService.subscribeStudentIfNotPresent(studentsEmail, activeUser.getId(), id);
	}
	
	
	//Aggiungo un collaboratore allo scenario 
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/collaborators", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_TEACHER')and hasPermission(#id, 'Scenario', 'CREATOR')")
	public Reference subscribeCollaborators(@PathVariable String id, @RequestBody @Valid EmailDTO collaboratorEmail, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{

		//Valido l'email che ricevo. Tutte le email che arrivano devono essere corrette
		if(result.hasErrors()){
			throw new BadRequestException();
		}	
		
		return scenarioService.addCollaboratorToScenario(collaboratorEmail.getEmail(), id);
	}

  
	//Tolgo uno specifico user dallo scenario
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/users/{userId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void removeOneStudent(@PathVariable String id, @PathVariable String userId) throws MongoException, BadRequestException, ForbiddenException{
		
		scenarioService.removeUserFromScenario(id,userId);
	}
	
	//Tolgo uno specifico collaboratore dallo scenario e valuto il parametro "putInAttendeesList"
	//se � true: declasso quello user a semplice partecipante, se false lo tolgo definitivamente dallo scenario
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/collaborators/{collaboratorId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'CREATOR')")
	public void removeOneCollaborator(@PathVariable String id, @PathVariable String collaboratorId, @RequestParam(value = "putInAttendeesList", required=false) Boolean putInAttendeesList) throws MongoException, BadRequestException, ForbiddenException{	
		if(putInAttendeesList==null)
			putInAttendeesList=false;
		scenarioService.removeCollaboratorFromScenario(id, collaboratorId, putInAttendeesList);
	}
	
	//Creo e aggiungo un nuovo personaggio allo scenario  
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{scenarioId}/characters", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#scenarioId, 'Scenario', 'MODERATOR')")
	public Id addCharacter(@PathVariable String scenarioId, @RequestBody @Valid CharacterDTO characterDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException{

		//Validazione semplice viene fatta solo nella POST 
		if(result.hasErrors()){
			throw new BadRequestException();
		}	
		
		//TODO Validazione custom
		characterDTOPostValidator.validate(characterDTO, result);
		if(result.hasErrors()){
			throw new BadRequestException();
		}

		return scenarioService.addCharacterToScenario(characterDTO, scenarioId, activeUser.getId());
	}
	
	//Restituisce il personaggio cercato
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ')")
	public Character getCharacter(@PathVariable String id, @PathVariable String characterId) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{

		return scenarioService.getCharacter (id, characterId);
	}

	//Ritorna un oggetto Character (e prende in ingresso un oggetto CharacterDTO )
	/*TODO
	 * Valutare in fase di realizzazione del client se modificare il valore di ritorno da Character a Scenario*/
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}", method=RequestMethod.PUT)
	@PreAuthorize("(hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')) or (hasRole('ROLE_USER') and hasPermission(#characterId, 'Character', 'WRITE'))")
	public Character updateCharacter(@PathVariable String id, @PathVariable String characterId, @RequestBody CharacterDTO characterDTO, BindingResult result) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		/*Sulle PUT effettuiamo solo validazioni custom,  
		 * in quanto � possibile modificare arbitrariamente solo alcuni campi
		 * e lasciare altri a null quando si fa una update
		 * */
		//TODO Qui bisogna mettere tutte le validazioni custom sulla update di un character (controllare che nel DTO non sia presente l'ID)
		characterDTOPutValidator.validate(characterDTO, result);
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
		characterDTO.setId(characterId);
		return scenarioService.updateCharacter(id, characterDTO);
	}
	
	//Tolgo uno specifico character dallo scenario
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void removeOneCharacter(@PathVariable String id, @PathVariable String characterId) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{	
		scenarioService.removeCharacterFromScenario(id, characterId);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/users/{userId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Character updateUserCharacter(@PathVariable String id, @PathVariable String characterId, @PathVariable String userId) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		
		return scenarioService.updateUserCharacter(id, characterId, userId);
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/users/{userId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void removeUserFromCharacter(@PathVariable String id, @PathVariable String characterId, @PathVariable String userId) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		
		scenarioService.removeUserFromCharacter(id, characterId, userId);
	}
	
	//gestione dei permessi complicata e per questo pi� onerosa rispetto alle altre in termini di query al db
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/status/{statusId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public Post updateStatus(@PathVariable String id, @PathVariable String statusId, @RequestBody StatusDTO status) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		auth.setAuthenticated(false);
		return scenarioService.updateStatus (id, statusId, status, auth);
	}
	
	//TODO modificare gestione permessi
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/status", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#characterId, 'Character', 'WRITE')")
	public Id insertStatus(@PathVariable String id, @PathVariable String characterId, @RequestBody StatusDTO status) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return scenarioService.insertStatus (id, characterId, status, auth);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ')")
	public Post getPost(@PathVariable String id, @PathVariable String postId) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return scenarioService.getPost (id,postId, auth);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/posts", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ')")
	public Page<Post> getPagedPosts(@PathVariable String id, @RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem, @RequestParam(value = "historicOrder", required=false) Boolean historicOrder) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
	
		if(nPag==null || nPag<0)
			nPag=0;
		if(nItem==null || nItem<=0)
			nItem=5;
		if(historicOrder==null)
			historicOrder=false;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		return scenarioService.getPagedPosts(id, null, nPag, nItem, historicOrder, auth);
	}

	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/posts", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ')")
	public Page<Post> getPagedPostsOfCharacter(@PathVariable String id, @PathVariable String characterId, @RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem, @RequestParam(value = "historicOrder", required=false) Boolean historicOrder) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
	
		if(nPag==null || nPag<0)
			nPag=0;
		if(nItem==null || nItem<=0)
			nItem=5;
		if(historicOrder==null)
			historicOrder=false;
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		return scenarioService.getPagedPosts(id, characterId, nPag, nItem, historicOrder,auth);
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/events", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Id insertEvent(@PathVariable String id, @RequestBody EventDTO event, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{

		return scenarioService.insertEvent (id, event, activeUser);
	}
	
	//Come sempre le PUT sono pi� onerose. In questo caso l'update pu� essere fatto o dal creatore dell'evento oppure da un Moderator di tipo Teacher dello Scenario
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/events/{eventId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Post updateEvent(@PathVariable String id, @PathVariable String eventId, @RequestBody EventDTO event, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{

		return scenarioService.updateEvent (id, eventId, event, activeUser);
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public void deletePost(@PathVariable String id, @PathVariable String postId) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		scenarioService.deletePost(id, postId, auth);
	}
	
	//permette ai moderatori di inserire e di modificare una revisione ad un Post
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/revisions", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void insertRevision(@PathVariable String id, @PathVariable String postId, @RequestBody RevisionDTO revision, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{

		scenarioService.insertRevision (id, postId, revision, activeUser);
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/comments", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public Id insertComment(@PathVariable String id, @PathVariable String postId, @RequestBody CommentDTO commentDTO) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return scenarioService.insertComment (id, postId, commentDTO, auth);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/comments/{commentId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public CommentInterface updateComment(@PathVariable String id, @PathVariable String postId, @PathVariable String commentId, @RequestBody CommentDTO commentDTO) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return scenarioService.updateComment (id, postId, commentId, commentDTO, auth, false);
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/comments/{commentId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public void deleteComment(@PathVariable String id, @PathVariable String postId, @PathVariable String commentId) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		scenarioService.deleteComment(id, postId, commentId, auth, false);
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/metaComments", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public Id insertMetaComment(@PathVariable String id, @PathVariable String postId, @RequestBody CommentDTO commentDTO) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return scenarioService.insertMetaComment (id, postId, commentDTO, auth);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/metaComments/{metaCommentId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public CommentInterface updateMetaComment(@PathVariable String id, @PathVariable String postId, @PathVariable String metaCommentId, @RequestBody CommentDTO commentDTO) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return scenarioService.updateComment (id, postId, metaCommentId, commentDTO, auth, true);
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/metaComments/{metaCommentId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public void deleteMetaComment(@PathVariable String id, @PathVariable String postId, @PathVariable String metaCommentId) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		scenarioService.deleteComment(id, postId, metaCommentId, auth, true);
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/likes", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public void addLikeToPost(@PathVariable String id, @PathVariable String postId) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		scenarioService.addLikeToPost(id, postId, auth);
	}
}
