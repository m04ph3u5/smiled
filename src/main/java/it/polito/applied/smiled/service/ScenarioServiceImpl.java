package it.polito.applied.smiled.service;

import it.polito.applied.smiled.dto.CharacterDTO;
import it.polito.applied.smiled.dto.EmailDTO;
import it.polito.applied.smiled.dto.EventDTO;
import it.polito.applied.smiled.dto.RevisionDTO;
import it.polito.applied.smiled.dto.ScenarioDTO;
import it.polito.applied.smiled.dto.StatusDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.mailMessage.EmailMessageService;
import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.PostReferenceHistoricalDateComparator;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.Role;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.CommentDTO;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.pojo.scenario.Relation;
import it.polito.applied.smiled.pojo.scenario.Revision;
import it.polito.applied.smiled.pojo.scenario.RevisionStatus;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;
import it.polito.applied.smiled.pojo.scenario.Status;
import it.polito.applied.smiled.pojo.user.Student;
import it.polito.applied.smiled.pojo.user.Teacher;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.pojo.user.UserStatus;
import it.polito.applied.smiled.repository.CharacterRepository;
import it.polito.applied.smiled.repository.FileMetadataRepository;
import it.polito.applied.smiled.repository.PostRepository;
import it.polito.applied.smiled.repository.ScenarioRepository;
import it.polito.applied.smiled.repository.UserRepository;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.security.SmiledPermissionEvaluator;
import it.polito.applied.smiled.updater.AsyncUpdater;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import org.apache.commons.lang3.RandomStringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoDataIntegrityViolationException;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.mongodb.MongoException;

@Service
public class ScenarioServiceImpl implements ScenarioService{

	@Autowired
	private ScenarioRepository scenarioRepository;

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CharacterRepository characterRepository;
	
	@Autowired
	private PostRepository postRepository;

	@Autowired 
	private UserService userService;
	
	@Autowired
	private FileMetadataRepository fileMetadataRepository;

	@Autowired 
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private SmiledPermissionEvaluator permissionEvaluator;
	
	@Autowired
	private AsyncUpdater asyncUpdater;

	@Override
	public String createScenario(ScenarioDTO scenarioDTO, String email) throws MongoException, BadRequestException{
		try{
			//TODO trovare un modo per caricare le immagini
			scenarioDTO.setCover(null); //Quando creo uno scenario � senza cover

			Teacher t = (Teacher) userRepository.findByEmail(email);
			if(t==null)
				throw new BadRequestException();			
			Reference ref = new Reference(t);

			Scenario scenario = new Scenario(scenarioDTO,ref);
			scenario = scenarioRepository.insert(scenario);
			int n = userRepository.createScenarioToUser(t.getId(),new ScenarioReference(scenario));
			if(n!=1){
				scenarioRepository.delete(scenario);
				throw new BadRequestException();
			}
			permissionEvaluator.addPermission(t.getId(), Scenario.class, "CREATOR", scenario.getId());
			return scenario.getId();
		}catch(MongoException e){
			throw e;
		}
	}


	//Ritorna lo scenario modificato
	//La modifica dello scenario NON può aggiungere students o collaborators o characters
	@Override
	public Scenario updateScenario(String id, ScenarioDTO scenario, String callerId) throws MongoException, BadRequestException{
		try{
			Scenario scenarioUpdated;
			//TODO
			/*Log di chi aggiorna cosa*/
			Update u = new Update();

			if(scenario.getName()!=null){
				u.set("name", scenario.getName());
			}
			if(scenario.getHistory()!=null){
				if(scenario.getHistory().getDescription()!=null){
					u.set("history.description", scenario.getHistory().getDescription());
				}
				if(scenario.getHistory().getStartDate()!=null){
					u.set("history.startDate", scenario.getHistory().getStartDate());
				}
				if(scenario.getHistory().getEndDate()!=null){
					u.set("history.endDate", scenario.getHistory().getEndDate());
				}
				if(scenario.getHistory().getMap()!=null){
					u.set("history.map", scenario.getHistory().getMap());
				}

			}
			ScenarioStatus newStatus = scenario.getStatus();
			if(newStatus != null){
				u.set("status", scenario.getStatus());
			}

			//Non faccio l'update dell'url della cover ( TODO :probabilmente ci sar� un' API apposta per caricare le immagini)

			scenarioUpdated = scenarioRepository.updateScenario(id, u);
			if(scenarioUpdated == null)
				throw new BadRequestException();
			
			
			/*Inserisco lo scenario nelle liste degli utenti (openScenarios o closedScenarios) partecipanti o collaboratori*/
			if(newStatus!=null && (newStatus.equals(ScenarioStatus.ACTIVE) || newStatus.equals(ScenarioStatus.CLOSED))){
				/*Lista che contiene tutti gli utenti dello scenario ad eccezione degli invited*/
				List<String> usersId = new ArrayList<String>();
				/*Sotto insieme della lista userId che contiene tutti gli utenti ad eccezione del creatore e di tutti i collaboratori teacher
				 * Questa lista viene creata per rimuovere i permessi ai soli utenti non collaboratori (teacher), per peremettere loro di 
				 * continuare a modificare lo scenario anche dopo la chiusura dello stesso. (NON CONTIENE GLI INVITED)*/
				List<String> userNotTeacherCollaborators = new ArrayList<String>();
				
				List<String> invited = new ArrayList<String>();
				
				if(scenarioUpdated.getAttendees()!=null){
					for (Reference r: scenarioUpdated.getAttendees()){
						usersId.add(r.getId());
						userNotTeacherCollaborators.add(r.getId());
					}
				}
				if(scenarioUpdated.getCollaborators()!=null){
					for (Reference r: scenarioUpdated.getCollaborators()){
						usersId.add(r.getId());
						if(!r.getType().equals(Teacher.class.getSimpleName()))
							userNotTeacherCollaborators.add(r.getId());
					}
				}
				
				if(scenarioUpdated.getInvited()!=null){
					for(Reference r: scenarioUpdated.getInvited()){
						invited.add(r.getId());
					}
					/*Vado ad eliminare lo scenario da tutti gli utenti che mi ritrovo nella lista degli invited*/
				}
				if(newStatus.equals(ScenarioStatus.CLOSED)){
					
		
					/*Chiudo lo scenario per tutti i partecipanti, compreso il creatore.
					 * Il service chiuderà in modo sincrono lo scenario per il teacher che chiude lo scenario, in modo asincrono per tutti
					 * gli altri utenti*/
					usersId.add(scenarioUpdated.getTeacherCreator().getId());
					userService.closeScenarioOfUsers(scenarioUpdated.getId(),callerId,usersId);
					
					/*Quando uno scenario viene chiuso si lascia solo al Creator e ai moderatori Teacher la possibilità di continuare 
					 * a modificare lo scenario*/
					permissionEvaluator.updatePermissions(userNotTeacherCollaborators, Scenario.class, scenarioUpdated.getId(), "READ");
					
					/*Quando chiudo uno scenario rimuovo, dagli utenti presenti nella lista di invited, il riferimento a quello scenario,
					 * a prescindere da quale lista di scenari (open, closed, inviting) contenga lo scenario nello user stesso.*/
					userService.removeScenarioFromUsers(invited, scenarioUpdated.getId());

					/*Rimuovo i permessi per tutti i Character dello Scenario
					 * Prima di accedere al Repository controllo che lo specifico personaggio sia interpretato da qualcuno in quel momento*/
					if(scenarioUpdated.getCharacters()!=null){
						for(CharacterReference c : scenarioUpdated.getCharacters()){
							if(c.getUserId()!=null) 
								permissionEvaluator.removeOnePermission(c.getUserId(),Character.class, c.getId());
						}
					}
				}else{
															
					asyncUpdater.openScenarioOfUsers(scenarioUpdated);
					asyncUpdater.createScenarioRelationship(scenarioUpdated);
				}
			}
			
			return scenarioUpdated;
		}catch(MongoException e){
			throw e;
		}

	}


	@Override
	public List<Reference> getAllScenariosUsers(String id) throws MongoException, NotFoundException{
		try{
			Scenario s = scenarioRepository.findById(id);
			if(s==null)
				throw new NotFoundException();
			return s.getAttendees();
		}catch(MongoException e){
			throw e;
		}
	}

	@Override
	public List<Reference> getAllScenariosCollaborators(String id) throws MongoException, NotFoundException{
		try{
			Scenario s = scenarioRepository.findById(id);
			if(s==null)
				throw new NotFoundException();
			return s.getCollaborators();
		}catch(MongoException e){
			throw e;
		}
	}

	@Override
	public Scenario getScenario(String id) throws MongoException, NotFoundException{
		try{
			Scenario s = scenarioRepository.findById(id);
			if(s==null)
				throw new NotFoundException();

			return s;
		}catch(MongoException e){
			throw e;
		}
	}


	//Questo metodo restituisce sempre un reference allo user che risponde all'email cercata (e se deve lo iscrive prima al sistema)
	//ATTENZIONE - Non controlliamo la natura dello user associato all'email data: se non presente viene iscritto come Student
	@Override
	public List<Reference> subscribeStudentIfNotPresent(List<EmailDTO> studentsEmail, String teacherId, String scenarioId) throws BadRequestException, MongoException{
		try{
			
			/*Lista di Reference che sarà ritornata dal metodo*/
			List<Reference> l = new ArrayList<Reference>();
			Map<String, String> toSendEmail = new HashMap<String, String>();
			
			/*Recupero il Teacher che sta provando a fare questa operazione e ne genero il Reference (utile nelle liste degli Student,
			 * oltre che nello Scenario). Ovviamente non può essere NULL*/
			Teacher teacher = (Teacher) userRepository.findById(teacherId);
			if(teacher==null)
				throw new BadRequestException();
			Reference teacherRef = new Reference(teacher);
			
			/*Prelevo lo scenario a cui voglio aggiungere gli utenti e ne istanzio un Reference (i parametri relativi al Character saranno NULL).*/
			Scenario scen = scenarioRepository.findById(scenarioId);
			ScenarioReference scenarioRef = new ScenarioReference(scen);
			
			/*Se lo scenario è chiuso non è possibile aggiungere studenti ad esso*/
			if(scen.getStatus().equals(ScenarioStatus.CLOSED))
				throw new BadRequestException();
			
			
			if(studentsEmail!=null){
				/*Per ogni email presente nella lista*/
				for(EmailDTO emailDTO : studentsEmail){
					
					/*Controllo se l'email che mi è stata inviata è già registrata all'interno dello scenario*/
					if(userAlreadyPresentInScenario(emailDTO.getEmail(),scen))
						continue;
					/**/
					Reference ref;
					/*Cerco l'email all'interno del DB. Se non presente iscrivo l'utente al sistema, altrimenti lo aggiungo soltanto allo Scenario*/
					User u = userRepository.findByEmail(emailDTO.getEmail());
					if(u==null){
						/*Genero una password di default da 10 caratteri alfanumerici e ne calcolo l'hash con BCrypt*/	
						String pwd = RandomStringUtils.random(10,true,true);
						String hashPassword=passwordEncoder.encode(pwd);
		
						User student;
						/*Se lo scenario è gia ACTIVE, genero un nuovo Student contenente già nella lista dei suoi openScenarios il Reference allo
						 * Scenario a cui la richiesta si riferisce.*/
						if(scen.getStatus().equals(ScenarioStatus.ACTIVE)){
							student = new Student(emailDTO.getEmail(),teacherRef,hashPassword, scenarioRef);
						/*Se lo scenario è in uno degli stati CREATED_Vx, genero un nuovo Student contenente invece l'id dello Scenario all'interno
						 * della lista dei suoi invitingScenario.*/
						}else{
							student = new Student(emailDTO.getEmail(),teacherRef,hashPassword, scenarioId);
						}
						
						try{
							/*Provo a salvare lo studente nel Repository User. Il salvataggio potrebbe non andare a buon fine (vedi blocco catch),
							 * nel caso qualche altro Teacher inserisca lo Student tra la find precedente e questa save.*/
							u = userRepository.save(student);
							/*Invio una mail che notifica lo studente dell'avvenuta registrazione alla piattaforma, contenente anche la password
							 * di default fa utilizzare al primo accesso*/
							ref = new Reference(u);
							toSendEmail.put(ref.getEmail(), pwd);
							/*Aggiungo lo Student alla lista di invited dello Scenario. Passerà nella lista degli attendees nel momento in cui
							 * lo Student confermerà l'iscrizione effettuando il primo login.*/
							scenarioRepository.addUserToInvited(scen.getId(), ref);
							/*Aggiungo il referene alla lista dei Ref da ritornare.*/
							l.add(ref);
						}catch(MongoDataIntegrityViolationException e){
							/*Prendo nuovamente l'utente con una nuova find in quanto se sono arrivato in questo blocco catch
							 * vuol dire che c'è stata una violazione dei vincoli sul repository degli utenti (l'unico possibile è l'unicità 
							 * della mail all'interno del repository, oltre che dell'id naturalmente).*/
							u = userRepository.findByEmail(emailDTO.getEmail());
							
							if(u.getClass().equals(Student.class)){
								ref = new Reference(u);
								
								if(u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD) && !scen.getStatus().equals(ScenarioStatus.ACTIVE)){
									userRepository.addInvitingScenario(ref.getId(), scen.getId());
									scenarioRepository.addUserToInvited(scen.getId(), ref);
								}else if(u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD) && scen.getStatus().equals(ScenarioStatus.ACTIVE)){
									userService.addTeacherToStudent(ref.getId(), teacherRef, false);
									userRepository.openScenarioToUser(ref.getId(), scenarioRef);
									scenarioRepository.addUserToInvited(scen.getId(), ref);
								}else if(!u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD) && !scen.getStatus().equals(ScenarioStatus.ACTIVE)){
									userRepository.addInvitingScenario(ref.getId(), scen.getId());
									userService.addTeacherToStudent(ref.getId(), teacherRef, true);
									scenarioRepository.addAttendeeToScenario(ref, scen.getStatus(), scen.getId());
								}else if(!u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD) && scen.getStatus().equals(ScenarioStatus.ACTIVE)){
									userService.addTeacherToStudent(ref.getId(), teacherRef, true);
									userRepository.openScenarioToUser(ref.getId(), scenarioRef);
									scenarioRepository.addAttendeeToScenario(ref, scen.getStatus(), scen.getId());
									permissionEvaluator.addPermission(u.getId(), Scenario.class, "WRITE", scen.getId());
								}
								
		
								if(!l.contains(ref))
									l.add(ref);
							}
						}
					}else{ //u!=NULL
						
						if(u.getClass().equals(Student.class)){
							ref = new Reference(u);
							
							if(u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD) && !scen.getStatus().equals(ScenarioStatus.ACTIVE)){
								userRepository.addInvitingScenario(ref.getId(), scen.getId());
								scenarioRepository.addUserToInvited(scen.getId(), ref);
							}else if(u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD) && scen.getStatus().equals(ScenarioStatus.ACTIVE)){
								userService.addTeacherToStudent(ref.getId(), teacherRef, false);
								userRepository.openScenarioToUser(ref.getId(), scenarioRef);
								scenarioRepository.addUserToInvited(scen.getId(), ref);
							}else if(!u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD) && !scen.getStatus().equals(ScenarioStatus.ACTIVE)){
								userRepository.addInvitingScenario(ref.getId(), scen.getId());
								userService.addTeacherToStudent(ref.getId(), teacherRef, true);
								scenarioRepository.addAttendeeToScenario(ref, scen.getStatus(), scen.getId());
							}else if(!u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD) && scen.getStatus().equals(ScenarioStatus.ACTIVE)){
								userService.addTeacherToStudent(ref.getId(), teacherRef, true);
								userRepository.openScenarioToUser(ref.getId(), scenarioRef);
								scenarioRepository.addAttendeeToScenario(ref, scen.getStatus(), scen.getId());
								permissionEvaluator.addPermission(u.getId(), Scenario.class, "WRITE", scen.getId());
							}
							
	
							if(!l.contains(ref))
								l.add(ref);
						}
					}
				}
			}
			
			asyncUpdater.sendStudentsRegistrationEmail(toSendEmail,teacherRef);
			
			return l;
			
		}catch(MongoException e){
			throw e;
		}
	}
	
	private boolean userAlreadyPresentInScenario(String userEmail, Scenario scen){
		boolean alreadyPresent=false;
		
		if(scen.getInvited()!=null){
			for(Reference r : scen.getInvited())
				if(r.getEmail().equals(userEmail)){
					alreadyPresent=true;
					break;
				}
		}
		
		if(scen.getAttendees()!=null){
			for(Reference r : scen.getAttendees())
				if(r.getEmail().equals(userEmail)){
					alreadyPresent=true;
					break;
				}
		}
		
		if(scen.getCollaborators()!=null){
			for(Reference r : scen.getCollaborators())
				if(r.getEmail().equals(userEmail)){
					alreadyPresent=true;
					break;
				}
		}
		
		return alreadyPresent;
	}

//	/*Simile al subscribeStudentIfNotPresent. A differenza di quest'ultima iscrive al sistema un utente come Teacher se non già presente
//	 * In caso contrario restituisce il Reference allo User (indipendentemente dal fatto che sia Student o Teacher)*/
//	//TODO - modificare procedura iscrizione aggiungendo conferma admin
//	@Override
//	public Reference subscribeTeacherIfNotPresent(String email, String teacherId) throws BadRequestException {
//		
//		Reference ref;
//		User u = userRepository.findByEmail(email);
//		if(u==null){
//			String pwd = RandomStringUtils.random(10,true,true);
//			String hashPassword=passwordEncoder.encode(pwd);
//			
//			Teacher invitingTeacher = (Teacher) userRepository.findById(teacherId);
//			if(invitingTeacher==null)
//				throw new BadRequestException();
//			Reference invitingTeacherRef = new Reference(invitingTeacher);
//			
//			User teacher = new Teacher(email,invitingTeacherRef,hashPassword);
//			
//			try{
//				u = userRepository.save(teacher);
//				//TODO modificare l'invio mail seguendo pattern di iscrizione
//				mailService.sendStudentRegistrationEmail(u.getEmail(), pwd, invitingTeacherRef.getLastname()+" "+invitingTeacherRef.getFirstname());
//				ref = new Reference(u);
//				return ref;
//			}catch(MongoDataIntegrityViolationException e){
//				u = userRepository.findByEmail(email);
//				ref = new Reference(u);
//				return ref;
//			}
//
//		}else{
//			ref = new Reference(u);
//			return ref;
//		}
//	}

//	//Rimuove una lista di user
//	@Override
//	public void removeUsersFromScenario(String id, List<String> usersToDelete) throws MongoException, BadRequestException{
//		try{
//
//			Scenario scen = scenarioRepository.findById(id);
//			if (scen == null)
//				throw new BadRequestException();
//			//Dagli scenari chiusi non si possono rimuovere gli user
//			if( scen.getStatus().equals(ScenarioStatus.CLOSED)) 
//				throw new BadRequestException();
//			//Se lo scenario � attivo aggiorno anche gli users che sto togliendo
//			if( scen.getStatus().equals(ScenarioStatus.ACTIVE)){ 
//				removeUsersFromCharacters(usersToDelete,scen);
//				int n = userService.removeScenarioFromUsers(usersToDelete, id);
//				int p = permissionEvaluator.removePermissions(usersToDelete, Scenario.class, id);
//
//				System.out.println("removeUsersFromScenario\n\nusersToDelete: "+usersToDelete.size()+"\nremoveScenario: "+n+"\npermissionEvaluator: "+p);
//			}
//			int n=scenarioRepository.removeUsersFromScenario(id, scen.getStatus(), usersToDelete.toArray());
//
//		}catch(MongoException e){
//			throw e;
//		}
//	}

	private void removeUserFromCharacters(String userToDelete,	Scenario scen) {
		if(scen.getCharacters()!=null){
			for(CharacterReference c : scen.getCharacters()){
				if(c.getUserId()!=null && userToDelete.equals(c.getUserId())){
					System.out.println("Rimuovo permission su Character");
					permissionEvaluator.removeOnePermission(c.getUserId(), Character.class, c.getId());
					characterRepository.updateActualUserReference(c.getId(), null);
					scenarioRepository.removeUserFromCharacterReference(scen.getId(), c, userToDelete);
					break;
				}
			}
		}
	}


	//Rimuove un collaboratore alla volta e valuta se metterlo nella lista degli attendees
	//Se putInAttendeesList=true allora il collaboratore deve essere declassato a partecipante altrimenti viene tolto dallo scenario
	@Override
	public void removeCollaboratorFromScenario(String id, String collaboratorId, boolean putInAttendeesList) throws MongoException, BadRequestException{
		try{
			Scenario scen = scenarioRepository.findById(id);
			Reference collaborator=null;
			if (scen == null)
				throw new BadRequestException();
			//Dagli scenari chiusi non si possono rimuovere gli user
			if( scen.getStatus().equals(ScenarioStatus.CLOSED)) 
				throw new BadRequestException();
			
			if(scen.getCollaborators()==null)
				throw new BadRequestException();
			else{
				for(Reference r : scen.getCollaborators()){
					if(r.getId().equals(collaboratorId)){
						collaborator=r;
						break;
					}
				}
			}
			if(collaborator==null)
				throw new BadRequestException();
			
	
			if(!putInAttendeesList){
				
				userService.removeScenarioAndSaveInBlockedList(collaborator.getId(), id);
				permissionEvaluator.removeOnePermission(collaboratorId, Scenario.class, id);
				removeUserFromCharacters(collaborator.getId(), scen);

			}
			else{
				permissionEvaluator.updatePermission(collaboratorId, id, Scenario.class, "WRITE");
				if(scen.getStatus()!=ScenarioStatus.ACTIVE){
					userService.moveScenarioFromOpenToInviting(collaboratorId, scen.getId());
				}
			}
		
			//TODO valutare gestione errori		
			scenarioRepository.removeCollaboratorFromScenario(id, scen.getStatus(), collaborator, putInAttendeesList);
		}catch(MongoException e){
			throw e;
		}
	}

	@Override
	public void removeScenario(String id) throws BadRequestException, MongoException {
		List<String> usersToRemove = new ArrayList<String>();
		try{
			Scenario scen = scenarioRepository.findById(id);
			if (scen == null)
				throw new BadRequestException();
			
			if(scen.getAttendees()!=null){
				for(Reference r: scen.getAttendees()){
					usersToRemove.add(r.getId());
				}
			}
			if(scen.getCollaborators()!=null){
				for(Reference r: scen.getCollaborators()){
					usersToRemove.add(r.getId());
				}
			}
			if(scen.getInvited()!=null){
				for(Reference r: scen.getInvited())
					usersToRemove.add(r.getId());
			}

			/*Nel caso in cui lo scenario si trovi ancora nella fase di creazione, cancello realmente tutto quello che riguarda lo scenario*/
			if(scen.getStatus().equals(ScenarioStatus.CREATED_V1) || scen.getStatus().equals(ScenarioStatus.CREATED_V2) 
					|| scen.getStatus().equals(ScenarioStatus.CREATED_V3)){
				/*solo in questo caso si aggiunge il creatore alla usersToRemove*/
				usersToRemove.add(scen.getTeacherCreator().getId());
				userService.removeScenarioFromUsers(usersToRemove, scen.getId());
				permissionEvaluator.removePermissions(usersToRemove, Scenario.class, scen.getId());
				
				if(scen.getCharacters()!=null){
					List<String> idCharacters = new ArrayList<String>();
					for(CharacterReference c : scen.getCharacters()){
						permissionEvaluator.removeAllPermissionsForTarget(Character.class, c.getId());
						idCharacters.add(c.getId());
					}
					characterRepository.removeCharacters(idCharacters);
				}
				scenarioRepository.removeScenario(id);	
			/*Nel caso in cui lo Scenario sia stato attivato non lo cancello realmente dal sistema ma:
			 * - rimuovo tutti i riferimenti che gli utenti, ad eccezione del creatore, hanno verso le Scenario;
			 * - rimuovo tutti i permessi relativi a Scenario e Character;
			 * - NON rimuovo i Character;
			 * - aggiungo l'id dello scenario alla lista dei deleted del creatore*/	
			}else{
				userService.removeScenarioFromUsers(usersToRemove, scen.getId());
				permissionEvaluator.removePermissions(usersToRemove, Scenario.class, scen.getId());
				if(scen.getCharacters()!=null){
					for(CharacterReference c : scen.getCharacters()){
						permissionEvaluator.removeAllPermissionsForTarget(Character.class, c.getId());
					}
				}
				userService.deleteScenarioFromCreator(scen.getTeacherCreator().getId(), scen.getId());
				scenarioRepository.putInDeletedState(scen.getId());
			}
			
			
		}catch(MongoException e){
			throw e;
		}
	}

	
	@Override
	public Reference addCollaboratorToScenario(String collaboratorEmail, String idScenario) throws BadRequestException, NotFoundException {
		try{
			Scenario scen = scenarioRepository.findById(idScenario);

			if (scen == null)
				throw new BadRequestException();

			if(scen.getStatus().equals(ScenarioStatus.CLOSED))
				throw new BadRequestException();
			
			User u = userRepository.findByEmail(collaboratorEmail);
			if(u==null || u.getStatus().equals(UserStatus.STATUS_PENDING) || u.getStatus().equals(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD))
				throw new NotFoundException();

			Reference r = new Reference(u);
			
			/*I permessi ai moderatori vengono assegnati a prescindere dallo stato dello Scenario. Possono iniziare a lavorare sullo Scenario anche
			 * quando questo è nella fase di Creazione (così da poter, per esempio, invitare altri studenti).*/
				
			if(scen.getAttendees()!=null && scen.getAttendees().contains(r)){
				/*Se il collaboratore da inserire si travava già nella lista dei partecipanti, allora elevo solamente i suoi privilegi e lo
				 * tolgo dalla lista degli attendees per inserirlo nella lista dei teachersCollaborator*/
				scenarioRepository.addCollaborator(r, scen.getStatus(), idScenario, true);
				permissionEvaluator.upsertPermission(r.getId(), scen.getId(), Scenario.class, "MODERATOR");		
			}else if(scen.getCollaborators()==null || !scen.getCollaborators().contains(r)){
				scenarioRepository.addCollaborator(r, scen.getStatus(), idScenario, false);
				permissionEvaluator.addPermission(r.getId(), Scenario.class, "MODERATOR", scen.getId());
				userService.openScenarioOfUser(r, new ScenarioReference(scen));
				/*L'aggiornamento delle relazioni va fatto solo se lo scenario è già attivo, altrimenti verrà fatto all'attivazione per tutti i partecipanti*/
				if(scen.getStatus().equals(ScenarioStatus.ACTIVE))
					asyncUpdater.addRelationShipToUser(u, scen);
			}
	
			if(scen.getStatus().equals(ScenarioStatus.ACTIVE))
				userService.openScenarioOfUser(r, new ScenarioReference(scen));
			else
				userService.createScenarioOfUser(r, new ScenarioReference(scen));

			return r;
		}catch(MongoException e){
			throw e;
		}



	}


	//L'id dello scenario � gi� contenuto nel character
	@Override
	public Id addCharacterToScenario(CharacterDTO characterDTO, String scenarioId, String userId) throws BadRequestException {
		try{
			Scenario scen = scenarioRepository.findById(scenarioId);
			if(scen==null)
				throw new BadRequestException();
			
			Character c = new Character(characterDTO, scenarioId, userId);
			
			//salvo prima il character nel DB dei characters
			Character newCharacter = characterRepository.insert(c);
			//Inserisco il DBREF  a quel character nella lista dei personaggi creati nello scenario
			if(!scenarioRepository.addCharacter(new CharacterReference(newCharacter), scen.getId(), scen.getStatus()))
				throw new BadRequestException();
			
			return new Id(newCharacter.getId());
		}catch(MongoException e){
			throw e;
		}
		
	}


	@Override
	public Character getCharacter(String scenarioId, String characterId) throws NotFoundException {
		try{
			Character c = characterRepository.findById(characterId);
			if(c==null || !c.getScenarioId().equals(scenarioId))
				throw new NotFoundException();
			
			if(!c.isDeleted())
				return c;
			else
				throw new NotFoundException();
		}catch(MongoException e){
			throw e;
		}
	}


	/*L'operazione di update del Character comporta in realtà */
	@Override
	public Character updateCharacter(String scenarioId, CharacterDTO character) throws BadRequestException, NotFoundException {
		try{
			boolean updateRef=false;
				
			Update u = new Update();
			if(character.getName()!=null){
				u.set("name",character.getName());
				updateRef=true;
			}
			if(character.getDescription()!=null)
				u.set("description",character.getDescription());
			if(character.getBirthDate()!=null)
				u.set("birthDate",character.getBirthDate());
			if(character.getDeadDate()!=null)
				u.set("deadDate",character.getDeadDate());
			if(character.getBornTown()!=null)
				u.set("bornTown", character.getBornTown());
			if(character.getDeadTown()!=null)
				u.set("deadTown", character.getDeadTown());
			if(character.getGender()!=null)
				u.set("gender", character.getGender());
			if(character.getNickname()!=null)
				u.set("nickname", character.getNickname());
			if(character.getQuote()!=null)
				u.set("quote", character.getQuote());
			if(character.getRole()!=null)
				u.set("role", character.getRole());
			Character c = characterRepository.updateCharacter(character.getId(), u);
			
			if(updateRef){
				System.out.println("updateRef");
				CharacterReference charRef = new CharacterReference(c);
				scenarioRepository.updateCharacterToScenario(charRef, scenarioId);
				if(c.getActualUser()!=null && !c.getActualUser().getId().isEmpty()){
					User user = userRepository.findById(c.getActualUser().getId());
					if(user==null)
						throw new BadRequestException();
					user.updateCharacter(scenarioId, charRef);
					userRepository.save(user);
				}
			}
			
			return c;
			
			
		}catch(MongoException e){
			throw e;
		}
	}


	@Override
	public void removeUserFromScenario(String id, String userToDelete)
			throws MongoException, BadRequestException {
		try{

			Scenario scen = scenarioRepository.findById(id);
			if (scen == null)
				throw new BadRequestException();
			//Dagli scenari chiusi non si possono rimuovere gli user
			if( scen.getStatus().equals(ScenarioStatus.CLOSED)) 
				throw new BadRequestException();
			
			if(scen.getInvited()!=null){
				for(Reference ref : scen.getInvited()){
					if(ref.getId().equals(userToDelete)){
						/*Vado a rimuovere lo sceneario dall'utente. Lo scenario può trovarsi nella lista degli openScenarios o, se lo Scenario
						 * non era già ACTIVE nella lista degli invitingScenarios. Lo Scenario rimosso non verrà aggiunto alla lista dei blockedScenarios
						 * dello User.*/
						userService.removeScenarioFromUser(userToDelete, id);
						scenarioRepository.removeUserFromScenario(id, scen.getStatus(), userToDelete);
						return;
					}
				}
			}
			
			if(scen.getAttendees()!=null){
				for(Reference ref : scen.getAttendees()){
					if(ref.getId().equals(userToDelete)){
						/*Nel caso l'utente venga rimosso dallo Scenario, perde i riferimenti ai Character interpretati in quello Scenario*/
						removeUserFromCharacters(userToDelete,scen);
						userService.removeScenarioAndSaveInBlockedList(userToDelete, id);
						permissionEvaluator.removeOnePermission(userToDelete, Scenario.class, id);
						scenarioRepository.removeUserFromScenario(id, scen.getStatus(), userToDelete);
						return;
					}
				}
			}

			

		}catch(MongoException e){
			throw e;
		}
	}


	@Override
	public void removeCharacterFromScenario(String id, String characterId) throws BadRequestException, NotFoundException {
		try{
		
			Character c = characterRepository.findById(characterId);
			if(c==null)
				throw new NotFoundException();
			
			Scenario scenario = scenarioRepository.removeCharacterFromScenario(id, characterId);
	
			if(scenario.getStatus().equals(ScenarioStatus.CREATED_V1) || 
					scenario.getStatus().equals(ScenarioStatus.CREATED_V2) || 
					scenario.getStatus().equals(ScenarioStatus.CREATED_V3) || 
					(c.getActualUser()==null && c.getPastUserId()==null)){
				characterRepository.removeCharacter(characterId);
			}else{
				
				characterRepository.putToDeletedCharacter(characterId);
				if(c.getActualUser()!=null){
					//TODO valutare la gestione di permessi multipli ovvero la possibilità che più user possano interpretare contemporanemente un personaggio
					userService.removeActualCharacterToUser(c.getActualUser().getId(), c.getId(),  id);
				}
				
			}
		}catch(MongoException e){
			throw e;
		}
	}


	@Override
	public Character updateUserCharacter(String scenarioId, String characterId, String userId)
			throws BadRequestException, NotFoundException {
		try{			
			User user = userRepository.findById(userId);
			if(user==null)
				throw new NotFoundException();
			if(!user.getStatus().equals(UserStatus.STATUS_APPROVED) && !user.getStatus().equals(UserStatus.STATUS_SUSPENDED))
				throw new NotFoundException();
			
			boolean founded=false;

			Character c = characterRepository.findById(characterId);
			if(c==null)
				throw new NotFoundException();
			
			if(!c.getScenarioId().equals(scenarioId))
				throw new BadRequestException();

			if(user.getOpenScenarios()!=null){
				for(ScenarioReference s : user.getOpenScenarios()){
					if(s.getId().equals(c.getScenarioId())){
						if(s.getMyCharacterId()!=null)
							throw new BadRequestException();
						founded=true;
						break;
					}
				}
			}
			
			if(!founded && user.getCreatingScenarios()!=null){
				for(ScenarioReference s : user.getCreatingScenarios()){
					if(s.getId().equals(c.getScenarioId())){
						if(s.getMyCharacterId()!=null)
							throw new BadRequestException();
						founded=true;
						break;
					}
				}
			}
			
			if(!founded){
				if(user.getInvitingScenariosId()!=null){
					for(String id : user.getInvitingScenariosId()){
						if(id.equals(c.getScenarioId())){
							founded=true;
							break;
						}
					}
				}
			}
			
			if(!founded)
				throw new BadRequestException();
			
			Scenario scen = scenarioRepository.findById(scenarioId);
			
			Reference ref = new Reference(user);
			
			Reference oldUser = c.getActualUser();
			
			Reference characterRef = new Reference(c);
			c.setActualUser(ref, scen.getStatus()); //il setter comporta aggiornamento mappa pastUser con relative date
			
			c = characterRepository.save(c);
			
			CharacterReference cRef = new CharacterReference(c);
			
			/*Togliendo il DBRef di Character all'interno di Scenario e inserendo un riferimento custom (CharacterReference), c'è la necessità
			 * di aggiornare il reference allo user che interpreta il character nel reference al character stesso presente nello Scenario.*/
			scenarioRepository.updateCharacterToScenario(cRef, scenarioId);
			
			/*Tutte le associazioni relative a User e Permission vengono fatte solo se lo stato dello scenario è ACTIVE.
			 * IN caso contrario mi preoccupo adesso solo di modificare il Reference dell'actualUser all'interno del Character (vedi sopra)
			 * e tutte le altre associazioni verranno create all'attivazione dello scenario in modo asincrono*/
			
			if(scen.getStatus().equals(ScenarioStatus.ACTIVE)){
			
				/*Gestione dei permessi: togliamo il permesso di scrittura sul character al vecchio possessore e lo assegniamo al nuovo*/
				if(oldUser!=null){
					userService.removeActualCharacterToUser(oldUser.getId(), characterRef.getId(), scenarioId);
				}
				
				userService.addActualCharacterToUser(userId, characterRef, scenarioId);
			}

			
			return c;
		}catch(MongoException e){
			throw e;
		}
	}


	@Override
	public void moveFromInvitedToAttendees(Reference userRef, String scenarioId) {
		Scenario scenario = scenarioRepository.moveFromInvitedToAttendees(userRef, scenarioId);
		if(scenario.getStatus().equals(ScenarioStatus.ACTIVE))
			permissionEvaluator.addPermission(userRef.getId(), Scenario.class, "WRITE", scenarioId);
	}


	@Override
	public void removeUserFromCharacter(String id, String characterId,
			String userId) throws NotFoundException, BadRequestException {
		
		Scenario scenario = scenarioRepository.findById(id);
		if(scenario==null)
			throw new NotFoundException();
		
		Character c = characterRepository.findById(characterId);
		if(c==null)
			throw new NotFoundException();
		
		if(!c.getActualUser().getId().equals(userId))
			throw new BadRequestException();
		
		c.setActualUser(null, scenario.getStatus());
		
		userService.removeActualCharacterToUser(userId, characterId, id);
		
		characterRepository.save(c);
		
		CharacterReference charRef = new CharacterReference(c);
		scenarioRepository.updateCharacterToScenario(charRef, id);
		
	}


	@Override
	public Id insertStatus(String scenarioId, String characterId, StatusDTO statusDTO, Authentication auth) throws BadRequestException, ForbiddenException {
		
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		
		Scenario scenario = scenarioRepository.findById(scenarioId);
		if(scenario==null)
			throw new BadRequestException();
		if(!scenario.getStatus().equals(ScenarioStatus.ACTIVE))
			throw new ForbiddenException();
		
		CharacterReference character=null;
		
		if(scenario.getCharacters()!=null){
			for(CharacterReference c : scenario.getCharacters()){
				if(c.getUserId()!=null){
					if(c.getId().equals(characterId) && c.getUserId().equals(user.getId())){
						character=c;
						break;
					}
				}
			}
		}
		if(character==null)
			throw new ForbiddenException();
		
			
		Reference userRef=null;
		if(scenario.getAttendees()!=null){
			for(Reference r : scenario.getAttendees()){
				if(r.getId().equals(character.getUserId())){
					userRef = r;
					break;
				}
			}
		}
		if(userRef==null){
			if(scenario.getCollaborators()!=null){
				for(Reference r : scenario.getCollaborators()){
					if(r.getId().equals(character.getUserId())){
						userRef = r;
						break;
					}
				}
			}
		}
		
		if(userRef==null){
			if(scenario.getTeacherCreator().getId().equals(character.getUserId()))
				userRef = scenario.getTeacherCreator();
		}
		
		if(userRef==null)
			throw new BadRequestException();
		
		Status status = new Status();
		status.setCharacter(character);
		status.setUser(userRef);
		status.setText(statusDTO.getText());
		status.setScenarioId(scenarioId);
		status.setPlace(statusDTO.getPlace());
		status.setHistoricalDate(statusDTO.getHistoricalDate());
		status.setSources(statusDTO.getSources());
		status.setImageId(statusDTO.getImageId());
		status.setFileId(statusDTO.getFileId());
		if(statusDTO.getStatus()==null)
			status.setStatus(PostStatus.PUBLISHED);
		else
			status.setStatus(statusDTO.getStatus());
	
		
		
		status = postRepository.save(status);
		
		if(status.getStatus().equals(PostStatus.PUBLISHED)){
			PostReference postReference = new PostReference(status);
			scenarioRepository.addPostToScenario(scenarioId, postReference);
			characterRepository.addPostToCharacter(character.getId(), postReference);
		}else{
			userRepository.addDraftPost(user.getId(), status.getId());
		}
		
		if(status.getImageId()!=null){
			fileMetadataRepository.addImageToPost(status.getImageId());
		}
		if(status.getFileId()!=null){
			fileMetadataRepository.addFileToPost(status.getFileId());
		}
		
		return new Id(status.getId());
	}


	@Override
	public Post getPost(String id, String postId, Authentication auth) throws NotFoundException {
		Post post = postRepository.findById(postId);
		CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		
		if(post==null || !post.getScenarioId().equals(id) || post.getStatus().equals(PostStatus.DELETED))
			throw new NotFoundException();
		
		if(post.getRevision().getStatus().equals(RevisionStatus.TO_MODIFY_NOT_VISIBLE)){
			if(user.getId().equals(post.getUser().getId()) || permissionEvaluator.hasPermission(auth, id, "Scenario", "MODERATOR"))
				return post;
			else
				throw new NotFoundException();
		}
		
		return post;
	}


	//Questo metodo � pensato per ritornare la lista paginata di post dello Scenario con quello scenarioId se characterId=null,
	//in caso contrario ritorna la lista paginata di post del Character con quel characterId se esiste all'interno dello Scenario con quello scenarioId
	@Override
	public Page<Post> getPagedPosts(String scenarioId, String characterId, Integer nPag,
			Integer nItem, Boolean historicOrder, Authentication auth) throws NotFoundException {
		CustomUserDetails activeUser = (CustomUserDetails) auth.getPrincipal();
		List<PostReference> posts;
		/*Utilizziamo la stessa funzione per la stessa funzione per fare la get dei post dello scenario o del character*/
		if(characterId==null){
			Scenario scenario = scenarioRepository.findById(scenarioId);
			if(scenario==null)
				throw new NotFoundException();
			posts = scenario.getPosts();
		}else{
			Character character = characterRepository.findById(characterId);
			if(character==null || character.getScenarioId() != scenarioId)
				throw new NotFoundException();
			posts = character.getPosts();
		}
		
		
		Pageable p;
		if(historicOrder)
			p = new PageRequest(nPag, nItem, Sort.Direction.DESC, "historicalDate");
		else
			p = new PageRequest(nPag, nItem, Sort.Direction.DESC, "creationDate");

		
		 
		if(posts==null || posts.size()==0){
			List<Post> returnPost = new ArrayList<Post>();
			return new PageImpl<Post>(returnPost, p, 0);
		}
		
		int size = posts.size();
		int totalPage = ((int) Math.ceil((double)size/nItem));
		
		if((nPag+1)>totalPage){
			System.out.println("inErrorIf - totalPage= "+totalPage+" "+size+" "+nItem+" "+nPag);
			List<Post> returnPost = new ArrayList<Post>();
			return new PageImpl<Post>(returnPost, p, size);
		}
		
		List<PostReference> toSearch=null;
		List<String> postsId = new ArrayList<String>();

		if(historicOrder){
			Collections.sort(posts, new PostReferenceHistoricalDateComparator());
		}
		
		int end = (size-1)-(nPag*nItem);
		int start = end-(nItem-1);
		if(start<0)
			start=0;
		toSearch = posts.subList(start, end+1);
		System.out.println("toSearch.size= "+toSearch.size()+"start "+start+" end "+end);
		if(toSearch!=null){
			for(PostReference postRef : toSearch)
				postsId.add(postRef.getId());
				
		}
	
		boolean moderator = permissionEvaluator.hasPermission(auth, scenarioId, "Scenario", "MODERATOR");
		
		return postRepository.customPageableFindAll(postsId,size,p,historicOrder,activeUser.getId(), moderator);
	}


	@Override
	public Id insertEvent(String scenarioId, EventDTO eventDTO, CustomUserDetails activeUser) throws BadRequestException {
		

		Scenario scenario = scenarioRepository.findById(scenarioId);
		User u = userRepository.findById(activeUser.getId());
		if(scenario==null || u==null)
			throw new BadRequestException();


		Event event = new Event();
		event.setText(eventDTO.getText());
		event.setType(eventDTO.getType());
		event.setMedia(eventDTO.getMedia());
		event.setPlace(eventDTO.getPlace());
		event.setScenarioId(scenarioId);
		event.setHistoricalDate(eventDTO.getHistoricalDate());
		event.setTags(eventDTO.getTags());
		if(eventDTO.getStatus()==null)
			event.setStatus(PostStatus.PUBLISHED);
		else
			event.setStatus(eventDTO.getStatus());
		event.setText(eventDTO.getText());
		event.setUser(new Reference(u));
		
		event = postRepository.save(event);

		if(event.getStatus().equals(PostStatus.PUBLISHED)){
			PostReference postReference = new PostReference(event);
			scenarioRepository.addPostToScenario(scenarioId, postReference);
		}else{
			userRepository.addDraftPost(activeUser.getId(), event.getId());
		}

		return new Id(event.getId());
	}


	@Override
	public Post updateStatus(String id, String statusId, StatusDTO statusDTO, Authentication auth) throws NotFoundException, ForbiddenException, BadRequestException {
		/*Prelevo il post dal database e controllo che esso esista e sia di tipo Status (per gli update di Event ci sarà un API apposita così
		 * da controllare i permessi direttamente sul controller)*/
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		Post post =  postRepository.findById(statusId);
		if(post==null || !post.getClass().equals(Status.class))
			throw new NotFoundException();
		
		if(post.getStatus().equals(PostStatus.DELETED))
			throw new NotFoundException();
		
		List<Role> roles = (List<Role>) user.getAuthorities();
		Status status = (Status) post;
		Scenario scenario;
		boolean permit=false;
		Date now=null;
		
		/*START PERMISSION CHECK*/
		for(Role role : roles){
			if(role.getAuthority().equals("ROLE_ADMIN"))
				permit=true;
		}
		/*Check user is SYSTEM ADMIN*/
			
		/**/
		
		/*Controllo se l'utente che chiede di fare la modifica è il creatore del post e se ha ancora i permessi
		 * per modificare il post stesso*/
		if(status.getUser().getId().equals(user.getId()) && 
				permissionEvaluator.hasPermission(auth, status.getCharacter().getId(), "Character", "WRITE")){
			permit=true;
		}
		/*Se il richiedente non è il creatore, valuto la possibilità di altri permessi a condizione che lo Status sia PUBLISHED (una bozza
		 * è modificabile dal solo creatore del post)*/
		if(!permit && status.getStatus().equals(PostStatus.PUBLISHED)){
			/*Se uno dei due controlli fallisce valuto la possibilità che a fare l'operazione voglia essere il creator dello Scenario*/
			scenario = scenarioRepository.findById(id);
			if(scenario.getTeacherCreator().getId().equals(user.getId())){
				permit=true;
			}
			/*Se non si tratta del creatore controllo che l'utente che ha fatto richiesta di update sia presente nella lista di collaborators
			 * dello scenario e che sia un Teacher (questo lo posso controllare guardando il ruolo presente nelle Authorities dell'oggetto
			 * di security).*/
			if(!permit){
				/*S*/
				if(scenario.getCollaborators()!=null){
					for(Reference r : scenario.getCollaborators()){
						if(r.getId().equals(user.getId())){
							for(Role role : roles){
								if(role.getAuthority().equals("ROLE_TEACHER"))
									permit=true;
							}
							break;
						}
					}
				}
			}
		}
		
		/*Se dopo tutti i controlli effettuati permit è ancora a false rilancio una ForbiddenException*/
		if(!permit)
			throw new ForbiddenException();
		
		/*END PERMISSION CHECK*/
		
		/*TODO da continuare*/
		Update u = new Update();
		boolean toPublish=false;
		boolean updateHistoricalDate=false;
		
		if(statusDTO.getText()!=null){
			u.set("text", statusDTO.getText());
		}
		if(statusDTO.getHistoricalDate()!=null){
			u.set("historicalDate", statusDTO.getHistoricalDate());
			if(status.getStatus().equals(PostStatus.PUBLISHED))
				updateHistoricalDate=true;
		}
		if(statusDTO.getPlace()!=null){
			u.set("place", statusDTO.getPlace());
		}
		if(statusDTO.getStatus()!=null){
			if(status.getStatus().equals(PostStatus.DRAFT) && statusDTO.getStatus().equals(PostStatus.PUBLISHED)){
				toPublish=true;
				u.set("status", statusDTO.getStatus());
				now = new Date();
				u.set("creationDate", now);
				userRepository.removeDraftPost(user.getId(), post.getId());
			}
		}
		if(statusDTO.getSources()!=null){
			u.set("sources", statusDTO.getSources());
		}
		if(statusDTO.getImageId()!=null){
			u.set("imageId",statusDTO.getImageId());
			fileMetadataRepository.addImageToPost(statusDTO.getImageId());
		}
		if(statusDTO.getFileId()!=null){
			u.set("fileId",statusDTO.getFileId());
			fileMetadataRepository.addFileToPost(statusDTO.getFileId());
		}
		
		u.set("lastChangeDate", new Date());

		
		Status newStatus = (Status) postRepository.updatePost(statusId,u);
		
		if (newStatus == null)
			throw new BadRequestException();
		
		if(toPublish){
			PostReference postRef = new PostReference(newStatus);
			scenarioRepository.addPostToScenario(newStatus.getScenarioId(), postRef);
			characterRepository.addPostToCharacter(newStatus.getCharacter().getId(), postRef);
		}
		if(!toPublish && updateHistoricalDate){
			PostReference postRef = new PostReference(newStatus);
			scenarioRepository.updatePostDateInScenario(newStatus.getScenarioId(), postRef);
		}
		return newStatus;
	}


	@Override
	public Post updateEvent(String id, String eventId, EventDTO eventDTO,
			CustomUserDetails activeUser) throws NotFoundException, ForbiddenException, BadRequestException {
		/*Prelevo il post dal database e controllo che esso esista e sia di tipo Event */
		
		Post post =  postRepository.findById(eventId);
				
		if(post==null || !post.getClass().equals(Event.class))
			throw new NotFoundException();
		
		if(post.getStatus().equals(PostStatus.DELETED))
			throw new NotFoundException();
		
		Event event = (Event) post;
		
		boolean permit=false;
		Date now=null;
		
		if(!event.getUser().getId().equals(activeUser.getId())){
		
			List<Role> roles = (List<Role>) activeUser.getAuthorities();
			for(Role role : roles){
				if(role.getAuthority().equals("ROLE_TEACHER"))
					permit=true;
			}
		}else
			permit=true;
		
		if(!permit)
			throw new ForbiddenException();
		
		Update u = new Update();
		boolean toPublish=false;
		boolean updateHistoricalDate=false;
		
		if(eventDTO.getText()!=null){
			u.set("text", eventDTO.getText());
		}
		if(eventDTO.getHistoricalDate()!=null){
			u.set("historicalDate", eventDTO.getHistoricalDate());
			if(event.getStatus().equals(PostStatus.PUBLISHED))
				updateHistoricalDate=true;
		}
		if(eventDTO.getPlace()!=null){
			u.set("place", eventDTO.getPlace());
		}
		if(eventDTO.getStatus()!=null){
			if(event.getStatus().equals(PostStatus.DRAFT) && eventDTO.getStatus().equals(PostStatus.PUBLISHED)){
				toPublish=true;
				u.set("status", eventDTO.getStatus());
				now = new Date();
				u.set("creationDate", now);
				userRepository.removeDraftPost(activeUser.getId(), post.getId());
			}
		}
		
		if(eventDTO.getMedia()!=null){
			u.set("media",eventDTO.getMedia());
		}
		
		u.set("lastChangeDate", new Date());
		

		Event newEvent = (Event) postRepository.updatePost(eventId,u);
		
		if (newEvent == null)
			throw new BadRequestException();
		
		if(toPublish){
			PostReference postRef = new PostReference(newEvent);
			scenarioRepository.addPostToScenario(newEvent.getScenarioId(), postRef);
		}
		if(!toPublish && updateHistoricalDate){
			PostReference postRef = new PostReference(newEvent);
			scenarioRepository.updatePostDateInScenario(newEvent.getScenarioId(), postRef);
		}
		return newEvent;
	}


	@Override
	public void deletePost(String id, String postId, Authentication auth) throws BadRequestException, ForbiddenException, NotFoundException {
		
		Post post = postRepository.findById(postId);
		if(post==null)
			throw new NotFoundException();
		if(post.getStatus().equals(PostStatus.DELETED))
			throw new NotFoundException();
		if(post.getClass().equals(Relation.class) || !id.equals(post.getScenarioId()))
			throw new BadRequestException();
		
		CustomUserDetails activeUser = (CustomUserDetails) auth.getPrincipal();
		boolean permit=false;
		User user;
		
		if(post.getClass().equals(Status.class)){
			Status status = (Status) post;
			if(post.getUser().getId().equals(activeUser.getId())){
				if(permissionEvaluator.hasPermission(auth, status.getCharacter().getId(), "Character", "WRITE"))
					permit=true;
			}else{
				if(post.getStatus().equals(PostStatus.PUBLISHED) && permissionEvaluator.hasPermission(auth, status.getScenarioId(), "Scenario", "MODERATOR")){
					user = userRepository.findById(activeUser.getId());
					if(user.getClass().equals(Teacher.class))
						permit=true;
				}
			}
				
		}else if (post.getClass().equals(Event.class)){
			Event event = (Event) post;
			if(permissionEvaluator.hasPermission(auth, event.getScenarioId(), "Scenario", "MODERATOR")){
				if(event.getUser().getId().equals(activeUser.getId()))
					permit=true;
				else{
					if(post.getStatus().equals(PostStatus.PUBLISHED)){
						user = userRepository.findById(activeUser.getId());
						if(user.getClass().equals(Teacher.class))
							permit=true;
					}
				}
			}
		}
		
		if(!permit)
			throw new ForbiddenException();
		
		if(post.getStatus().equals(PostStatus.DRAFT)){
		//TODO valutare cancellazione bozze da eventuali liste aggiunte ad utente
			userRepository.removeDraftPost(activeUser.getId(), post.getId());
			postRepository.deletePost(post.getId());
		}
		else{
			scenarioRepository.removePost(post.getScenarioId(), post.getId());
			if(post.getClass().equals(Status.class)){
				Status s = (Status) post;
				characterRepository.removePostFromCharacter(s.getCharacter().getId(), post.getId());
			}
			postRepository.putInDeleteStatus(post.getId());
		}

	}


	@Override
	public void insertRevision(String scenarioId, String postId, RevisionDTO revisionDTO,
			CustomUserDetails activeUser) throws BadRequestException {
		
		Revision revision = new Revision();
		revision.setComment(revisionDTO.getComment());
		revision.setStatus(revisionDTO.getStatus());
		User user = userRepository.findById(activeUser.getId());
		revision.setRevisor(new Reference(user));
		
		if(!postRepository.addRevision(postId, scenarioId, revision))
			throw new BadRequestException();
	}


	@Override
	public Id insertComment(String idScenario, String postId,
			CommentDTO commentDTO, Authentication auth) throws ForbiddenException, BadRequestException {
		
		CustomUserDetails activeUser = (CustomUserDetails) auth.getPrincipal();
		User user = userRepository.findById(activeUser.getId());
		
		boolean hasPermission = false;
		Reference charRef = null;
		
		if(user.getOpenScenarios()!=null){
			for(ScenarioReference scenRef : user.getOpenScenarios()){
				if(scenRef.getId().equals(idScenario)){
					if(scenRef.getMyCharacterId()!=null){
						if(permissionEvaluator.hasPermission(auth, scenRef.getMyCharacterId(), "Character", "WRITE")){
							charRef = new Reference();
							charRef.setId(scenRef.getMyCharacterId());
							charRef.setCover(scenRef.getMyCharacterCover());
							charRef.setFirstname(scenRef.getMyCharacterName());
							hasPermission=true;
						}
					}
					break;
				}
			}
		}
		
		if(!hasPermission)
			throw new ForbiddenException();
		
		Reference userReference = new Reference(user);
		
		Comment comment = new Comment(charRef, commentDTO, userReference);
		if(!postRepository.addComment(idScenario, postId, comment))
			throw new BadRequestException();
		
		return new Id(comment.getId());
	}
	
	@Override
	public Id insertMetaComment(String idScenario, String postId,
			CommentDTO commentDTO, Authentication auth) throws ForbiddenException, BadRequestException {
		
		CustomUserDetails activeUser = (CustomUserDetails) auth.getPrincipal();
		User user = userRepository.findById(activeUser.getId());
		
		Reference userReference = new Reference(user);
		
		MetaComment metaComment = new MetaComment(commentDTO, userReference);
		if(!postRepository.addComment(idScenario, postId, metaComment))
			throw new BadRequestException();
		
		return new Id(metaComment.getId());
	}


	@Override
	public CommentInterface updateComment(String idScenario, String postId,
			String commentId, CommentDTO commentDTO, Authentication auth, boolean isMetaComment) throws NotFoundException, ForbiddenException {
		
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		Post post =  postRepository.findById(postId);
		CommentInterface commentInterface=null;
		Comment comment;
		MetaComment metaComment;
		if(post==null)
			throw new NotFoundException();
		
		if(post.getStatus().equals(PostStatus.DELETED))
			throw new NotFoundException();
		
		if(isMetaComment){
			if(post.getMetaComments()==null)
				throw new NotFoundException();
			for(MetaComment m : post.getMetaComments()){
				if(m.getId().equals(commentId)){
					commentInterface = m;
					break;
				}
			}
		}else{
			if(post.getComments()==null)
				throw new NotFoundException();
			for(Comment c : post.getComments()){
				if(c.getId().equals(commentId)){
					commentInterface = c;
					break;
				}
			}
		}
		
		if(commentInterface==null)
			throw new NotFoundException();
		
		List<Role> roles = (List<Role>) user.getAuthorities();
		Scenario scenario;
		boolean permit=false;
		
		/*START PERMISSION CHECK*/
		for(Role role : roles){
			if(role.getAuthority().equals("ROLE_ADMIN"))
				permit=true;
		}
		/*Check user is SYSTEM ADMIN*/
			
		/**/
		
		/*Controllo se l'utente che chiede di fare la modifica è il creatore del post e se ha ancora i permessi
		 * per modificare il post stesso*/
		if(!permit){
			if(isMetaComment){
				if(commentInterface.getUser().getId().equals(user.getId())){
					permit=true;
				}
			}else{
				comment = (Comment) commentInterface;
				if(commentInterface.getUser().getId().equals(user.getId()) && permissionEvaluator.hasPermission(auth, comment.getCharacter().getId(), "Character", "WRITE")){
					permit=true;
				}
			}
		}
		/*Se il richiedente non è il creatore, valuto la possibilità di altri permessi a condizione che lo Status sia PUBLISHED (una bozza
		 * è modificabile dal solo creatore del post)*/
		if(!permit){
			/*Se uno dei due controlli fallisce valuto la possibilità che a fare l'operazione voglia essere il creator dello Scenario*/
			scenario = scenarioRepository.findById(idScenario);
			if(scenario.getTeacherCreator().getId().equals(user.getId())){
				permit=true;
			}
			/*Se non si tratta del creatore controllo che l'utente che ha fatto richiesta di update sia presente nella lista di collaborators
			 * dello scenario e che sia un Teacher (questo lo posso controllare guardando il ruolo presente nelle Authorities dell'oggetto
			 * di security).*/
			if(!permit && scenario.getCollaborators()!=null){
				for(Reference r : scenario.getCollaborators()){
					if(r.getId().equals(user.getId())){
						for(Role role : roles){
							if(role.getAuthority().equals("ROLE_TEACHER"))
								permit=true;
						}
						break;
					}
				}
			}
			
		}
		
		/*Se dopo tutti i controlli effettuati permit è ancora a false rilancio una ForbiddenException*/
		if(!permit)
			throw new ForbiddenException();
		
		/*END PERMISSION CHECK*/
		
		if(commentDTO.getText()!=null){
			commentInterface.setText(commentDTO.getText());
		}
		if(commentDTO.getTags()!=null){
			commentInterface.setTags(commentDTO.getTags());
		}
		commentInterface.setLastChangeDate(new Date());
		
		if(isMetaComment){
			metaComment = (MetaComment) commentInterface;
			postRepository.updateComment(idScenario,postId,metaComment);
			return metaComment;
		}else{
			comment = (Comment) commentInterface;		
			postRepository.updateComment(idScenario,postId,comment);
			return comment;
		}
		
		
		
	}


	@Override
	public void deleteComment(String idScenario, String postId, String commentId,
			Authentication auth, boolean isMetaComment) throws NotFoundException, ForbiddenException {
		

		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		Post post =  postRepository.findById(postId);
		CommentInterface commentInterface=null;
		Comment comment;
		MetaComment metaComment;
		if(post==null)
			throw new NotFoundException();
		
		if(post.getStatus().equals(PostStatus.DELETED))
			throw new NotFoundException();
		
		if(isMetaComment){
			if(post.getMetaComments()==null)
				throw new NotFoundException();
			for(MetaComment m : post.getMetaComments()){
				if(m.getId().equals(commentId)){
					commentInterface = m;
					break;
				}
			}
		}else{
			if(post.getComments()==null)
				throw new NotFoundException();
			for(Comment c : post.getComments()){
				if(c.getId().equals(commentId)){
					commentInterface = c;
					break;
				}
			}
		}
		
		if(commentInterface==null)
			throw new NotFoundException();
		
		List<Role> roles = (List<Role>) user.getAuthorities();
		Scenario scenario;
		boolean permit=false;
		
		/*START PERMISSION CHECK*/
		for(Role role : roles){
			if(role.getAuthority().equals("ROLE_ADMIN"))
				permit=true;
		}
		/*Check user is SYSTEM ADMIN*/
			
		/**/
		
		/*Controllo se l'utente che chiede di fare la modifica è il creatore del post e se ha ancora i permessi
		 * per modificare il post stesso*/
		if(!permit){
			if(isMetaComment){
				if(commentInterface.getUser().getId().equals(user.getId())){
					permit=true;
				}
			}else{
				comment = (Comment) commentInterface;
				if(commentInterface.getUser().getId().equals(user.getId()) && permissionEvaluator.hasPermission(auth, comment.getCharacter().getId(), "Character", "WRITE")){
					permit=true;
				}
			}
		}
		/*Se il richiedente non è il creatore, valuto la possibilità di altri permessi a condizione che lo Status sia PUBLISHED (una bozza
		 * è modificabile dal solo creatore del post)*/
		if(!permit){
			/*Se uno dei due controlli fallisce valuto la possibilità che a fare l'operazione voglia essere il creator dello Scenario*/
			scenario = scenarioRepository.findById(idScenario);
			if(scenario.getTeacherCreator().getId().equals(user.getId())){
				permit=true;
			}
			/*Se non si tratta del creatore controllo che l'utente che ha fatto richiesta di update sia presente nella lista di collaborators
			 * dello scenario e che sia un Teacher (questo lo posso controllare guardando il ruolo presente nelle Authorities dell'oggetto
			 * di security).*/
			if(!permit && scenario.getCollaborators()!=null){
				for(Reference r : scenario.getCollaborators()){
					if(r.getId().equals(user.getId())){
						for(Role role : roles){
							if(role.getAuthority().equals("ROLE_TEACHER"))
								permit=true;
						}
						break;
					}
				}
			}
			
		}
		
		/*Se dopo tutti i controlli effettuati permit è ancora a false rilancio una ForbiddenException*/
		if(!permit)
			throw new ForbiddenException();
		
		/*END PERMISSION CHECK*/
		
		postRepository.removeComment(idScenario, postId, commentInterface);
		
	}


	@Override
	public void addLikeToPost(String id, String postId, Authentication auth) throws NotFoundException, BadRequestException {
		CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		Post post = postRepository.findById(postId);
		
		if(post==null || !post.getScenarioId().equals(id))
			throw new NotFoundException();
		
		Scenario scenario = scenarioRepository.findById(id);
		if(scenario==null)
			throw new NotFoundException();
		
		CharacterReference charRef = null;
		
		if(scenario.getCharacters()!=null){
			for(CharacterReference c : scenario.getCharacters()){
				
				if(c.getUserId()!=null && c.getUserId().equals(user.getId())){
					charRef=c;
					break;
				}
			}
		}
		
		if(charRef==null)
			throw new BadRequestException();
		
		post.addLike(charRef);
		postRepository.save(post);
	}


	@Override
	public List<Character> getAllCharacters(String scenarioId) {
		return characterRepository.getAllCharactersFromScenario(scenarioId);
		
	}
}
