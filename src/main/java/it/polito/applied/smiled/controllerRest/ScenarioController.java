package it.polito.applied.smiled.controllerRest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
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

import it.polito.applied.smiled.dto.CharacterDTO;
import it.polito.applied.smiled.dto.EmailDTO;
import it.polito.applied.smiled.dto.EventDTO;
import it.polito.applied.smiled.dto.MissionDTO;
import it.polito.applied.smiled.dto.RevisionDTO;
import it.polito.applied.smiled.dto.ScenarioDTO;
import it.polito.applied.smiled.dto.StatusDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.pojo.Action;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.CommentDTO;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.LogService;
import it.polito.applied.smiled.service.ScenarioService;
import it.polito.applied.smiled.validator.CharacterDTOPostValidator;
import it.polito.applied.smiled.validator.CharacterDTOPutValidator;
import it.polito.applied.smiled.validator.ScenarioDTOPostValidator;
import it.polito.applied.smiled.validator.ScenarioDTOPutValidator;

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
	
	@Autowired
	private LogService logService;
	
	private int maxItem = 20;
	
	//Ritorna l'id dello scenario creato se si è riusciti a crearlo (e prende in ingresso un oggetto ScenarioDTO)
	//Quando viene creato, uno scenario è privo di users, collaborators e characters, ma ha il teacherCreator
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_TEACHER')")
	public Id createScenario(@RequestBody @Valid ScenarioDTO scenarioDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, IllegalStateException, IOException{
		/*Controllo se la validazione dei campi obbligatori va a buon fine(per le modifiche si utilizza il metodo PUT)*/
		System.out.println("CREAZIONE NUOVO SCENARIO IN CORSO...");
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
		
		
		//TODO controllare che alcuni campi siano null (es. lista di partecipanti) + altre validazioni logiche
		scenarioDTOPostValidator.validate(scenarioDTO, result);
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
						
		Id id = new Id(scenarioService.createScenario(scenarioDTO,activeUser.getUsername()));
		logService.logCreateScenario(id.getId(), activeUser.getId());
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
		
		//TODO Qui bisogna mettere tutte le validazioni custom sulla update di uno scenario
		/*scenarioDTOPutValidator.validate(scenarioDTO, result);
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}*/
		Scenario s = scenarioService.updateScenario(id, scenarioDTO,activeUser);
		logService.logUpdateScenarioInfo(id, activeUser.getId());
		// la data è stata già aggiornata ;) scenarioService.lastUpdateScenario(id, new Date());
		return s;
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
	public void deleteScenario(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException, ForbiddenException{
		if(id == null)
			throw new BadRequestException();
		
		scenarioService.removeScenario(id);
		logService.logDeleteScenario(id, activeUser.getId());
		scenarioService.lastUpdateScenario(id, new Date());
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
		List<Reference> list = scenarioService.subscribeStudentIfNotPresent(studentsEmail, activeUser.getId(), id);
		logService.logNewAttendees(id, activeUser.getId(), list);
		scenarioService.lastUpdateScenario(id, new Date());
		return list;
	}
	
	
	//Aggiungo un collaboratore allo scenario 
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/collaborators/{idCollaborator}", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_TEACHER')and hasPermission(#id, 'Scenario', 'CREATOR')")
	public Reference addCollaboratorToScenario(@PathVariable String id, @PathVariable String idCollaborator , @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{

		Reference r = scenarioService.addCollaboratorToScenario(idCollaborator, id, activeUser);
		logService.logNewCollaborator(id, activeUser.getId(), r);
		scenarioService.lastUpdateScenario(id, new Date());
		return r;
	}

  
	//Tolgo uno specifico user dallo scenario
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/users/{userId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void removeOneStudent(@PathVariable String id, @PathVariable String userId, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException{
		
		scenarioService.removeUserFromScenario(id,userId);
		logService.logRemoveAttendee(id, activeUser.getId(), userId);
		scenarioService.lastUpdateScenario(id, new Date());
	}
	
	//Tolgo uno specifico collaboratore dallo scenario e valuto il parametro "putInAttendeesList"
	//se � true: declasso quello user a semplice partecipante, se false lo tolgo definitivamente dallo scenario
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/collaborators/{collaboratorId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'CREATOR')")
	public void removeOneCollaborator(@PathVariable String id, @PathVariable String collaboratorId, @RequestParam(value = "putInAttendeesList", required=false) Boolean putInAttendeesList, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException{	
		if(putInAttendeesList==null)
			putInAttendeesList=false;
		scenarioService.removeCollaboratorFromScenario(id, collaboratorId, putInAttendeesList);
		logService.logRemoveCollaborator(id, activeUser.getId(), collaboratorId);
		scenarioService.lastUpdateScenario(id, new Date());
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
		
		Id id = scenarioService.addCharacterToScenario(characterDTO, scenarioId, activeUser.getId());
		logService.logNewCharacter(scenarioId, activeUser.getId(), id.getId());
		scenarioService.lastUpdateScenario(scenarioId, new Date());
		return id;
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{scenarioId}/characters", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#scenarioId, 'Scenario', 'MODERATOR')")
	public List<Character> getCharacters(@PathVariable String scenarioId) throws MongoException, BadRequestException, ForbiddenException{
		return scenarioService.getAllCharacters(scenarioId);
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
	public Character updateCharacter(@PathVariable String id, @PathVariable String characterId, @RequestBody CharacterDTO characterDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
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
	
		Character c = scenarioService.updateCharacter(id, characterDTO);
				
		logService.logUpdateCharacterProfile(id, activeUser.getId(), c.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return c;
	}
	
	//Tolgo uno specifico character dallo scenario
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void removeOneCharacter(@PathVariable String id, @PathVariable String characterId, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{	
		scenarioService.removeCharacterFromScenario(id, characterId);
		logService.logRemoveCharacter(id, activeUser.getId(), characterId);
		scenarioService.lastUpdateScenario(id, new Date());

	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/users/{userId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Character updateUserCharacter(@PathVariable String id, @PathVariable String characterId, @PathVariable String userId, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		Character c = scenarioService.updateUserCharacter(id, characterId, userId);
		logService.logNewAssociation(id, activeUser.getId(), c.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return c;
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/users/{userId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void removeUserFromCharacter(@PathVariable String id, @PathVariable String characterId, @PathVariable String userId, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		scenarioService.removeUserFromCharacter(id, characterId, userId);
		logService.logRemoveAssociation(id, activeUser.getId(), characterId);
		scenarioService.lastUpdateScenario(id, new Date());
		
	}
	
	//gestione dei permessi complicata e per questo pi� onerosa rispetto alle altre in termini di query al db
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/status/{statusId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public Post updateStatus(@PathVariable String id, @PathVariable String statusId, @RequestBody StatusDTO status) throws MongoException, NotFoundException, ForbiddenException, BadRequestException, IOException{

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Post p = scenarioService.updateStatus (id, statusId, status, auth);
		logService.logUpdatePost(id, ((CustomUserDetails) auth.getPrincipal()).getId(), p.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return p;
	}
	
	//TODO modificare gestione permessi
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/status", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#characterId, 'Character', 'WRITE')")
	public Id insertStatus(@PathVariable String id, @PathVariable String characterId, @RequestBody StatusDTO status) throws MongoException, NotFoundException, ForbiddenException, BadRequestException, IOException{

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Id idPost = scenarioService.insertStatus (id, characterId, status, auth);
		logService.logInsertPost(id, ((CustomUserDetails) auth.getPrincipal()).getId(), idPost.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return idPost;
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
	public Page<Post> getPagedPosts(@PathVariable String id, @RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem, @RequestParam(value = "historicOrder", required=false) Boolean historicOrder, @RequestParam(value = "orderDesc", required=false) Boolean orderDesc) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{

		if(nPag==null || nPag<0)
			nPag=0;
		if(nItem==null || nItem<=0)
			nItem=5;
		if(historicOrder==null){
			historicOrder=false;
		}
		if(orderDesc==null){
			orderDesc=true;
		}
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		return scenarioService.getPagedPosts(id, null, nPag, nItem, historicOrder, orderDesc, auth);
	}

	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/newPosts", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ')")
	public Page<Post> getListOfNewPosts(@PathVariable String id, @RequestBody ArrayList<Id> idOfPosts ) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{

		System.out.println("***************");
		System.out.println(idOfPosts.get(0).getId());
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		return scenarioService.customPageableFindAll(id, idOfPosts, auth);
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

		//TODO considerare se possibile anche per i character richiederli in ordine discendente (penultimo parametro false).
		return scenarioService.getPagedPosts(id, characterId, nPag, nItem, historicOrder, true, auth);
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/events", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Id insertEvent(@PathVariable String id, @RequestBody EventDTO event, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, ForbiddenException, BadRequestException, IOException{
		Id idEvent = scenarioService.insertEvent (id, event, activeUser);
		logService.logInsertPost(id, activeUser.getId(), idEvent.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return idEvent; 
	}
	
	//Come sempre le PUT sono pi� onerose. In questo caso l'update pu� essere fatto o dal creatore dell'evento oppure da un Moderator di tipo Teacher dello Scenario
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/events/{eventId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Post updateEvent(@PathVariable String id, @PathVariable String eventId, @RequestBody EventDTO event, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, ForbiddenException, BadRequestException, IOException{

		Post p =  scenarioService.updateEvent (id, eventId, event, activeUser);
		logService.logUpdatePost(id, activeUser.getId(), p.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return p;
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public void deletePost(@PathVariable String id, @PathVariable String postId, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, ForbiddenException, NotFoundException, FileNotFoundException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		scenarioService.deletePost(id, postId, auth);
		logService.logDeletePost(id, activeUser.getId(), postId);
		scenarioService.lastUpdateScenario(id, new Date());
	}
	
	//permette ai moderatori di inserire e di modificare una revisione ad un Post
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/revisions", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void insertRevision(@PathVariable String id, @PathVariable String postId, @RequestBody RevisionDTO revision, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		//TODO aggiungere gestione Log

		scenarioService.insertRevision (id, postId, revision, activeUser);
		scenarioService.lastUpdateScenario(id, new Date());
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/comments", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public Id insertComment(@PathVariable String id, @PathVariable String postId, @RequestBody CommentDTO commentDTO) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Id commentId = scenarioService.insertComment (id, postId, commentDTO, auth);
		logService.logNewComment(id, ((CustomUserDetails) auth.getPrincipal()).getId(), postId, commentId.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return commentId;
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/comments/{commentId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public CommentInterface updateComment(@PathVariable String id, @PathVariable String postId, @PathVariable String commentId, @RequestBody CommentDTO commentDTO) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CommentInterface comment = scenarioService.updateComment (id, postId, commentId, commentDTO, auth, false);
		logService.logUpdateComment(id, ((CustomUserDetails)auth.getPrincipal()).getId(), postId, commentId);
		scenarioService.lastUpdateScenario(id, new Date());
		return comment;
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/comments/{commentId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public void deleteComment(@PathVariable String id, @PathVariable String postId, @PathVariable String commentId) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		scenarioService.deleteComment(id, postId, commentId, auth, false);
		logService.logDeleteComment(id, ((CustomUserDetails)auth.getPrincipal()).getId(), postId, commentId);
		scenarioService.lastUpdateScenario(id, new Date());
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/metaComments", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public Id insertMetaComment(@PathVariable String id, @PathVariable String postId, @RequestBody CommentDTO commentDTO) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Id metaId = scenarioService.insertMetaComment (id, postId, commentDTO, auth);
		logService.logNewMetaComment(id, ((CustomUserDetails) auth.getPrincipal()).getId(), postId, metaId.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return metaId;
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/metaComments/{metaCommentId}", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public CommentInterface updateMetaComment(@PathVariable String id, @PathVariable String postId, @PathVariable String metaCommentId, @RequestBody CommentDTO commentDTO) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		CommentInterface comment = scenarioService.updateComment (id, postId, metaCommentId, commentDTO, auth, true);
		logService.logUpdateMetaComment(id, ((CustomUserDetails)auth.getPrincipal()).getId(), postId, metaCommentId);
		scenarioService.lastUpdateScenario(id, new Date());
		return comment;
	}
	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/metaComments/{metaCommentId}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public void deleteMetaComment(@PathVariable String id, @PathVariable String postId, @PathVariable String metaCommentId) throws MongoException, BadRequestException, ForbiddenException, NotFoundException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		scenarioService.deleteComment(id, postId, metaCommentId, auth, true);
		logService.logDeleteMetaComment(id, ((CustomUserDetails)auth.getPrincipal()).getId(), postId, metaCommentId);
		scenarioService.lastUpdateScenario(id, new Date());
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="/v1/scenarios/{id}/posts/{postId}/likes", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'WRITE')")
	public void addLikeToPost(@PathVariable String id, @PathVariable String postId) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(scenarioService.addLikeToPost(id, postId, auth)){
			logService.logAddLikeToPost(id, ((CustomUserDetails)auth.getPrincipal()).getId(), postId);
		}else{
			logService.logRemoveLikeToPost(id, ((CustomUserDetails)auth.getPrincipal()).getId(), postId);
		}
		scenarioService.lastUpdateScenario(id, new Date());
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/mission", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Scenario insertMissionToScen(@PathVariable String id, @RequestBody MissionDTO mission, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException{
		//TODO - Validate MissionDTO
		Scenario s = scenarioService.addMissionToScenario(id, mission, activeUser);
		logService.logUpdateScenarioMission(id, activeUser.getId());
		scenarioService.lastUpdateScenario(id, new Date());
		return s;
		
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/mission", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public Character insertMissionToChar(@PathVariable String id, @PathVariable String characterId, @RequestBody MissionDTO mission, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException{
		//TODO - Validate MissionDTO
		
		Character c = scenarioService.addMissionToCharacter(characterId, mission, activeUser);
		logService.logUpdateCharacterMission(id, activeUser.getId(), characterId);
		scenarioService.lastUpdateScenario(id, new Date());
		return c;
		
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/characters/{characterId}/mission", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void deleteMissionToChar(@PathVariable String id, @PathVariable String characterId, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException{
		//TODO - Validate MissionDTO
		
		if (!scenarioService.deleteMissionToCharacter(characterId))
				throw new BadRequestException();
		
		logService.logRemoveCharacterMission(id, activeUser.getId(), characterId);
		scenarioService.lastUpdateScenario(id, new Date());
		
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/scenarios/{id}/mission", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void deleteMissionToScenario(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, NotFoundException, BadRequestException{
		//TODO - Validate MissionDTO
		
		if (!scenarioService.deleteMissionToScenario(id))
				throw new BadRequestException();
		logService.logRemoveScenarioMission(id, activeUser.getId());
		scenarioService.lastUpdateScenario(id, new Date());

	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="v1/missions", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public List<MissionDTO> getMyMissions(@AuthenticationPrincipal CustomUserDetails activeUser){
		return scenarioService.getUserMissions(activeUser);
	}
	
//	//Restituisce la lista di compiti dello scenario
//	@ResponseStatus(value = HttpStatus.OK)
//	@RequestMapping(value="/v1/scenarios/{id}/missions", method=RequestMethod.GET)
//	@PreAuthorize("hasRole('ROLE_TEACHER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
//	public List<Mission> getMissions(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails activeUser, @RequestParam(value = "onlyActive", required=false) Boolean onlyActive) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
//		
//		if(onlyActive==null){
//			onlyActive=false;  //di default vedo tutte le missioni nello scenario in questione
//		}
//		
//		return scenarioService.getMissionsOfTeacher(id, onlyActive);
//	}
//	
//	//Restituisce la lista di compiti dello scenario
//	@ResponseStatus(value = HttpStatus.OK)
//	@RequestMapping(value="/v1/scenarios/{id}/myMissions", method=RequestMethod.GET)
//	@PreAuthorize("hasRole('ROLE_USER')")
//	public List<Mission> getMyMissions(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails activeUser, @RequestParam(value = "onlyActive", required=false) Boolean onlyActive) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
//			
//		if(onlyActive==null){
//			onlyActive=false;  //di default vedo tutte le missioni nello scenario in questione
//		}
//		
//		return scenarioService.getMyMissions(id, activeUser.getId(), onlyActive);
//
//	}
	
//	    //Restituisce la lista paginata di Mission del richiedente (nel caso di Teacher le Mission assegnate, nel caso di Student le Mission ricevute)
//		@ResponseStatus(value = HttpStatus.OK)
//		@RequestMapping(value="/v1/missions", method=RequestMethod.GET)
//		@PreAuthorize("hasRole('ROLE_USER')")
//		public Page<Mission> getPagedMyMissions(@AuthenticationPrincipal CustomUserDetails activeUser, @RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem, @RequestParam(value = "orderByDeliveryDate", required=false) Boolean orderByDeliveryDate, @RequestParam(value = "onlyActive", required=false) Boolean onlyActive) throws MongoException, NotFoundException, ForbiddenException, BadRequestException{
//			
//			if(nPag==null || nPag<0)
//				nPag=0;
//			if(nItem==null || nItem<=0)
//				nItem=5;
//			if(orderByDeliveryDate==null){
//				orderByDeliveryDate=true;  //di default le mie missioni sono ordinate in base alla data di consegna, l'alternativa � la data di creazione
//			}
//			if(onlyActive==null){
//				onlyActive=false;  //di default vedo tutte le mie missioni
//			}
//			
//					
//			List<GrantedAuthority> l = (List<GrantedAuthority>) activeUser.getAuthorities();
//			
//			for(int i=0; i<l.size(); i++){
//				if(l.get(i).getAuthority().equals("ROLE_ADMIN")){
//					System.out.println("ADMIN-> "+l.get(i).getAuthority());
//					throw new BadRequestException("Admin can't do this operation!");
//				}
//			}
//			
//			for(int i=0; i<l.size(); i++){
//				if(l.get(i).getAuthority().equals("ROLE_TEACHER")){
//					return scenarioService.getMissionsOfTeacher(null, activeUser.getId(), nPag, nItem, orderByDeliveryDate, onlyActive);
//				}
//			}
//			
//			System.out.println("id student: "+ activeUser.getId());
//			//TODO correggere gestione visualizzazione delle proprie missioni			
//			return scenarioService.getMissionsOfStudent(null, activeUser.getId(), nPag, nItem, orderByDeliveryDate, onlyActive);
//			
//			
//		}
		
		@ResponseStatus(value = HttpStatus.OK)
		@RequestMapping(value="/v1/scenarios/{id}/socialGraph", method=RequestMethod.GET)
		@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ') and (hasPermission(#id, 'Scenario', 'MODERATOR') || hasPermission(#id, 'GraphRelations', 'READ'))")
		public List<Action> getSocialGraph(@PathVariable String id) throws NotFoundException{
			return scenarioService.getSocialGraph(id);
		}
		
		
}
