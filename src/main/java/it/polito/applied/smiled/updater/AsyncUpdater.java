package it.polito.applied.smiled.updater;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import it.polito.applied.smiled.mailMessage.EmailMessageService;
import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Issue;
import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ResetPasswordToken;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;
import it.polito.applied.smiled.pojo.scenario.Status;
import it.polito.applied.smiled.pojo.user.Student;
import it.polito.applied.smiled.pojo.user.Teacher;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.rabbit.BrokerProducer;
import it.polito.applied.smiled.repository.PostRepository;
import it.polito.applied.smiled.repository.ScenarioRepository;
import it.polito.applied.smiled.repository.UserRepository;
import it.polito.applied.smiled.security.SmiledPermissionEvaluator;
import it.polito.applied.smiled.service.ScenarioService;
import it.polito.applied.smiled.service.UserService;

@Service
public class AsyncUpdater {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private ScenarioService scenarioService;

	@Autowired
	private ScenarioRepository scenarioRepository;

	
	@Autowired
	private PostRepository postRepository;
	
	@Autowired
	private BrokerProducer brokerProducer;
	
	@Autowired
	private EmailMessageService mailService;
	
	@Autowired
	private SmiledPermissionEvaluator permissionEvaluator;

	@Autowired
	private ThreadPoolTaskExecutor taskExecutor;
	
	
	private final String USER_QUEUE_PREFIX="user.";

	public void updateUser(User u){
		Runnable r;
		if(u.getClass().equals(Student.class)){
			r = new StudentRunnable(u);
			taskExecutor.execute(r);
		}
		if(u.getClass().equals(Teacher.class)){
			r = new TeacherRunnable(u);
			taskExecutor.execute(r);
		}

	}
	
	
	/*Costruisco le relazioni relative ad un utente aggiunto ad uno scenario già attivo*/
	public void addRelationShipToUser(List<User> users, String scenarioId)  {
		Runnable r = new UpdateUserReference(users, scenarioId);
		taskExecutor.execute(r);
	}
	
	/*Costruisco le relazioni relative a tutti gli utenti che appartengono ad uno scenario, al momento dell'attivazione*/
	public void createScenarioRelationship(Scenario scenarioUpdated) {
		Runnable r = new CreateScenarioRelationship(scenarioUpdated);
		taskExecutor.execute(r);
	}
	
	public void updateNameOfScenarioReference(List<String> idOfPeopleToUpdate, Scenario scenario, String newScenarioName){
		Runnable r = new UpdateNameOfScenarioInAllReference(idOfPeopleToUpdate, scenario, newScenarioName);
		taskExecutor.execute(r);
	}

	public void closeScenario(String scenarioId, List<String> usersId) {
		Runnable r = new CloseScenarioRunnable(scenarioId, usersId);
		taskExecutor.execute(r);
	}
	
	public void updateOnChangeFirstPassword(Student u) {
		Runnable r = new UpdateOnChangeFirstPasswordRunnable(u);
		taskExecutor.execute(r);
	}
	
	public void sendTeacherRegistrationEmail(String firstName, String email, String token) {
		Runnable r = new SendEmailRunnable(firstName,email, token);
		taskExecutor.execute(r);
		
	}	
	
	public void sendTeacherRegistrationConfirmEmail(String firstName, String email) {
		Runnable r = new SendEmailRunnable(firstName,email, null);
		taskExecutor.execute(r);
		
	}	
	
	public void sendTeacherInviteEmail(String invitedEmail, Teacher invitingTeacher){
		
		Runnable r = new SendInviteEmailRunnable(invitedEmail, invitingTeacher);
		taskExecutor.execute(r);
	}

	public void sendStudentsRegistrationEmail(Map<String,String> toSendEmail,
			Reference teacherRef) {
		Runnable r = new SendEmailRunnable(toSendEmail, teacherRef);
		taskExecutor.execute(r);
	}
	
	public void openScenarioOfUsers(Scenario scenarioUpdated, String callerId) {
		Runnable r = new OpenScenarioOfUsersRunnable(scenarioUpdated, callerId);
		taskExecutor.execute(r);
		
	}
	
	public void sendTeacherExpirationEmail(String email) {
		Runnable r = new SendExpiredEmail(email);
		taskExecutor.execute(r);
		
	}
	
	public void sendReport(User activeUser, Issue issue) {
		Runnable r = new SendReportEmail(activeUser, issue);
		taskExecutor.execute(r);		
	}
	
	public void sendResetPasswordEmail(User u, ResetPasswordToken t){
		Runnable r = new SendResetPasswordEmail(u, t);
		taskExecutor.execute(r);
	}
	
	public void removeNotificationFromCharacter(String userId,
			CharacterReference actor, Scenario s) {
		Runnable r = new RemoveNotificationFromCharacter(userId, actor, s);
		taskExecutor.execute(r);
	}
	
	public void removeModeratorFromScenario(Reference user, Scenario s) {
		Runnable r = new RemoveModeratorFromScenario(user, s);
		taskExecutor.execute(r);		
	}
	
	private class CreateScenarioRelationship implements Runnable{
		
		private Scenario scenario;
		
		public CreateScenarioRelationship(Scenario scenario){
			this.scenario = scenario;
		}

		@Override
		public void run() {
			List<Reference> attendees = scenario.getAttendees();
			if(attendees==null || attendees.size()==0)
				return;
			
			List<Reference> newFriends = new ArrayList<Reference>();
			
			for(int i=0; i<attendees.size()-1; i++){
				User u = userRepository.findById(attendees.get(i).getId());
				
				if(u.getClass().equals(Student.class)){
					Student s = (Student) u;
					
					if(s.getBlockedUsersId()==null || s.getBlockedUsersId().size()==0){
						userRepository.addFriendsToUser(attendees.get(i).getId(), attendees.subList(i+1, attendees.size()));
						userRepository.addFriendToUsers(attendees.subList(i+1, attendees.size()), attendees.get(i));
					}else{
						for(Reference r : attendees){
							if(!s.getBlockedUsersId().contains(r.getId()))
								newFriends.add(r);
						}
						userRepository.addFriendsToUser(s.getId(), newFriends);
						userRepository.addFriendToUsers(newFriends, attendees.get(i));
						newFriends.clear();
					}
				}
			}
		}
		
		
	}
	
	private class UpdateUserReference implements Runnable{
		
		private List<User> users;
		private String scenarioId;
		
		public UpdateUserReference(List<User> users, String scenarioId){
			this.users = users;
			this.scenarioId = scenarioId;
		}

		@Override
		public void run() {
			Scenario scenario = scenarioRepository.findById(scenarioId);
			if(scenario==null || !scenario.getStatus().equals(ScenarioStatus.ACTIVE))
				return;
			
			List<Reference> newFriends = new ArrayList<Reference>();
			for(int i=0; i<users.size(); i++){
				User u = users.get(i);
				if(!u.getClass().equals(Student.class))
					continue;
				Student student = (Student) u;
				Reference studentRef = new Reference(student);
				for(Reference r : scenario.getAttendees()){
					if((student.getFriends()==null || !student.getFriends().contains(r)) && (student.getBlockedUsersId()==null || !student.getBlockedUsersId().contains(r.getId())) 
							&& !r.getId().equals(u.getId()))
						newFriends.add(r);
				}
				if(newFriends.size()>0){
					userRepository.addFriendsToUser(u.getId(), newFriends);
					userRepository.addFriendToUsers(newFriends, studentRef);
				}
				
				for(int j=i+1; j<users.size(); j++){
					User tmp = users.get(j);
					if(!tmp.getClass().equals(Student.class))
						continue;
					Student tmpS = (Student) tmp;
					if(newFriends.contains(new Reference(tmp))){
						if(tmpS.getFriends()==null || !tmpS.getFriends().contains(studentRef)){
							List<Reference> tmpFriends = tmpS.getFriends();
							if(tmpFriends==null)
								tmpFriends = new ArrayList<Reference>();
							tmpFriends.add(studentRef);
							tmpS.setFriends(tmpFriends);
						}
					}
				}
				newFriends.clear();
			}
		}
	}
	
	private class RemoveModeratorFromScenario implements Runnable{
		
		private Reference user;
		private Scenario scenario;
		
		public RemoveModeratorFromScenario(Reference user, Scenario s){
			this.user = user;
			this.scenario = s;
		}
		
		@Override
		public void run(){
			List<String> ids = new LinkedList<String>();
			for(PostReference p : scenario.getPosts()){
				ids.add(p.getId());
			}
			
			String actualChar = "";
			for(CharacterReference charRef : scenario.getCharacters()){
				if(charRef.getUserId().equals(user.getId())){
					actualChar=charRef.getId();
					break;
				}
			}
			List<Post> posts = postRepository.findByIds(ids);
			for(Post p : posts){
				if(p.getClass().equals(Status.class)){
					Status s = (Status) p;
					if(!actualChar.isEmpty()){
						if(s.getUser().getId().equals(user.getId())){
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "p"+s.getId());
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "pc"+s.getId());
							break;
						}
						List<Reference> tagged = s.getTags();
						Reference charRef = new Reference();
						charRef.setId(actualChar);
						if(tagged.contains(actualChar)){
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "p"+s.getId());
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "pc"+s.getId());
							break;
						}
						List<Comment> comments = s.getComments();
						boolean founded=false;
						for(Comment c : comments){
							if(c.getUser().getId().equals(user.getId())){
								brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "pc"+s.getId());
								founded=true;
								break;
							}
						}
						if(founded)
							break;
					}
					List<MetaComment> metaComments = s.getMetaComments();
					for(MetaComment m : metaComments){
						if(m.getUser().getId().equals(user.getId())){
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "pc"+s.getId());
							break;
						}
					}
				}else if(p.getClass().equals(Event.class)){
					Event e = (Event) p;
					if(e.getUser().getId().equals(user.getId())){
						brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "p"+e.getId());
						brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "pc"+e.getId());
						break;
					}
					if(!actualChar.isEmpty()){
						List<Reference> tagged = e.getTags();
						Reference charRef = new Reference();
						charRef.setId(actualChar);
						if(tagged.contains(actualChar)){
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "p"+e.getId());
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "pc"+e.getId());
							break;
						}
						List<Comment> comments = e.getComments();
						boolean founded=false;
						for(Comment c : comments){
							if(c.getUser().getId().equals(user.getId())){
								brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "pc"+e.getId());
								founded=true;
								break;
							}
						}
						if(founded)
							break;
					}
					List<MetaComment> metaComments = e.getMetaComments();
					for(MetaComment m : metaComments){
						if(m.getUser().getId().equals(user.getId())){
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), "TOPIC", "pc"+e.getId());
							break;
						}
					}
				}
			}
		}
	}
	
	private class RemoveNotificationFromCharacter implements Runnable{
		
		private String userId;
		private CharacterReference character;
		private Scenario scenario;
		
		public RemoveNotificationFromCharacter(String userId,
			CharacterReference actor, Scenario s){
			this.userId = userId;
			character = actor;
			this.scenario = s;
		}
		
		@Override
		public void run(){
			List<String> ids = new LinkedList<String>();
			for(PostReference p : scenario.getPosts()){
				ids.add(p.getId());
			}
			List<Post> posts = postRepository.findByIds(ids);
			for(Post p : posts){
				if(p.getClass().equals(Status.class)){
					Status s = (Status) p;
					if(s.getCharacter().getId().equals(character.getId()) 
							&& s.getUser().getId().equals(userId)){
						brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "p"+s.getId());
						brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "pc"+s.getId());
						break;
					}else{
						List<Reference> tagged = s.getTags();
						if(tagged.contains(new Reference(character))){
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "p"+s.getId());
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "pc"+s.getId());
							break;
						}
						List<Comment> comments = s.getComments();
						boolean founded=false;
						for(Comment c : comments){
							if(c.getCharacter().equals(character.getId()) 
								&& c.getUser().getId().equals(userId)){
								brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "pc"+s.getId());
								founded=true;
								break;
							}
						}
						if(founded)
							break;
						List<MetaComment> metaComments = s.getMetaComments();
						for(MetaComment m : metaComments){
							if(m.getUser().getId().equals(userId)){
								brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "pc"+s.getId());
								break;
							}
						}
					}
				}else if(p.getClass().equals(Event.class)){
					Event e = (Event) p;
					List<Reference> tagged = e.getTags();
					if(tagged.contains(new Reference(character))){
						brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "p"+scenario.getId());
						brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "pc"+scenario.getId());
						break;
					}
					List<Comment> comments = e.getComments();
					boolean founded=false;
					for(Comment c : comments){
						if(c.getCharacter().equals(character.getId()) 
							&& c.getUser().getId().equals(userId)){
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "pc"+scenario.getId());
							founded=true;
							break;
						}
					}
					if(founded)
						break;
					List<MetaComment> metaComments = e.getMetaComments();
					for(MetaComment m : metaComments){
						if(m.getUser().getId().equals(userId)){
							brokerProducer.removeBinding(USER_QUEUE_PREFIX+userId, "TOPIC", "pc"+scenario.getId());
							break;
						}
					}
				}
			}
		}
	}
	
	private class SendResetPasswordEmail implements Runnable{

		private User u; 
		private ResetPasswordToken t;
		
		public SendResetPasswordEmail(User u, ResetPasswordToken t){
			this.u=u;
			this.t=t;
		}
		
		@Override
		public void run() {
			mailService.sendResetPasswordEmail(u,t);
			
		}
		
	}
	
	private class SendReportEmail implements Runnable{

		private User activeUser; 
		private Issue issue;
		
		public SendReportEmail(User activeUser, Issue issue){
			this.activeUser=activeUser;
			this.issue=issue;
		}
		
		@Override
		public void run() {
			mailService.sendReportEmail(activeUser,issue);
			
		}
		
	}
	
	private class UpdateNameOfScenarioInAllReference implements Runnable{
		
		private List<String> idOfPeopleToUpdate;
		private Scenario scenario;
		private String newScenarioName;
		
		public UpdateNameOfScenarioInAllReference (List<String> idOfPeopleToUpdate, Scenario scenario, String newScenarioName){
			this.idOfPeopleToUpdate = idOfPeopleToUpdate;
			this.scenario = scenario;
			this.newScenarioName = newScenarioName;
		}
		
		@Override
		public void run() {
			for(int i=0; i<idOfPeopleToUpdate.size(); i++){
				System.out.println(idOfPeopleToUpdate.get(i));
			}
			if(userRepository.updateNameOfAllScenarioReference(idOfPeopleToUpdate, scenario, newScenarioName)){
				System.out.println("Tutti i reference dei partecipanti e collaboratori dello scenario sono stati correttamente aggiornati con il nuovo nome dello scenario");
			}
		}
		
	}
	
	
	private class SendExpiredEmail implements Runnable{

		private String email;
		
		public SendExpiredEmail(String email){
			this.email=email;
		}
		
		@Override
		public void run() {
			mailService.sendExpiredEmail(email);
			
		}
		
	}
	
	private class OpenScenarioOfUsersRunnable implements Runnable{
		private Scenario scenario;
		private List<String> usersId;
		private List<String> collaboratorsId;
		private String callerId;
		
		public OpenScenarioOfUsersRunnable(Scenario scenario, String callerId){
			this.scenario=scenario;
			this.callerId=callerId;
		}
		
		@Override
		public void run(){
			
			boolean creatorOpen = false;
			
			usersId = new ArrayList<String>();
			if(scenario.getAttendees()!=null){
				for(Reference r : scenario.getAttendees())
					usersId.add(r.getId());
				
			}
			
			collaboratorsId = new ArrayList<String>();
			if(scenario.getCollaborators()!=null){
				for(Reference r : scenario.getCollaborators())
					collaboratorsId.add(r.getId());
				
			}
				

			
			if(scenario.getCharacters()!=null){
				for(CharacterReference character : scenario.getCharacters()){
					if(character.getUserId()!=null){
						String userId = character.getUserId();
						ScenarioReference ref = new ScenarioReference(scenario);
						ref.setMyCharacterId(character.getId());
						ref.setMyCharacterName(character.getName());
						ref.setMyPastCharactersId(null);
						permissionEvaluator.addPermission(userId, Character.class, "WRITE", character.getId());
						Reference userRef = new Reference();
						userRef.setId(userId);
						/*Se il Character è interpretato da un Attendee allora devo aggiungere i permessi, spostare lo scenario nello lista degli
						 * openScenarios dell'utente (coi riferimenti al Character settati)*/
						if(scenario.getAttendees()!=null && scenario.getAttendees().contains(userRef)){
							permissionEvaluator.addPermission(userId, Scenario.class, "WRITE", scenario.getId());
							
							usersId.remove(userId);
							
							userRepository.openScenarioToUser(userId, ref);
						/*Nel caso il Character sia interpretato da un Collaborator invece devo solo aggiungere i riferimenti al Character 
						 * allo User*/
						}else if(scenario.getTeacherCreator().getId().equals(userRef.getId())){
							userRepository.openScenarioToUser(userRef.getId(), ref);
							creatorOpen=true;
						}else{
							userRepository.openScenarioToUser(userRef.getId(), ref);
							collaboratorsId.remove(userId);
//							Reference charRef = new Reference();
//							charRef.setId(character.getId());
//							charRef.setFirstname(character.getName());
//							userRepository.addActualCharacterToUser(userId, charRef, scenario.getId());
						}
					}
				}
			}
			/*usersId a questo punto contiene la lista di attendees che non interpretando alcun personaggio non hanno ancora ricevuto permessi 
			 * sullo Scenario*/
			for(String id : usersId){
				permissionEvaluator.addPermission(id, Scenario.class, "WRITE", scenario.getId());
			}
			
			if(scenario.getInvited()!=null)
				for(Reference r : scenario.getInvited())
					usersId.add(r.getId());
			
//			if(scenario.getCollaborators()!=null)
//				for(Reference r : scenario.getCollaborators()){
//					usersId.add(r.getId());
//				}
					
			
			if(!creatorOpen)
				usersId.add(scenario.getTeacherCreator().getId());
			
			usersId.addAll(collaboratorsId);  //questa lista contiene tutti i collaboratori e i partecipanti che non hanno ancora un personaggio associato
			
			userRepository.openScenarioToUsers(usersId, new ScenarioReference(scenario));
			Reference opener = new Reference(userRepository.findById(callerId));
//			notify.notifyOpenScenario(scenario, opener);

			
		}
	}
	
	private class SendInviteEmailRunnable implements Runnable{
		private String email;
		private Teacher inviterTeacher;
		
		public SendInviteEmailRunnable(String email, Teacher inviterTeacher){
			this.email = email;
			this.inviterTeacher = inviterTeacher;
		}
		
		@Override
		public void run(){
			mailService.sendInviteTeacherEmail(email, inviterTeacher.getFirstName() + " "+ inviterTeacher.getLastName());
		}
	}
	
	private class SendEmailRunnable implements Runnable{
		private String firstName;
		private String email;
		private String token;
		private Map<String,String> toSendEmail;
		private Reference teacherRef;
		
		public SendEmailRunnable(String firstName, String email, String token){
			this.firstName=firstName;
			this.email=email;
			this.token=token;
			toSendEmail=null;
			teacherRef=null;
		}
		
		
		public SendEmailRunnable(Map<String,String> toSendEmail,
				Reference teacherRef){
			
			this.toSendEmail=toSendEmail;
			this.teacherRef=teacherRef;
			firstName=null;
			email=null;
			token=null;
		}
		
		@Override
		public void run(){
			if(toSendEmail==null){
				if(token!=null){
					mailService.sendTeacherRegistrationEmail(firstName, email, token);
				}else{
					mailService.sendRegistrationConfirmTeacher(email, firstName);
				}
			}else{
				Set<Entry<String,String>> set = toSendEmail.entrySet();
				for(Entry<String, String> e : set){
					mailService.sendStudentRegistrationEmail(e.getKey(), e.getValue(), teacherRef.getFirstname()+" "+teacherRef.getLastname());
				}
			}
		}
	}
	
		
	//TODO controllare i not null prima di ogni for each
	
	private class UpdateOnChangeFirstPasswordRunnable implements Runnable{
		private Student student;
		
		public UpdateOnChangeFirstPasswordRunnable(Student student){
			this.student=student;
		}
		
		@Override
		public void run(){
			System.out.println("changeFirst-update asincroni: "+System.currentTimeMillis());

			Reference userRef = new Reference(student);
			
			if(student.getTeachers()!=null){
				for(Reference teacherRef : student.getTeachers()){
					userService.addStudentToTeacher(teacherRef.getId(), userRef);
					permissionEvaluator.addPermission(student.getId(), User.class, "READ", teacherRef.getId());
				}
			}
			
			if(student.getOpenScenarios()!=null){
				for(ScenarioReference scenarioRef : student.getOpenScenarios()){
					/*Per gli scenari aperti faccio partire solo la creazione delle relazioni in quanto tutti gli altri aggiornamenti li ho già
					 * fatti in modo sincrono*/
					Scenario s = scenarioRepository.findById(scenarioRef.getId());
					List<User> u = new ArrayList<User>(1);
					u.add(student);
					addRelationShipToUser(u,s.getId());
				}
			}
			if(student.getInvitingScenariosId()!=null){
				for(String scenarioId : student.getInvitingScenariosId()){
					/*Per gli scenari chiusi non creo le relazioni in quanto queste verrano create all'apertura.*/
					scenarioService.moveFromInvitedToAttendees(userRef, scenarioId);
				}
			}
		}
	}
	
	
	private class CloseScenarioRunnable implements Runnable{
		
		private List<String> usersId;
		private String scenarioId;
		
		public CloseScenarioRunnable(String scenarioId, List<String> usersId){
			this.scenarioId=scenarioId;
			this.usersId=usersId;
		}
		
		@Override
		public void run(){
			if(usersId!=null){
				for(String userId : usersId){
					userService.closeScenarioOfUser(scenarioId, userId);
				}
			}
		}
		
	}

	private class StudentRunnable implements Runnable{

		private Student student;
		private Reference newRef;

		public StudentRunnable(User u) {
			student = (Student) u;
			newRef = new Reference(student);
		}

		@Override
		public void run() {
//			int nTeachers=0;
//			/*Aggiorna i ref nella lista di teachers dello student modificato (lista di Students di ogni teacher)*/
//			for(Reference teacherRef : student.getTeachers()){
//				nTeachers+=userRepository.updateStudentsListReference(teacherRef.getId(), newRef);
//			}
//
//			int nFriends=0;
//			/*Aggiorna i ref nella lista di friend del teacher modificato (lista di friends di ogni student)*/
//			for(Reference friendRef : student.getFriends()){
//				nFriends+=userRepository.updateFriendsListReference(friendRef.getId(), newRef);
//			}
//
//			/*Aggiorno i rifierimenti ad ognuno dei miei openScenarios*/
//			//TODO interi per debug, pulire quando non servono
//			int nScenarios=0;
//			int nCharacters=0;
//
//			for(Scenario s : student.getOpenScenarios()){
//
//				for(Reference ref : s.getTeachersCollaborator()){
//					if(ref.getId().equals(newRef.getId())){
//						nScenarios+=scenarioRepository.updateTeacherCollaboratorListReference(s.getId(),newRef);
//						break;
//					}
//				}
//				for(Reference ref : s.getAttendees()){
//					if(ref.getId().equals(newRef.getId())){
//						nScenarios+=scenarioRepository.updateAttendeesListReference(s.getId(),newRef);
//						break;
//					}
//				}
//
//
//				for(Character c : s.getCharacters()){
//					if(c.getActualUser().getId().equals(newRef.getId())){
//						nCharacters+=characterRepository.updateActualUserReference(c.getId(), newRef);
//					}
//				}
//			}
//
//			/*Aggiorno i riferimenti a closed Scenario. Non avendolo a disposizione devo fare una query per recuperarlo
//			 * Non vado a modificare character in quanto l'actualUser di character  quando uno scenario è chiuso è a NULL*/
//			for(Reference r : student.getClosedScenarios()){
//
//				Scenario s = scenarioRepository.findById(r.getId());
//
//
//				for(Reference ref : s.getTeachersCollaborator()){
//					if(ref.getId().equals(newRef.getId())){
//						nScenarios+=scenarioRepository.updateTeacherCollaboratorListReference(s.getId(),newRef);
//						break;
//					}
//				}
//				for(Reference ref : s.getAttendees()){
//					if(ref.getId().equals(newRef.getId())){
//						nScenarios+=scenarioRepository.updateAttendeesListReference(s.getId(),newRef);
//						break;
//					}
//				}
//
//			}
//
//			System.out.println("update TEACHER: "+newRef.getEmail());
//			System.out.println("Updated user: "+nTeachers+nFriends+nCharacters);
		}


	}


	private class TeacherRunnable implements Runnable{

		private Teacher t;
		private Reference newRef;

		public TeacherRunnable(User u) {
			t = (Teacher) u;
			newRef = new Reference(t);
		}

		@Override
		public void run() {
//
//			int nStudents=0;
//			/*Aggiorna i ref nella lista di students del teacher modificato (lista di teachers di ogni student)*/
//			for(Reference studentRef : t.getStudents()){
//				nStudents+=userRepository.updateTeachersListReference(studentRef.getId(), newRef);
//			}
//
//			int nColleagues=0;
//			/*Aggiorna i ref nella lista di collagues del teacher modificato (lista di colleagues di ogni teacher)*/
//			for(Reference colleagueRef : t.getColleagues()){
//				nColleagues+=userRepository.updateColleaguesListReference(colleagueRef.getId(), newRef);
//			}
//
//			/*Aggiorno i rifierimenti ad ognuno dei miei openScenarios*/
//			//TODO interi per debug, pulire quando non servono
//			int nScenarios=0;
//			int nCharacters=0;
//
//			for(Scenario s : t.getOpenScenarios()){
//
//				if(s.getTeacherCreator().getId().equals(newRef.getId()))
//					nScenarios+=scenarioRepository.updateTeacherCreatorReference(s.getId(), newRef);
//				else{
//					for(Reference ref : s.getTeachersCollaborator()){
//						if(ref.getId().equals(newRef.getId())){
//							nScenarios+=scenarioRepository.updateTeacherCollaboratorListReference(s.getId(),newRef);
//							break;
//						}
//					}
//					for(Reference ref : s.getAttendees()){
//						if(ref.getId().equals(newRef.getId())){
//							nScenarios+=scenarioRepository.updateAttendeesListReference(s.getId(),newRef);
//							break;
//						}
//					}
//				}
//
//				for(Character c : s.getCharacters()){
//					if(c.getActualUser().getId().equals(newRef.getId())){
//						nCharacters+=characterRepository.updateActualUserReference(c.getId(), newRef);
//					}
//				}
//			}
//
//			/*Aggiorno i riferimenti a closed Scenario. Non avendolo a disposizione devo fare una query per recuperarlo
//			 * Non vado a modificare character in quanto l'actualUser di character  quando uno scenario è chiuso è a NULL*/
//			for(Reference r : t.getClosedScenarios()){
//
//				Scenario s = scenarioRepository.findById(r.getId());
//
//				if(s.getTeacherCreator().getId().equals(newRef.getId()))
//					nScenarios+=scenarioRepository.updateTeacherCreatorReference(s.getId(), newRef);
//				else{
//					for(Reference ref : s.getTeachersCollaborator()){
//						if(ref.getId().equals(newRef.getId())){
//							nScenarios+=scenarioRepository.updateTeacherCollaboratorListReference(s.getId(),newRef);
//							break;
//						}
//					}
//					for(Reference ref : s.getAttendees()){
//						if(ref.getId().equals(newRef.getId())){
//							nScenarios+=scenarioRepository.updateAttendeesListReference(s.getId(),newRef);
//							break;
//						}
//					}
//				}
//			}
//
//			System.out.println("update TEACHER: "+newRef.getEmail());
//			System.out.println("Updated user: "+nStudents+nColleagues+nCharacters);
//
		}


	}


	public void updateOldScenariosReference() {
		Runnable r = new UpdateOldScenariosReference();
		taskExecutor.execute(r);
	}

	private class UpdateOldScenariosReference implements Runnable{

		@Override
		public void run() {
			System.out.println("RUN");
			List<Scenario> scenarios = scenarioRepository.findByStatus(ScenarioStatus.ACTIVE);
			if(scenarios!=null){
				for(Scenario s : scenarios){
					List<Reference> attendees = s.getAttendees();
					if(attendees==null || attendees.size()==0)
						continue;
					
					for(int i=0; i<attendees.size()-1; i++){
						userRepository.addFriendsToUser(attendees.get(i).getId(), attendees.subList(i+1, attendees.size()));
						userRepository.addFriendToUsers(attendees.subList(i+1, attendees.size()), attendees.get(i));
					}
				}
				System.out.println("UPDATED "+scenarios.size()+" SCENARIOS");
			}
		}
		
	}
}
