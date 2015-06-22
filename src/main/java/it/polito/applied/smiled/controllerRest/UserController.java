package it.polito.applied.smiled.controllerRest;

import it.polito.applied.smiled.dto.ChangePasswordDTO;
import it.polito.applied.smiled.dto.FirstPasswordDTO;
import it.polito.applied.smiled.dto.RegisterTeacherDTO;
import it.polito.applied.smiled.dto.UserDTO;
import it.polito.applied.smiled.exception.BadCredentialsException;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.exception.UserAlreadyExistsException;
import it.polito.applied.smiled.exception.UserNotFoundException;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.Message;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.UserService;
import it.polito.applied.smiled.validator.UserDTOValidator;

import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.MongoDataIntegrityViolationException;
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

@RestController
public class UserController extends BaseController{
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private UserDTOValidator userDTOValidator;
	
	@RequestMapping(value="/v1/register", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void registerUser(@RequestBody @Valid RegisterTeacherDTO registerTeacherDTO, BindingResult result)throws UserNotFoundException, MongoException, MongoDataIntegrityViolationException, UserAlreadyExistsException, BadRequestException{
		if(result.hasErrors()){
			throw new BadRequestException();
		}
		userService.registerTeacher(registerTeacherDTO);
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
	public UserDTO updateMyProfile(@RequestBody UserDTO updateUserDTO, BindingResult result, @AuthenticationPrincipal CustomUserDetails activeUser)throws UserNotFoundException, BadRequestException, MongoException{
		
		//TODO da fare il validatore custom
		userDTOValidator.validate(updateUserDTO, result);
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
		
		return userService.updateUserProfile(activeUser.getUsername(), updateUserDTO);
		
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
	    userService.changePassword(userEmail, changePassword.getOldPassword(), changePassword.getNewPassword());
	}
	
	//URL utilizzato da non loggati per modificare password scadute (es. al primo accesso)
	@PreAuthorize("isAnonymous()")
	@RequestMapping(value="/v1/firstPassword", method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.OK)
	public void firstPassword(@RequestBody @Valid FirstPasswordDTO firstPassword, BindingResult result) throws BadCredentialsException, MongoException, UserNotFoundException, BadRequestException{
		
		System.out.println("firstPassword");
		
		if(result.hasErrors()){
			throw new BadCredentialsException(result.getAllErrors().get(0).getDefaultMessage());
		}
		
	    userService.changeFirstPassword(firstPassword);
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="/v1/messages", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public List<Message> getMyMessages(@AuthenticationPrincipal CustomUserDetails activeUser,
			@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=1;
		if(nItem==null || nItem>10 || nItem<0)
			nItem=10;
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
			nPag=1;
		if(nItem==null || nItem>10 || nItem<0)
			nItem=10;
		String userEmail = activeUser.getUsername();
		
		//Non controllo che userId sia nella mia lista di relazioni perch� potrei averlo avuto in passato e vorrei quindi poter accedere ai messaggi tra me e quell'utente
		return userService.getUserMessagesWithYou(userEmail, userId, nPag, nItem);
	}
	
	@PreAuthorize("hasRole('ROLE_USER')")
	@RequestMapping(value="/v1/messages", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.OK)
	public Id sendMessage(@RequestBody @Valid Message message, BindingResult result, 
			@AuthenticationPrincipal CustomUserDetails activeUser, 
			@RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		
		if(result.hasErrors()){
			throw new BadRequestException(result.getAllErrors().get(0).getDefaultMessage());
		}
		
		if(nPag==null)
			nPag=1;
		if(nItem==null || nItem>10 || nItem<0)
			nItem=10;
		
		//A prescindere da quello che mi viene mandato in message setto la data alla data corrente e il sender all'utente autenticato
		message.setDate(new Date());
		message.setIdFrom(activeUser.getId());
		
		//verifico se ho relazioni verso l'utente a cui sto cercando di inviare il msg
		if(!activeUser.getRelationsId().contains(message.getIdTo()))
			throw new BadRequestException();

		return userService.sendMessage(message);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping(value="/v1/users", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public Page<UserDTO> getAllUsers(@RequestParam(value = "nPag", required=false) Integer nPag, 
			@RequestParam(value = "nItem", required=false) Integer nItem) throws MongoException, BadRequestException{
		if(nPag==null)
			nPag=0;
		if(nItem==null || nItem>10 || nItem<=0)
			nItem=10;
		return userService.getAllUsers(nPag, nItem);
	}
	
	@PreAuthorize("(principal.getId().equals(#userId)) or (hasRole('ROLE_USER') and hasPermission(#userId, 'User', 'READ'))")
	@RequestMapping(value="/v1/users/{userId}", method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public UserDTO getOneUser(@PathVariable String userId, @AuthenticationPrincipal CustomUserDetails activeUser) throws MongoException, BadRequestException, UserNotFoundException{
		//TODO gestire permessi amici
		UserDTO userDTO;
		if(!activeUser.getId().equals(userId)){
			if(!activeUser.getRelationsId().contains(userId))
				throw new UserNotFoundException();
			userDTO = userService.getUserById(userId);
			
			userDTO.setRole(null);
		}else{
			userDTO = userService.getUserById(userId);
		}

		return userDTO;

	}
	
	/*TODO valutare sicurezza su questo metodo e necessità del metodo stesso
	 * Potrebbe essere utile per una validazione realtime al momento della registrazione*/
	@RequestMapping(value="/v1/users/email",method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public void emailIsRegistered(@RequestParam(value = "email", required=true) String email) throws  MongoException, UserNotFoundException{
		UserDTO u = userService.getOneself(email);
	}
}
