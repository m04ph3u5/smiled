package it.polito.applied.smiled.updater;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import it.polito.applied.smiled.mailMessage.EmailMessageService;
import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.user.Student;
import it.polito.applied.smiled.pojo.user.Teacher;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.repository.CharacterRepository;
import it.polito.applied.smiled.repository.ScenarioRepository;
import it.polito.applied.smiled.repository.UserRepository;
import it.polito.applied.smiled.security.SmiledPermissionEvaluator;
import it.polito.applied.smiled.service.ScenarioService;
import it.polito.applied.smiled.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

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
	private CharacterRepository characterRepository;
	
	@Autowired
	private EmailMessageService mailService;
	
	@Autowired
	private SmiledPermissionEvaluator permissionEvaluator;

	@Autowired
	private ThreadPoolTaskExecutor taskExecutor;

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
	public void addRelationShipToUser(User u, Scenario scenario) {
		// TODO Auto-generated method stub
		System.out.println("changeFirst-update asincrono: "+System.currentTimeMillis());

		
	}
	
	/*Costruisco le relazioni relative a tutti gli utenti che appartengono ad uno scenario, al momento dell'attivazione*/
	public void createScenarioRelationship(Scenario scenarioUpdated) {
		// TODO Auto-generated method stub
		
	}

	public void closeScenario(String scenarioId, List<String> usersId) {
		Runnable r = new CloseScenarioRunnable(scenarioId, usersId);
		taskExecutor.execute(r);
	}
	
	public void updateOnChangeFirstPassword(Student u) {
		Runnable r = new UpdateOnChangeFisrtPasswordRunnable(u);
		taskExecutor.execute(r);
	}
	
	public void sendTeacherRegistrationEmail(String firstName, String email, String token) {
		Runnable r = new sendEmailRunnable(firstName,email, token);
		taskExecutor.execute(r);
		
	}	
	
	public void sendTeacherRegistrationConfirmEmail(String firstName, String email) {
		Runnable r = new sendEmailRunnable(firstName,email, null);
		taskExecutor.execute(r);
		
	}	
	
	public void sendTeacherInviteEmail(String invitedEmail, Teacher invitingTeacher){
		
		Runnable r = new sendInviteEmailRunnable(invitedEmail, invitingTeacher);
		taskExecutor.execute(r);
	}

	public void sendStudentsRegistrationEmail(Map<String,String> toSendEmail,
			Reference teacherRef) {
		Runnable r = new sendEmailRunnable(toSendEmail, teacherRef);
		taskExecutor.execute(r);
	}
	
	public void openScenarioOfUsers(Scenario scenarioUpdated) {
		Runnable r = new openScenarioOfUsersRunnable(scenarioUpdated);
		taskExecutor.execute(r);
		
	}
	
	public void sendTeacherExpirationEmail(String email) {
		Runnable r = new sendExpiredEmail(email);
		taskExecutor.execute(r);
		
	}
	
	private class sendExpiredEmail implements Runnable{

		private String email;
		
		public sendExpiredEmail(String email){
			this.email=email;
		}
		
		@Override
		public void run() {
			mailService.sendExpiredEmail(email);
			
		}
		
	}
	
	private class openScenarioOfUsersRunnable implements Runnable{
		private Scenario scenario;
		private List<String> usersId;
		
		public openScenarioOfUsersRunnable(Scenario scenario){
			this.scenario=scenario;
		}
		
		@Override
		public void run(){
			
			boolean creatorOpen = false;
			
			usersId = new ArrayList<String>();
			if(scenario.getAttendees()!=null)
				for(Reference r : scenario.getAttendees())
					usersId.add(r.getId());

			
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
							Reference charRef = new Reference();
							charRef.setId(character.getId());
							charRef.setFirstname(character.getName());
							userRepository.addActualCharacterToUser(userId, charRef, scenario.getId());
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
			
			if(scenario.getCollaborators()!=null)
				for(Reference r : scenario.getCollaborators())
					usersId.add(r.getId());
			
			if(!creatorOpen)
				usersId.add(scenario.getTeacherCreator().getId());
			
			userRepository.openScenarioToUsers(usersId, new ScenarioReference(scenario));
		}
	}
	
	private class sendInviteEmailRunnable implements Runnable{
		private String email;
		private Teacher inviterTeacher;
		
		public sendInviteEmailRunnable(String email, Teacher inviterTeacher){
			this.email = email;
			this.inviterTeacher = inviterTeacher;
		}
		
		@Override
		public void run(){
			mailService.sendInviteTeacherEmail(email, inviterTeacher.getFirstName() + " "+ inviterTeacher.getLastName());
		}
	}
	
	private class sendEmailRunnable implements Runnable{
		private String firstName;
		private String email;
		private String token;
		private Map<String,String> toSendEmail;
		private Reference teacherRef;
		
		public sendEmailRunnable(String firstName, String email, String token){
			this.firstName=firstName;
			this.email=email;
			this.token=token;
			toSendEmail=null;
			teacherRef=null;
		}
		
		
		public sendEmailRunnable(Map<String,String> toSendEmail,
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
	
	private class UpdateOnChangeFisrtPasswordRunnable implements Runnable{
		private Student student;
		
		public UpdateOnChangeFisrtPasswordRunnable(Student student){
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
					addRelationShipToUser(student,s);
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


	


	

}
