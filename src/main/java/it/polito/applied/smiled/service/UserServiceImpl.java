package it.polito.applied.smiled.service;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoDataIntegrityViolationException;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.mongodb.MongoException;

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
import it.polito.applied.smiled.pojo.ExceptionOnClient;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.Issue;
import it.polito.applied.smiled.pojo.Message;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.RegistrationToken;
import it.polito.applied.smiled.pojo.Role;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.Suggestion;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.Student;
import it.polito.applied.smiled.pojo.user.Teacher;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.pojo.user.UserProfile;
import it.polito.applied.smiled.pojo.user.UserStatus;
import it.polito.applied.smiled.repository.ExceptionOnClientRepository;
import it.polito.applied.smiled.repository.IssueRepository;
import it.polito.applied.smiled.repository.PostRepository;
import it.polito.applied.smiled.repository.RegistrationRepository;
import it.polito.applied.smiled.repository.ScenarioRepository;
import it.polito.applied.smiled.repository.SuggestionRepository;
import it.polito.applied.smiled.repository.UserRepository;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.security.SmiledPermissionEvaluator;
import it.polito.applied.smiled.updater.AsyncUpdater;

@Service
public class UserServiceImpl implements UserDetailsService, UserService{

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private IssueRepository issueRepository;
	
	@Autowired
	private SuggestionRepository suggestionRepository;
	
	@Autowired
	private ScenarioRepository scenarioRepository;

	@Autowired
	private RegistrationRepository registrationRepository;

	@Autowired
	private ScenarioService scenarioService;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private AsyncUpdater asyncUpdater;
	
	@Autowired
	private SmiledPermissionEvaluator permissionEvaluator;
	
	@Autowired
	private ExceptionOnClientRepository exceptionOnClientRepository;
	
	@Autowired
	private PostRepository postRepository;
	
	
	
	private final int PREVIEW=4;
	
	
//	@Autowired
//	private NotifyService notify;
	
	@Override
	public CustomUserDetails loadUserByUsername(String email)
			throws UsernameNotFoundException, MongoException {
		
		
		
		User user;		
		try{
			String emailToLowerCase = email.toLowerCase();
			user = userRepository.findByEmail(emailToLowerCase);

			if (user == null){
				throw new UsernameNotFoundException("Username "+email+ " not found.");
			}
		}catch(MongoException e){
			throw e;
		}
		CustomUserDetails actualUser = new CustomUserDetails(user);
//		actualUser.setUser(user);
				
		System.out.println(actualUser.getUsername()+" loggedIn!");
		return actualUser;
	}

	@Override
	public UserDTO getOneself(String userEmail) throws UserNotFoundException, MongoException {

		try{
			User u = userRepository.findByEmail(userEmail);
			if(u==null)
				throw new UserNotFoundException();

			UserDTO user = new UserDTO(u);
			return user;

		}catch(MongoException e){
			throw e;
		}
	}

	@Override
	public UserDTO updateUserProfile(String userEmail, UpdateUserDTO userDTO) throws MongoException, BadRequestException{
		try{
			//Booleano che mi serve per capire se devo lanciare il thread asincrono che si occupa dell'aggiornamento dei Reference
			//Diventa true se cambio nome o cognome 
			//TODO da controllare quando gestiamo il cambio cover
			boolean updateRef=false;
			Update update = new Update();

			System.out.println("quote "+userDTO.getQuote());
			System.out.println("quote "+userDTO.getBornCity());
			
			
			if(userDTO.getGender()!=null){
				update.set("profile.gender", userDTO.getGender());
			}
					
			if(userDTO.getBornDate()!=null)
					update.set("profile.bornDate", userDTO.getBornDate());
			if(userDTO.getBornCity()!=null)
				update.set("profile.bornCity", userDTO.getBornCity());
			if(userDTO.getSchoolCity()!=null)
				update.set("profile.schoolCity", userDTO.getSchoolCity());
			if(userDTO.getSchool()!=null)
				update.set("profile.school", userDTO.getSchool());
			if(userDTO.getQuote()!=null)
				update.set("profile.quote", userDTO.getQuote());
			
			User user = userRepository.updateUser(update,userEmail);
			if(user==null)
				throw new BadRequestException();
			
			
			//ATTENZIONE QUANDO PERMETTEREMO DI AGGIORNARE CAMPI PRESENTI NEI REFERENCE DOVREMO SETTARE QUESTA VARIABILE A TRUE
			if(updateRef)
				asyncUpdater.updateUser(user);
			
			UserDTO u = new UserDTO(user);
			return u;

		}catch(MongoException e){
			throw e;
		}
	}

	@Override
	public User changePassword(String userEmail, String oldPassword, String newPassword) throws MongoException, BadCredentialsException, UserNotFoundException, BadRequestException {
		User u = null;
		try{
			u = checkOldPassword(userEmail,oldPassword,false);
			if(u==null)
				throw new BadCredentialsException();

			String hashNewPassword=passwordEncoder.encode(newPassword);
			int n = userRepository.changePassword(userEmail, hashNewPassword);
			if(n==0){
				throw new BadRequestException();
			}

		}catch(MongoException e){
			throw e;
		}
		
		return u;
	}

	@Override
	public User changeFirstPassword(FirstPasswordDTO firstPassword) throws UserNotFoundException, BadCredentialsException, BadRequestException {
		User user = null;
		try{
			user = checkOldPassword(firstPassword.getEmail(), firstPassword.getOldPassword(),true);
			if(user==null)
				throw new BadCredentialsException();

			String hashNewPassword=passwordEncoder.encode(firstPassword.getNewPassword());
			Student u = (Student) userRepository.changeFirstPassword(firstPassword, hashNewPassword);
			
			if(u==null)
				throw new BadRequestException();
			
			Reference userRef = new Reference(u);
			
			/*AGGIORNAMENTI*/
			/*1. inserire Reference a Teacher (asincrono)
			 *2. spostare Reference negli Scenari dello User da Invited ad Attendees (per gli open li faccio in modo sincrono insieme 
			 *   all'aggiunta dei permessi, per gli altri in modo asincrono)
			 *3. per ogni Scenario aperto lanciare creazione relazioni (asincrono)*/

			
			/*Aggiornamenti sincroni*/
			if(u.getOpenScenarios()!=null){
				for(ScenarioReference scenarioRef : u.getOpenScenarios()){
					/*Il metodo dello scenarioService gestice anche i permessi per lo scenario*/
					scenarioService.moveFromInvitedToAttendees(userRef, scenarioRef.getId());
					System.out.println("changeFirst-update sincrono: "+System.currentTimeMillis());
				}
			}
			
			/*Aggiornamenti asincroni*/
			asyncUpdater.updateOnChangeFirstPassword(u);
			
//			notify.createQueue(u.getId());
//			
		}catch(MongoException e){
			throw e;
		}	
		
		return user;
	}

	@Override
	public User registerTeacher(RegisterTeacherDTO teacher) throws UserAlreadyExistsException , MongoException, BadRequestException, MongoDataIntegrityViolationException {
		/*Tutti i metodi che accedono ai repository sono all'interno di blocchi try/catch, 
		 * così da catchare eventuali eccezioni sul DB (MongoException)*/
		User inserted = null;
		try{
			/*SALVA UTENTE NEL REPOSITORY USER*/		
			User u = new Teacher();
			String emailToLowerCase = teacher.getEmail().toLowerCase();
			u.setEmail(emailToLowerCase);
			String hashPassword=passwordEncoder.encode(teacher.getPassword());
			u.setPassword(hashPassword);
			u.setFirstName(teacher.getFirstName());
			u.setLastName(teacher.getLastName());
			u.setStatus(UserStatus.STATUS_PENDING);
			u.setRegistrationDate(new Date());
			u.setAgree(teacher.isAgree());

			List<Role> roles = new ArrayList<Role>();
			roles.add(new Role("ROLE_TEACHER"));
			roles.add(new Role("ROLE_USER"));
			u.setRoles(roles);
			System.out.println("borndate di teacherdto: "+teacher.getBornDate());
			UserProfile profile = new UserProfile();
			profile.setBornDate(teacher.getBornDate());
			profile.setBornCity(teacher.getBornCity());
			profile.setSchool(teacher.getNameOfSchool());
			profile.setSchoolCity(teacher.getSchoolCity());
			u.setProfile(profile);

			try{
				inserted = userRepository.insert(u);
				System.out.println("borndate di teacherdto: "+inserted.getProfile().getBornDate());
			}catch(MongoDataIntegrityViolationException e){
				//TODO
				/*Inserire report eccezione (in tutte le eccezioni di questa classe)*/
				throw new UserAlreadyExistsException(u.getEmail());
			}

			/**/

			/*GENERA E SALVA TOKEN CASUALE, INVIA MAIL*/
			try{
				RegistrationToken registration = new RegistrationToken(teacher.getEmail());
				registrationRepository.save(registration);
				asyncUpdater.sendTeacherRegistrationEmail(teacher.getFirstName()+" "+teacher.getLastName(), teacher.getEmail(),registration.getToken().toString());
			}catch(MongoDataIntegrityViolationException e){
				/*Eccezione che in teoria non dovrebbe mai verificarsi, in quanto abbiamo già controllato che non esista uno user con quella email
				 * al passo precedente*/
				throw e;
			}
		}catch(MongoException e){
			throw e;
		}
		
		return inserted;
	}

	@Override
	public void confirmRegistration(String token, String email) throws MongoException, InvalidRegistrationTokenException, UserNotFoundException, RegistrationTokenExpiredException {
		
		RegistrationToken r = checkValidityTokenAndEmail(token,email);
		
		String username = userRepository.updateToApproveUserStatus(email);
		if(username==null)
			throw new UserNotFoundException(email);
		registrationRepository.delete(r);
		asyncUpdater.sendTeacherRegistrationConfirmEmail(username, email);
		User u = userRepository.findByEmail(email);
//		notify.createQueue(u.getId());
	}



	@Override
	public void deleteExpiredRegistrationAccount(String userEmail) {
		try{
			userRepository.deletePendingByEmail(userEmail);
			registrationRepository.findAndDeleteByEmail(userEmail);
		}catch(MongoException e){
			throw e;
		}

	}


	private RegistrationToken checkValidityTokenAndEmail(String token, String email) throws MongoException, InvalidRegistrationTokenException, RegistrationTokenExpiredException{
		try{
			String decodedEmail  = URLDecoder.decode(email, "UTF-8");
	                
			RegistrationToken r = registrationRepository.findByTokenAndEmail(token, decodedEmail);
			if(r==null)
				throw new InvalidRegistrationTokenException(token, email,userRepository);

			Date now = new Date();
			if(r.getExpiration().before(now)){
				deleteExpiredRegistrationAccount(email);
				asyncUpdater.sendTeacherExpirationEmail(email);
				throw new RegistrationTokenExpiredException(r.getExpiration(),r.getEmail());
			}
			return r;
		}catch(MongoException e){
			throw e;
		} catch (UnsupportedEncodingException e) {
			throw new InvalidRegistrationTokenException(token, email,userRepository);
		}
	}

	@Override
	public List<Message> getUserMessages(String userEmail, Integer nPag,
			Integer nItem) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Id sendMessage(Message message) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteMessage(String idMessage, String userEmail) {
		// TODO Auto-generated method stub

	}

	@Override
	public List<Message> getUserMessagesWithYou(String userEmail,
			String idOtherUser, Integer nPag, Integer nItem) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	/* typeOfUsers � un intero che dice che tipo di utenti si desidera cercare:
	 * 1: Teacher
	 * 2: Student
	 * 3: All (teacher + student + moderator)
	 * 
	 * */
	@Override
	public Page<UserDTO> getAllUsers(Integer nPag, Integer nItem, int typeOfUsers) throws BadRequestException {
		try{
			Page<User> p = userRepository.getPagingUsers(nPag, nItem, typeOfUsers);
			if(p==null)
				throw new BadRequestException();
			List<UserDTO> l = new ArrayList<UserDTO>();
			for(User u : p.getContent()){
				l.add(new UserDTO(u));
			}
			Pageable pageable = new PageRequest(nPag,nItem);
			PageImpl<UserDTO> page = new PageImpl<UserDTO>(l, pageable, p.getTotalElements());	
			return page;
		}catch(MongoException e ){
			throw e;
		}
	}
	
	@Override
	public List<UserDTO> getUsersByFirstNameAndLastName(String firstName, String lastName) {
		List<User> u = userRepository.findByFirstNameIgnoreCaseAndLastNameIgnoreCase(firstName, lastName);
		List<UserDTO> l = new ArrayList<UserDTO>();
		if(u!= null && u.size()>0){
			for(User user : u){
				l.add(new UserDTO(user));
			}
		}
		return l;
	}
	
	@Override
	public List<UserDTO> getUsersByFirstName(String firstName) {
		List<User> u = userRepository.findByFirstNameIgnoreCase(firstName);
		List<UserDTO> l = new ArrayList<UserDTO>();
		if(u!= null && u.size()>0){
			for(User user : u){
				l.add(new UserDTO(user));
			}
		}
		return l;
	}
	
	@Override
	public List<UserDTO> getUsersByLastName(String lastName) {
		List<User> u = userRepository.findByLastNameIgnoreCase(lastName);
		List<UserDTO> l = new ArrayList<UserDTO>();
		if(u!= null && u.size()>0){
			for(User user : u){
				l.add(new UserDTO(user));
			}
		}
		return l;
	}
	
	@Override
	public Page<Scenario> getAllScenarios(Integer nPag, Integer nItem, boolean orderByCreation) throws BadRequestException {
		try{
			Page<Scenario> p = scenarioRepository.getPagingScenarios (nPag, nItem, orderByCreation);
			return p;
		}catch(MongoException e ){
			throw e;
		}
	}
	
	private User checkOldPassword(String userEmail, String oldPassword, boolean first) throws UserNotFoundException{

		User u = userRepository.findByEmail(userEmail);
		if(u==null)
			throw new UserNotFoundException();

		if(first){
			if(u.getStatus()!=UserStatus.STATUS_PENDING_DEFAULT_PASSWORD)
				return null;
		}

		/*Metodo di BCrypt per comparare una password in chiaro (oldPassword), con la sua versione hashata (u.getPassword()))*/
		if(passwordEncoder.matches(oldPassword, u.getPassword()))
			return u;
		else
			return null;
	}

	@Override
	public UserDTO getUserById(String id) throws UserNotFoundException {
		User u= userRepository.findById(id);
		if(u==null)
			throw new UserNotFoundException();
		UserDTO user = new UserDTO (u);
		return user;
	}

	@Override
	public int removeScenarioFromUser(String userToDelete, String id) {
		
		return userRepository.removeScenarioFromUser(userToDelete ,id);
		
	}
	
	@Override
	public int removeScenarioFromUsers(List<String> usersToDelete, String id) {
		
		return userRepository.removeScenarioFromUsers(usersToDelete ,id);
		
	}

	@Override
	public void openScenarioOfUser(Reference user, ScenarioReference scenarioRef) {
		
		userRepository.openScenarioToUser(user.getId(), scenarioRef);
	}

	@Override
	public void insertInCreatedScenarioOfUser(Reference user,
			ScenarioReference scenarioRef) {
		userRepository.insertInCreatedScenarioOfUser(user.getId(), scenarioRef);
		
	}
	
	@Override
	public void openScenarioOfUsers(List<Reference> l, ScenarioReference scen) {
		List<String> listId = new ArrayList<String>();
		for(Reference r : l){
			listId.add(r.getId());
		}
		int n = userRepository.openScenarioToUsers(listId, scen);
		
		System.out.println("addScenarioToUsers\n\nLunghezza lista: "+l.size()+"\nAggiornati: "+n); //TODO rimuovere stampa, loggare ed eventualmente gestire errore

	}

	

	@Override
	public void openScenarioOfUsers(ScenarioReference scenario, List<String> usersId) {
		int n= userRepository.openScenarioToUsers(usersId, scenario);
		System.out.println("openScenarioOfUsers\n\nLunghezza lista users: "+usersId.size()+"\nUser aggiornati: "+n); //TODO rimuovere stampa, loggare ed eventualmente gestire errore

	}


	@Override
	public void deleteScenarioFromCreator(String creatorId, String scenarioId) {
		userRepository.deleteScenarioFromCreator(creatorId, scenarioId);
	}

	@Override
	public void closeScenarioOfUsers(String scenarioId, String callerId,
			List<String> usersId) {
		
		closeScenarioOfUser(scenarioId, callerId);
		usersId.remove(callerId);
		asyncUpdater.closeScenario(scenarioId, usersId);
		
	}
	
	@Override
	public void closeScenarioOfUser(String scenarioId, String userId){
		User user = userRepository.findById(userId);
		ScenarioReference openScenReference=null;
		if(user.getOpenScenarios()!=null){
			for(ScenarioReference ref : user.getOpenScenarios()){
				if(ref.getId().equals(scenarioId)){
					openScenReference=ref;
					user.getOpenScenarios().remove(ref);
					break;
				}
			}
		}
		if(openScenReference!=null){
			ScenarioReference closedScenReference = new ScenarioReference();
			closedScenReference.setId(openScenReference.getId());
			closedScenReference.setName(openScenReference.getName());
			closedScenReference.setCover(openScenReference.getCover());
			closedScenReference.setMyPastCharactersId(openScenReference.getMyPastCharactersId());
			if(openScenReference.getMyCharacterId()!=null)
				closedScenReference.addPastCharacter(openScenReference.getMyCharacterId());
			
			user.addClosedScenario(closedScenReference);
		}
		
		userRepository.save(user);
	}

	@Override
	public void removeScenarioAndSaveInBlockedList(String userToDelete,
			String id) {
		userRepository.removeScenarioAndSaveInBlockedList(userToDelete, id);
		
	}

	@Override
	public void removeActualCharacterToUser(String userId, String characterId,
			String scenarioId) {
		permissionEvaluator.removeOnePermission(userId, Character.class, characterId);
		userRepository.removeActualCharacterToUser(userId, characterId, scenarioId);
	}

	@Override
	public void addActualCharacterToUser(String userId, Reference characterRef,
			String scenarioId) {
		permissionEvaluator.addPermission(userId, Character.class, "WRITE", characterRef.getId());
		userRepository.addActualCharacterToUser(userId, characterRef, scenarioId);
	}

	@Override
	public void addStudentToTeacher(String teacherId, Reference studentRef) {
		userRepository.addStudentToTeacher(teacherId, studentRef);
		permissionEvaluator.addPermission(teacherId, User.class, "READ", studentRef.getId());	

	}
	
	@Override
	public void addColleagueToTeacher(String teacherId, Reference colleague) {
		userRepository.addColleagueToTeacher(teacherId, colleague);
		permissionEvaluator.addPermission(teacherId, User.class, "READ", colleague.getId());
		
	}

	@Override
	public void addTeacherToStudent(String studentId, Reference teacherRef, boolean setPermission) {
		User u = userRepository.addTeacherToStudent(studentId, teacherRef);
	
		if(u.getClass().equals(Student.class)){
			Student s = (Student) u;
			
			if(!s.getTeachers().contains(teacherRef) && setPermission)
				permissionEvaluator.addPermission(studentId, User.class, "READ", teacherRef.getId());
		}
	}

	

	@Override
	public void addFriendToStudent(String studentId, Reference friend) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void moveScenarioFromOpenToInviting(String collaboratorId, String scenarioId) {
		userRepository.moveScenarioFromOpenToInviting(collaboratorId, scenarioId);
		
	}

	@Override
	public void createScenarioOfUser(Reference user,
			ScenarioReference scenarioRef) {
		userRepository.createScenarioToUser(user.getId(), scenarioRef);
		
	}

	/*Non iscrive al sistema l'utente ma gli invia soltanto una mail di invito.
	 * Restituisce false se la mail � gia presente nel sistema, viceversa ritorna true.
	*/
	@Override
	public boolean inviteTeacherIfNotPresent(String email, String teacherInviterId) throws BadRequestException {
		
		User u = userRepository.findByEmail(email);
		if(u==null){
		
			
			Teacher teacherInviter = (Teacher) userRepository.findById(teacherInviterId);
			if(teacherInviter==null)
				throw new BadRequestException();
			
			asyncUpdater.sendTeacherInviteEmail(email, teacherInviter);
			return true;
		}else{
			return false;
		}
	}
	
	/*
	 * Restituisce ina maniera paginata i teacher che rispettano la regex che viene passata.*/
	@Override
	public Page<Reference> getAllTeachersByRegex(String regex, Integer nPag, Integer nItem) throws BadRequestException{
		try{
			Page<User> p = userRepository.getPagingTeachersByRegex(regex, nPag, nItem);
			if(p==null)
				throw new BadRequestException();
			List<Reference> l = new ArrayList<Reference>();
			for(User u : p.getContent()){
				l.add(new Reference(u));
			}
			Pageable pageable = new PageRequest(nPag,nItem);
			PageImpl<Reference> page = new PageImpl<Reference>(l, pageable, p.getTotalElements());	
			return page;
		}catch(MongoException e ){
			throw e;
		}
		
	}

	@Override
	public void sendReport(CustomUserDetails activeUser, Issue issue) {
		User u = userRepository.findById(activeUser.getId());
		Reference r = new Reference (u);
		issue.setUserReference(r);
		issueRepository.save(issue);
		//asyncUpdater.sendReport(u, issue);		
	}

	@Override
	public void sendSuggestion(CustomUserDetails activeUser, Suggestion suggestion) {
		User u = userRepository.findById(activeUser.getId());
		Reference r = new Reference (u);
		suggestion.setUserReference(r);
		suggestionRepository.save(suggestion);
		
		
	}
	@Override
	public void addClientException(ExceptionOnClient e, String userId) {
		User u = userRepository.findById(userId);
		Reference userRef = new Reference (u);
		Date date = new Date();
		e.setUser(userRef);
		e.setDate(date);
		exceptionOnClientRepository.insert(e);
		
	}

	@Override
	public Page<ExceptionOnClient> getAllClientExceptions(Integer nPag, Integer nItem) throws BadRequestException {
		try{
			Page<ExceptionOnClient> p = exceptionOnClientRepository.getPagingException(nPag, nItem);
			if(p==null)
				throw new BadRequestException();
			
			return p;
		}catch(MongoException e ){
			throw e;
		}
	}

	@Override
	public List<Post> getDraft(CustomUserDetails activeUser, Boolean preview) {
		User u = userRepository.findById(activeUser.getId());
		List<String> draft = u.getDraftPostsId();
		
		if(draft==null || draft.size()==0)
			return new ArrayList<Post>();
		
		if(preview && draft.size()>PREVIEW){
			List<String> previewDraft = new ArrayList<String>();
			Random r = new Random();
			int i=0;
			int size = draft.size();
			while(i<PREVIEW && i<size){
				previewDraft.add(draft.remove((int)Math.floor(r.nextDouble()*(draft.size()))));
				i++;
			}
			return postRepository.findByIds(previewDraft);
		}
		return postRepository.findByIds(draft);
	}

	@Override
	public Page<Issue> getAllIssues(Integer nPag, Integer nItem) throws BadRequestException {
		return issueRepository.getPagingIssues(nPag, nItem);
			
		
	}

	@Override
	public Page<Suggestion> getAllSuggestions(Integer nPag, Integer nItem) throws BadRequestException {
		return suggestionRepository.getPagingSuggestions(nPag, nItem);
	}

	

	

	

	
	
}
