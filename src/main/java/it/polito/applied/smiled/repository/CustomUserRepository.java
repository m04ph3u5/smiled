package it.polito.applied.smiled.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.query.Update;

import it.polito.applied.smiled.dto.FirstPasswordDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.User;

public interface CustomUserRepository {
	
	public String updateToApproveUserStatus(String email);
	public void deletePendingByEmail(String email);
	public User addTeacherToStudent(String id, Reference teacher);
	public int changePassword(String userEmail, String newPassword);
	public int openScenarioToUser(String id, ScenarioReference scenario);
	
	public int insertInCreatedScenarioOfUser(String id, ScenarioReference scenario);
	public User updateUser(Update update, String userEmail);
	public User changeFirstPassword(FirstPasswordDTO firstPassword, String hashNewPassword);
	public int updateTeachersListReference(String id, Reference newRef);
	public int updateColleaguesListReference(String id, Reference newRef);
	public int updateStudentsListReference(String id, Reference newRef);
	public int updateFriendsListReference(String id, Reference newRef);
	public Page<User> getPagingUsers(Integer nPag, Integer nItem, int type);
	
	
	
	public int removeScenarioFromUser(String userToRemove, String id);
	public int removeScenarioFromUsers(List<String> usersToRemove, String id);
	public int openScenarioToUsers(List<String> l, ScenarioReference scen);
	
	public int addStudentToTeacher(String id, Reference ref);
	public boolean addInvitingScenario(String userId, String scenarioId);
	public boolean deleteScenarioFromCreator(String creatorId, String scenarioId);
	public boolean removeScenarioAndSaveInBlockedList(String userToDelete,
			String id);
	public boolean removeActualCharacterToUser(String userId, String characterId,
			String scenarioId);
	public boolean addActualCharacterToUser(String userId, Reference characterRef,
			String scenarioId);

	public boolean moveScenarioFromOpenToInviting(String collaboratorId,
			String scenarioId);
	public boolean removeDraftPost(String userId, String postId);
	public boolean addDraftPost(String userId, String postId);
	public boolean setCover(String userId, String coverId);
	public int createScenarioToUser(String id,	ScenarioReference scenarioReference);
	public boolean addColleagueToTeacher(String id, Reference r);

	public Page<User> getPagingTeachersByRegex(String regex, Integer nPag,
			Integer nItem) throws BadRequestException;

	public boolean setCoverLarge(String userId, String coverId);
	public boolean updateNameOfOneScenarioReference(String userId, Scenario scenario, String newNameOfScenario);
	public boolean updateNameOfAllScenarioReference( List<String> idOfPeopleToUpdate, Scenario scenario,
			String newScenarioName);

}
