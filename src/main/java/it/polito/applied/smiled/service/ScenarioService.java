package it.polito.applied.smiled.service;

import java.io.IOException;
import java.util.List;

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
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.CommentDTO;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.Mission;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.security.CustomUserDetails;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;

import com.mongodb.MongoException;

public interface ScenarioService {

	public String createScenario(ScenarioDTO scenarioDTO, String email)
			throws MongoException, BadRequestException, IllegalStateException, IOException;public List<Reference> getAllScenariosUsers(String id) throws MongoException, NotFoundException;
	
			public List<Reference> subscribeStudentIfNotPresent(List<EmailDTO> studentsEmail, String teacherId, String scenarioId) throws MongoException, BadRequestException;
	
	public void removeUserFromScenario(String id, String userToDelete) throws MongoException, BadRequestException;
	public Scenario getScenario(String id) throws MongoException, NotFoundException;
	
	public Scenario updateScenario(String id, ScenarioDTO scenario, String email)
			throws MongoException, BadRequestException, IllegalStateException, IOException;
	
	public void removeScenario(String id) throws BadRequestException;
	
	public List<Reference> getAllScenariosCollaborators(String id)
			throws MongoException, NotFoundException;
	
    public Reference addCollaboratorToScenario(String collaboratorEmail, String idScenario)
			throws BadRequestException, NotFoundException;
	
	//public Reference subscribeTeacherIfNotPresent(String email,	String id) throws BadRequestException;
	
	public void removeCollaboratorFromScenario(String id, String collaboratorToDelete, boolean putInAttendeesList)
			throws MongoException, BadRequestException;
	
	public Id addCharacterToScenario(CharacterDTO characterDTO, String scenarioId, String userId) throws BadRequestException;
	
	public Character getCharacter(String scenarioId, String characterId) throws NotFoundException, BadRequestException;
	
	public Character updateCharacter(String scenarioId, CharacterDTO characterDTO) throws BadRequestException, NotFoundException;

	public void removeCharacterFromScenario(String id, String characterId) throws BadRequestException, NotFoundException;
	
	public Character updateUserCharacter(String scenarioId, String characterId, String userId) throws BadRequestException, NotFoundException;

	public void moveFromInvitedToAttendees(Reference userRef, String id);

	public void removeUserFromCharacter(String id, String characterId,
			String userId) throws NotFoundException, BadRequestException;

	public Id insertStatus(String idScenario, String characterId, StatusDTO statusDTO, Authentication auth) throws BadRequestException, ForbiddenException, IOException;

	public Post getPost(String id, String postId, Authentication auth) throws NotFoundException;

	public Page<Post> getPagedPosts(String scenarioId, String characterId, Integer nPag,
			Integer nItem, Boolean historicOrder, Boolean orderDesc, Authentication auth) throws NotFoundException, BadRequestException;

	public Id insertEvent(String scenarioId, EventDTO eventDTO, CustomUserDetails activeUser) throws BadRequestException, ForbiddenException, IOException;

	public Post updateStatus(String id, String statusId, StatusDTO status, Authentication auth) throws NotFoundException, ForbiddenException, BadRequestException, IOException;

	public Post updateEvent(String id, String eventId, EventDTO event,
			CustomUserDetails activeUser) throws NotFoundException, ForbiddenException, BadRequestException, IOException;

	public void deletePost(String id, String postId, Authentication auth) throws BadRequestException, ForbiddenException, NotFoundException;

	public void insertRevision(String id, String postId, RevisionDTO revision,
			CustomUserDetails activeUser) throws BadRequestException;
	
	public Id insertComment(String idScenario, String postId, CommentDTO commentDTO, Authentication auth) throws ForbiddenException, BadRequestException;
	public Id insertMetaComment(String idScenario, String postId, CommentDTO commentDTO, Authentication auth) throws ForbiddenException, BadRequestException;
	
	public CommentInterface updateComment(String idScenario, String postId, String commentId, CommentDTO commentDTO, Authentication auth, boolean isMetaComment) throws NotFoundException, ForbiddenException;

	public void deleteComment(String id, String postId, String commentId,
			Authentication auth, boolean isMetaComment) throws NotFoundException, ForbiddenException;

	public void addLikeToPost(String id, String postId, Authentication auth) throws NotFoundException, BadRequestException;

	public List<Character> getAllCharacters(String scenarioId);

	public Scenario addMissionToScenario(String id, MissionDTO mission, CustomUserDetails activeUser) throws BadRequestException;
	
	public Character addMissionToCharacter(String idCharacter, MissionDTO mission, CustomUserDetails activeUser) throws BadRequestException;

	public List<Action> getSocialGraph(String id) throws NotFoundException;
	
	public boolean deleteMissionToCharacter(String idCharacter)throws BadRequestException;
	
	public boolean deleteMissionToScenario(String idScenario)throws BadRequestException;

	
}
