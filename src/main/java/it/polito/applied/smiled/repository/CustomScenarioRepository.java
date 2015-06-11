package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;

import org.springframework.data.mongodb.core.query.Update;


public interface CustomScenarioRepository {

	public Scenario updateScenario(String id, Update update);
	public boolean removeUserFromScenario(String scenarioId, ScenarioStatus status, String userId);
//	public boolean addUsersToScenario(List<Reference> l, ScenarioStatus status, String scenarioId);
	public boolean addCollaborator(Reference c, ScenarioStatus status, String scenarioId, boolean removeFromAttendees);	
	public void removeScenario(String id);
	public boolean removeCollaboratorFromScenario(String scenarioId, ScenarioStatus status, Reference collaborator,
			boolean putInAttendeesList);
	public int updateTeacherCollaboratorListReference(String id,
			Reference newRef);
	public int updateAttendeesListReference(String id, Reference newRef);
	public int updateTeacherCreatorReference(String id, Reference newRef);
	boolean addCharacter(CharacterReference c, String scenarioId, ScenarioStatus status);
	public Scenario removeCharacterFromScenario(String id, String characterId);
	public boolean addUserToInvited(String scenarioId, Reference ref);
	boolean addAttendeeToScenario(Reference user, ScenarioStatus status,
			String scenarioId);
	public boolean putInDeletedState(String id);
	public Scenario moveFromInvitedToAttendees(Reference userRef, String scenarioId);
	public boolean addPostToScenario(String scenarioId, PostReference postReference);
	public boolean updatePostDateInScenario(String scenarioId,
			PostReference postRef);
	public boolean updateCharacterToScenario(CharacterReference charRef,
			String scenarioId);
	public boolean removePost(String scenarioId, String id);
	public boolean setCover(String scenarioId, String metadataId);

}
