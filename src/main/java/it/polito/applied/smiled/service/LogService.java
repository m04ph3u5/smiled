package it.polito.applied.smiled.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.InfoStatistics;
import it.polito.applied.smiled.pojo.Log;
import it.polito.applied.smiled.pojo.LogType;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.RegistrationToken;


public interface LogService {
	
	public void logSessionStart (String userId, String sessionId, String ip);
	
	public void logSessionStop (String userId, String sessionId, Date end);
	
	public void logRegisterTeacher(String userId);

	public void logUpdateUserProfile(String userId);

	public void logChangePassword(String userId);

	public void logConfirmRegisterStudent(String userId);

	public void logCreateScenario(String scenarioId, String userId);

	public void logUpdateScenarioInfo(String scenarioId, String userId);

	public void logDeleteScenario(String scenarioId, String userId);

	public void logNewAttendees(String scenarioId, String userId, List<Reference> list);

	public void logNewCollaborator(String scenarioId, String userId, Reference r);

	public void logRemoveAttendee(String scenarioId, String userId, String attendeeId);

	public void logRemoveCollaborator(String scenarioId, String userId,String collaboratorId);

	public void logNewCharacter(String scenarioId, String userId, String characterId);

	public void logUpdateCharacterProfile(String scenarioId, String userId, String characterId);

	public void logRemoveCharacter(String scenarioId, String userId, String characterId);

	public void logNewAssociation(String scenarioId, String userId, String characterId);

	public void logRemoveAssociation(String scenarioId, String userId, String characterId);

	public void logUpdatePost(String scenarioId, String userId, String postId);

	public void logInsertPost(String scenarioId, String userId, String postId);

	public void logDeletePost(String scenarioId, String userId, String postId);

	public void logNewComment(String scenarioId, String userId, String postId, String commentId);

	public void logUpdateComment(String scenarioId, String userId, String postId, String commentId);

	public void logDeleteComment(String scenarioId, String userId, String postId, String commentId);

	public void logNewMetaComment(String scenarioId, String userId, String postId, String metaCommentId);

	public void logUpdateMetaComment(String scenarioId, String userId, String postId, String metaCommentId);

	public void logDeleteMetaComment(String scenarioId, String userId, String postId, String metaCommentId);

	public void logAddLikeToPost(String scenarioId, String userId, String postId);

	public void logRemoveLikeToPost(String scenarioId, String userId, String postId);

	public void logUpdateScenarioMission(String scenarioId, String userId);

	public void logUpdateCharacterMission(String scenarioId, String userId, String characterId);

	public void logRemoveCharacterMission(String scenarioId, String userId, String characterId);

	public void logRemoveScenarioMission(String scenarioId, String userId);
	
	//NEW_NEWSPAPER, DEL_NEWSPAPER, ADD_JOURNALIST, DEL_JOURNALIST, UPD_ARTICLE, NEWSPAPER_ON, NEWSPAPER_OFF;
	
	public void logAddNewspaper(String scenarioId, String newspaperId, String userId);
	
	public void logUpdateNewspaper(String scenarioId, String newspaperId, String userId);
	
	public void logPublishNewspaper(String scenarioId, String newspaperId, String userId);
	
	public void logRemoveNewspaper(String scenarioId, String newspaperId, String userId);
	
	public void logAddJournalist(String scenarioId, String masterUserId, String slaveUserId);
	
	public void logRemoveJournalist(String scenarioId, String masterUserId, String removedJournalistId);
	
	public void logUpdateArticle (String scenarioId, String newspaperId, String userId);
	
	public void logNewspaperON (String scenarioId, String userId);
	
	public void logNewspaperOFF (String scenarioId, String userId);

	public void logUpdateScenarioCover(String scenarioId, String userId);

	public void logUpdateUserCover(String userId);

	public void logUpdateUserCoverLarge(String userId);

	public void logUpdateCharacterCover(String scenarioId, String userId, String characterId);

	public void logAddTrustedMedia(String idScenario, String userId, String idMedia);

	public void logRemoveTrustedMedia(String idScenario, String userId, String idMedia);

	public void logUpdateTrustedMedia(String idScenario, String userId,
			String idMedia);

	public Page<Log> getAllLogs(Date start, Date end, LogType type, Integer nPag, Integer nItem) throws BadRequestException;
	
	public Page<Log> getAllLogsOfUser(Date start, Date end, String userId, LogType type, Integer nPag, Integer nItem) throws BadRequestException;
	
	public Page<Log> getAllLogsOfScenario(Date start, Date end, String scenarioId, LogType type, Integer nPag, Integer nItem) throws BadRequestException;
	
	public Page<Log> getAllLogsOfUserInScenario(Date start, Date end, String userId, String scenarioId, LogType type, Integer nPag, Integer nItem) throws BadRequestException;
	
	public long numOfLogOfUser(String userId) throws BadRequestException;
	
	public long numOfLogOfScenario(String scenarioId) throws BadRequestException;
	
	public long numOfLogOfUserInScenario(String userId, String scenarioId) throws BadRequestException;
	
	public Page<RegistrationToken> getPagedRegistrationRequests (Integer nPag, Integer nItem) throws BadRequestException;

	public InfoStatistics getInfoStatisticsUser (String userId) throws BadRequestException;
	
	public InfoStatistics getInfoStatisticsScenario (String scenarioId) throws BadRequestException;
	
	public InfoStatistics getInfoStatisticsUserInScenario (String userId, String scenarioId) throws BadRequestException;
		
}
