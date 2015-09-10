package it.polito.applied.smiled.service;

import it.polito.applied.smiled.dto.EmailDTO;
import it.polito.applied.smiled.dto.FirstPasswordDTO;
import it.polito.applied.smiled.dto.RegisterTeacherDTO;
import it.polito.applied.smiled.dto.UserDTO;
import it.polito.applied.smiled.exception.BadCredentialsException;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.InvalidRegistrationTokenException;
import it.polito.applied.smiled.exception.RegistrationTokenExpiredException;
import it.polito.applied.smiled.exception.UserAlreadyExistsException;
import it.polito.applied.smiled.exception.UserNotFoundException;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.Message;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.security.CustomUserDetails;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.MongoDataIntegrityViolationException;

import com.mongodb.MongoException;

public interface UserService {

	public UserDTO getOneself(String userEmail) throws UserNotFoundException, MongoException;
	public UserDTO updateUserProfile(String userEmail, UserDTO userDTO) throws MongoException, BadRequestException;
	public void changePassword(String userEmail, String oldPassword, String newPassword) throws MongoException, BadCredentialsException, UserNotFoundException, BadRequestException;
	public void changeFirstPassword(FirstPasswordDTO firstPassword) throws UserNotFoundException, BadCredentialsException, BadRequestException;


	public void registerTeacher(RegisterTeacherDTO teacher) throws MongoException, UserAlreadyExistsException, BadRequestException, MongoDataIntegrityViolationException;
	public void deleteExpiredRegistrationAccount(String userEmail);
	public void confirmRegistration(String token, String email) throws MongoException, InvalidRegistrationTokenException, UserNotFoundException, RegistrationTokenExpiredException;
	
	public Page<UserDTO> getAllUsers(Integer nPag, Integer nItem) throws BadRequestException;
	public UserDTO getUserById(String id) throws UserNotFoundException;
	
	//TODO
	/*PENSARE IMPLEMENTAZIONE MESSAGGI*/
	public List<Message> getUserMessages(String userEmail, Integer nPag, Integer nItem);
	public List<Message> getUserMessagesWithYou(String userEmail, String idOtherUser, Integer nPag, Integer nItem);
	//Questo metodo inserisce un oggetto message nel DB, invia il messaggio al destinatario (in qualche modo) e restituisce l'id del messaggio creato
	public Id sendMessage(Message message);
	public void deleteMessage(String idMessage, String userEmail);
	public int removeScenarioFromUser(String userToDelete, String id);
	public int removeScenarioFromUsers(List<String> usersToDelete, String id);

	public void openScenarioOfUser(Reference user, ScenarioReference scenarioRef);
	public void openScenarioOfUsers(List<Reference> l, ScenarioReference scen);
	public void closeScenarioOfUsers(String scenarioId, String callerId ,List<String> usersId);
	public void closeScenarioOfUser(String scenarioId, String userId);
	public void openScenarioOfUsers(ScenarioReference scenario, List<String> usersId);
	public void deleteScenarioFromCreator(String id, String id2);
	public void removeScenarioAndSaveInBlockedList(String userToDelete, String id);
	public void removeActualCharacterToUser(String id, String id2,
			String scenarioId);
	public void addActualCharacterToUser(String userId, Reference characterRef,
			String scenarioId);
	
	public void addStudentToTeacher(String teacherId, Reference studentRef);
	public void addTeacherToStudent(String studentId, Reference teacherRef, boolean setPermission);
	public void addColleagueToTeacher(String teacherId, Reference colleague);
	public void addFriendToStudent(String studentId, Reference friend);
	public void moveScenarioFromOpenToInviting(String collaboratorId, String id);
	public void createScenarioOfUser(Reference r,
			ScenarioReference scenarioReference);
	public boolean inviteTeacherIfNotPresent(String email, String teacherInviterId) throws BadRequestException;	
	
}
