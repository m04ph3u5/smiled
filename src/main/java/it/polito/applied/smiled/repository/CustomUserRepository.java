package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.dto.FirstPasswordDTO;
import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.User;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.query.Update;

public interface CustomUserRepository {
	
	public int updateToApproveUserStatus(String email);
	public void deletePendingByEmail(String email);
	public User addTeacherToStudent(String id, Reference teacher);
	public int changePassword(String userEmail, String newPassword);
	public int openScenarioToUser(String id, ScenarioReference scenario);
	public User updateUser(Update update, String userEmail);
	public User changeFirstPassword(FirstPasswordDTO firstPassword, String hashNewPassword);
	public int updateTeachersListReference(String id, Reference newRef);
	public int updateColleaguesListReference(String id, Reference newRef);
	public int updateStudentsListReference(String id, Reference newRef);
	public int updateFriendsListReference(String id, Reference newRef);
	public Page<User> getPagingUsers(Integer nPag, Integer nItem);
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



}
