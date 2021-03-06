package it.polito.applied.smiled.controllerRest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.MongoDataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
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

import it.polito.applied.smiled.dto.ChangePasswordDTO;
import it.polito.applied.smiled.dto.EmailDTO;
import it.polito.applied.smiled.dto.FirstPasswordDTO;
import it.polito.applied.smiled.dto.RegisterTeacherDTO;
import it.polito.applied.smiled.dto.UpdateUserDTO;
import it.polito.applied.smiled.dto.UserDTO;
import it.polito.applied.smiled.exception.BadCredentialsException;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.InvalidRegistrationTokenException;
import it.polito.applied.smiled.exception.RegistrationTokenExpiredException;
import it.polito.applied.smiled.exception.UserAlreadyExistsException;
import it.polito.applied.smiled.exception.UserNotFoundException;
import it.polito.applied.smiled.pojo.EmailAddress;
import it.polito.applied.smiled.pojo.ExceptionOnClient;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.InfoStatistics;
import it.polito.applied.smiled.pojo.Issue;
import it.polito.applied.smiled.pojo.Log;
import it.polito.applied.smiled.pojo.LogType;
import it.polito.applied.smiled.pojo.Message;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.RegistrationToken;
import it.polito.applied.smiled.pojo.Suggestion;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.rabbit.Notification;
import it.polito.applied.smiled.rabbit.NotifyService;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.LogService;
import it.polito.applied.smiled.service.UserService;
import it.polito.applied.smiled.validator.UserDTOValidator;

@RestController
public class UserController extends BaseController{
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private UserDTOValidator userDTOValidator;
	
	@Autowired
	private LogService logService;
	
	@Autowired
	private NotifyService notify;
	
	private int maxItem = 20;
	
	@RequestMapping(value="/v1/register", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void registerUser(@RequestBody @Valid RegisterTeacherDTO registerTeacherDTO, BindingResult result)throws UserNotFoundException, MongoException, MongoDataIntegrityViolationException, UserAlreadyExistsException, BadRequestException{
		if(result.hasErrors()){
			throw new BadRequestException();
		}
		if(!registerTeacherDTO.isAgree())
			throw new BadRequestException();
		User u = userService.registerTeacher(registerTeacherDTO);
		logService.logRegisterTeacher(u.getId());
	}
	
	@RequestMapping(value="v1/confirmRegisterTeacher", method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.OK)
	public void registerTeacherConfirm(@RequestParam(value="token", required=true) String token, @RequestParam(value="email", required=true) String email)throws UserNotFoundException, MongoException, MongoDataIntegrityViolationException, BadRequestException, InvalidRegistrationTokenException, RegistrationTokenExpiredException{
		System.out.println("Conferma richiesta di registrazione di: "+ email);
		userService.confirmRegistration(token,email);
	}

	@RequestMapping(value="v1/deleteRegisterTeacher", method=RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void deleteRegisterTeacher(@RequestParam(value="token", required=true) String token, @RequestParam(value="email", required=true) String email)throws UserNotFoundException, MongoException, MongoDataIntegrityViolationException, BadRequestException, InvalidRegistrationTokenException, RegistrationTokenExpiredException{
		System.out.println("Eliminazione richiesta di registrazione di: "+ email);
		userService.deleteRegistration(token,email);
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="/v1/me", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public UserDTO getMyProfile(@AuthenticationPrincipal CustomUserDetails activeUser)throws UserNotFoundException, MongoException{
		return userService.getOneself(activeUser.getUsername());
	}

	//Ritorna lo UserDTO corrispondente allo user dopo la modifica del profilo
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="/v1/me", method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.OK)
	public UserDTO updateMyProfile(@RequestBody UpdateUserDTO updateUserDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser)throws UserNotFoundException, BadRequestException, MongoException{
		
		//TODO da fare il validatore custom
		userDTOValidator.validate(updateUserDTO, result);
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
		System.out.println("controller quote: "+ updateUserDTO.getQuote());
		
		UserDTO u = userService.updateUserProfile(activeUser.getUsername(), updateUserDTO);
		logService.logUpdateUserProfile(u.getId());
		return u;
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="/v1/password", method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.OK)
	public void changePassword(@RequestBody @Valid ChangePasswordDTO changePassword, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser) throws BadCredentialsException, MongoException, UserNotFoundException, BadRequestException{
		
		if(result.hasErrors()){
			throw new BadCredentialsException(result.getAllErrors().get(0).getDefaultMessage());
		}
	    String userEmail = activeUser.getUsername();
	    //La validazione logica della oldPassword viene fatta direttamente nella changePassword (piu' efficiente)
	    User u = userService.changePassword(userEmail, changePassword.getOldPassword(), changePassword.getNewPassword());
	    logService.logChangePassword(u.getId());
	}
	
	//URL utilizzato da non loggati per modificare password scadute (es. al primo accesso)
	@PreAuthorize("isAnonymous()")
	@RequestMapping(value="/v1/firstPassword", method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.OK)
	public void firstPassword(@RequestBody @Valid FirstPasswordDTO firstPassword, BindingResult result) throws BadCredentialsException, MongoException, UserNotFoundException, BadRequestException{
		
		if(result.hasErrors()){
			throw new BadCredentialsException(result.getAllErrors().get(0).getDefaultMessage());
		}
		firstPassword.setEmail(firstPassword.getEmail().toLowerCase());
		
	    User u = userService.changeFirstPassword(firstPassword);
	    logService.logConfirmRegisterStudent(u.getId());
	    
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="/v1/messages", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public List<Message> getMyMessages(@AuthenticationPrincipal CustomUserDetails activeUser,
			@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<0)
			nItem=maxItem;
		String userEmail = activeUser.getUsername();
		//TODO service da fare
		return userService.getUserMessages(userEmail, nPag, nItem);
	}
	
	//Ritorna la lista paginata di messaggi scambiati con un dato user
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="/v1/messages/{userId}", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public List<Message> getMyMessagesWithYou(@PathVariable String userId, @AuthenticationPrincipal CustomUserDetails activeUser, 
			@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<0)
			nItem=maxItem;
		String userEmail = activeUser.getUsername();
		
		//Non controllo che userId sia nella mia lista di relazioni perch� potrei averlo avuto in passato e vorrei quindi poter accedere ai messaggi tra me e quell'utente
		return userService.getUserMessagesWithYou(userEmail, userId, nPag, nItem);
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="/v1/messages", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.OK)
	public Id sendMessage(@RequestBody @Valid Message message, BindingResult result, 
			@AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException{
		
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
		
		
		//A prescindere da quello che mi viene mandato in message setto la data alla data corrente e il sender all'utente autenticato
		message.setDate(new Date());
		message.setIdFrom(activeUser.getId());
		
		//verifico se ho relazioni verso l'utente a cui sto cercando di inviare il msg
		if(!activeUser.getRelationsId().contains(message.getIdTo()))
			throw new BadRequestException();

		return userService.sendMessage(message);
	}

	
	@PreAuthorize("(principal.getId().equals(#userId)) or (hasRole('ROLE_USER'))")
	@RequestMapping(value="/v1/users/{userId}", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public UserDTO getOneUser(@PathVariable String userId, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, UserNotFoundException{
		//TODO gestire permessi amici
		UserDTO userDTO;
		boolean isAdmin = false;
		if(!activeUser.getId().equals(userId)){
			if(!activeUser.getRelationsId().contains(userId)){
				ArrayList<GrantedAuthority> authorities = (ArrayList<GrantedAuthority>) activeUser.getAuthorities();
				for(int i=0; i<authorities.size(); i++){
					if(authorities.get(i).getAuthority().equals("ROLE_ADMIN")){
						isAdmin=true;
						break;
					}
						
				}
				if(isAdmin==false){
					Reference ref = new Reference();
					ref.setId(userId);
					boolean isRecentRelation = false;
					UserDTO meDTO = userService.getUserById(activeUser.getId());
					if(meDTO.getColleagues()!=null && meDTO.getColleagues().contains(ref))
						isRecentRelation = true;
					if(isRecentRelation==false && meDTO.getStudents()!=null && meDTO.getStudents().contains(ref))
						isRecentRelation = true;
					if(!isRecentRelation)
						throw new UserNotFoundException();
				}
					
			}
			System.out.println("USER ID: "+ userId);
			userDTO = userService.getUserById(userId);
			System.out.println("USER: "+ userDTO);
			
			//userDTO.setRole(null);
		}else{
			userDTO = userService.getUserById(userId);
		}

		return userDTO;

	}
	
	/*TODO valutare sicurezza su questo metodo e necessità del metodo stesso
	 * Potrebbe essere utile per una validazione realtime al momento della registrazione*/
	//@RequestMapping(value="/v1/users/email",method=RequestMethod.GET)
	//@ResponseStatus(value = HttpStatus.OK)
	//public void emailIsRegistered(@RequestParam(value = "email", required=true) String email) throws  MongoException, UserNotFoundException{
	//	UserDTO u = userService.getOneself(email);
	//}
	
	@RequestMapping(value="/v1/colleagues", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void inviteColleague(@RequestBody @Valid EmailDTO emailDTO, BindingResult result,  @AuthenticationPrincipal CustomUserDetails activeUser)throws UserNotFoundException, MongoException, MongoDataIntegrityViolationException, UserAlreadyExistsException, BadRequestException{
		if(result.hasErrors()){
			throw new BadRequestException();
		}
		emailDTO.setEmail(emailDTO.getEmail().toLowerCase());
		
		userService.inviteTeacherIfNotPresent(emailDTO.getEmail(), activeUser.getId());
	}
	
	//Ritorna il teacher solo se non � in stato PENDING
	//Lunghezza minima accettabile della regex= 2 caratteri
	@PreAuthorize("hasRole('ROLE_TEACHER')")
	@RequestMapping(value="/v1/searchTeachers", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<Reference> getAllTeachersByRegex(@RequestParam (value = "regex", required=true) String regex, @RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<=0)
			nItem=maxItem;
		if(regex == null || regex.isEmpty() || regex.length()<2)  
			throw new BadRequestException();
		Page<Reference> teachersPage = userService.getAllTeachersByRegex(regex, nPag, nItem);
		System.out.println("TEACHERS PAGE -----------> "+teachersPage);
		//System.out.println("first teacher name -----------> "+teachersPage.getContent().get(0).getFirstName());
		return teachersPage;
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="v1/report", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void sendReport(@RequestBody Issue issue, @AuthenticationPrincipal CustomUserDetails activeUser){
		issue.setDate(new Date());
		userService.sendReport(activeUser, issue);
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="v1/suggestion", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void sendSuggestion(@RequestBody Suggestion suggestion, @AuthenticationPrincipal CustomUserDetails activeUser){
		suggestion.setDate(new Date());
		userService.sendSuggestion(activeUser, suggestion);
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="v1/draft", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public List<Post> getDraft(@RequestParam (value = "preview", required=false) Boolean preview,@AuthenticationPrincipal CustomUserDetails activeUser){
		if(preview==null)
			preview=false;
		return userService.getDraft(activeUser, preview);
	}
	
	@PreAuthorize("isAnonymous()")
	@RequestMapping(value="v1/forgotPasswordRequest", method=RequestMethod.POST)
	@ResponseStatus(value= HttpStatus.OK)
	public void forgotPasswordRequest(@RequestBody @Valid EmailAddress email) throws BadRequestException{
				
		userService.generateNewPasswordRequest(email);
	}
	
	
	/*-------------------------------------------SESSION START-STOP API -----------------------------------*/
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="v1/sessionStart", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public void sessionStart(){
		WebAuthenticationDetails details = (WebAuthenticationDetails)SecurityContextHolder.getContext().getAuthentication().getDetails();
		String ip = details.getRemoteAddress();
		String sessionId = details.getSessionId();
		
	}
	
	/*-------------------------------------------SESSION START-STOP API -----------------------------------*/

	
	/*----------------------------------------------ADMIN API START--------------------------------------- */
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/userScenarios", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public List<UserDTO> getUsersByFirstNameAndLastName(@RequestParam(value = "firstName", required=false) String firstName, @RequestParam(value = "lastName", required=false) String lastName
			) throws MongoException, BadRequestException{
		
		List<UserDTO> l= null;
		if(firstName != null && firstName.equals(""))
			firstName = null;
		if(lastName != null && lastName.equals(""))
			lastName = null;
		
		if(firstName == null && lastName == null)
			throw new BadRequestException();
		
		else if(firstName != null && lastName != null){
			l = userService.getUsersByFirstNameAndLastName(firstName, lastName);
		}else if (firstName != null && lastName == null){
			l = userService.getUsersByFirstName(firstName);
		}else if(firstName == null && lastName != null){
			l = userService.getUsersByLastName(lastName);
		}
		
		return l;
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/issues", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<Issue> getAllIssues(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<=0)
			nItem=maxItem;
		return userService.getAllIssues(nPag, nItem); 
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/suggestions", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<Suggestion> getAllSuggestions(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<=0)
			nItem=maxItem;
		return userService.getAllSuggestions(nPag, nItem); 
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/userByEmail", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public UserDTO getUserByEmail(@RequestParam(value = "email", required=true) String email) throws MongoException, BadRequestException, UserNotFoundException{
		
		return userService.getUserByEmail(email);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/users", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<UserDTO> getAllUsers(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<=0)
			nItem=maxItem;
		return userService.getAllUsers(nPag, nItem, 3); //il terzo parametro indica che voglio tutti gli user (sia teacher che student che moderator)
	}
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/teachers", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<UserDTO> getAllTeachers(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<=0)
			nItem=maxItem;
		return userService.getAllUsers(nPag, nItem, 1); //il terzo parametro indica che cerco dei teacher
	}
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/students", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<UserDTO> getAllStudents(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<=0)
			nItem=maxItem;
		return userService.getAllUsers(nPag, nItem, 2); //il terzo parametro indica che cerco degli student
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/scenarios", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<Scenario> getAllScenarios(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem, @RequestParam(value = "orderByCreation", required=true) boolean orderByCreation) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>maxItem || nItem<=0)
			nItem=maxItem;
		return userService.getAllScenarios(nPag, nItem, orderByCreation); 
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/clientException", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<ExceptionOnClient> getAllClientExceptions(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>(maxItem) || nItem<=0)
			nItem=(maxItem);
		return userService.getAllClientExceptions(nPag, nItem);
	}
	
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/log", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<Log> getAllLogs(@RequestParam(value = "start", required=false) Long start, @RequestParam(value = "end", required=false) Long end, 
			@RequestParam(value = "type", required=false) LogType type,  @RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem,
			@RequestParam(value = "idUser", required=false) String idUser,
			@RequestParam(value = "idScenario", required=false) String idScenario) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>(maxItem) || nItem<=0)
			nItem=(maxItem);
		Date s=null, e=null;
		if(start!=null){
			s = new Date(start);
		}
		if(end!=null){
			e = new Date(end);
		}
		
		
		if(idUser==null && idScenario==null){
			return logService.getAllLogs(s, e, type, nPag, nItem);
		}
		else if(idUser!=null && idScenario==null){
			return logService.getAllLogsOfUser(s, e, idUser, type, nPag, nItem);
		}else if(idUser==null && idScenario!=null){
			return logService.getAllLogsOfScenario(s, e, idScenario, type, nPag, nItem);
		}else{
			return logService.getAllLogsOfUserInScenario(s, e, idUser, idScenario, type, nPag, nItem);
		}
		
	}
	
	/*
	 *  InfoStatistics è un oggetto che fornisce un riepilogo dei log prodotti
	 *  ed ha i seguenti campi:
	 *  private long numPost;
		private long numComment;
		private long numMetaComment;
		private long numFile;
		private long numLike;
	 */
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/infoStatisticsUser/{id}", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public InfoStatistics getInfoStatisticsUser(@PathVariable String id) throws MongoException, BadRequestException{
		if(id==null)
			throw new BadRequestException();
		return logService.getInfoStatisticsUser(id);
		
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/infoStatisticsScenario/{id}", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public InfoStatistics getInfoStatisticsScenario(@PathVariable String id) throws MongoException, BadRequestException{
		if(id==null)
			throw new BadRequestException();
		return logService.getInfoStatisticsScenario(id);
		
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/infoStatisticsScenario/{scenarioId}/user/{userId}", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public InfoStatistics getInfoStatisticsUserInScenario(@PathVariable String scenarioId, @PathVariable String userId) throws MongoException, BadRequestException{
		if(scenarioId==null || userId == null)
			throw new BadRequestException();
		return logService.getInfoStatisticsUserInScenario(userId, scenarioId);
		
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/getPagedRegistrationRequests", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<RegistrationToken> getPagedRegistrationRequests(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>(maxItem) || nItem<=0)
			nItem=(maxItem);
		return logService.getPagedRegistrationRequests(nPag, nItem);
	}
	
	/*----------------------------------------------ADMIN API END--------------------------------------- */
	
	/*----------------------------------------------EXCEPTION ON CLIENT API START--------------------------------------- */
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="v1/clientException", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void sendClientException(@RequestBody ExceptionOnClient exception, @AuthenticationPrincipal CustomUserDetails activeUser){
		System.out.println("Exception from user "+ activeUser.getUsername());
		userService.addClientException(exception, activeUser.getId());
	}
	
	/*----------------------------------------------EXCEPTION ON CLIENT API END--------------------------------------- */
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/lastNotifications", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER')")
	public List<Notification> getLastNotification(@RequestParam(value = "num", required=true) Integer num, 
			@RequestParam(value = "old", required=false) String old, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException{
		
		if(num==null || num<0)
			throw new BadRequestException();
		if(num>10)
			num=10;
		return notify.getLastUserSendedNotification(user, num, old);
	}

	
}
