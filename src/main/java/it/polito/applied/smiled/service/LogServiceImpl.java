package it.polito.applied.smiled.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.mongodb.MongoException;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.Log;
import it.polito.applied.smiled.pojo.LogSession;
import it.polito.applied.smiled.pojo.LogType;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.RegistrationToken;
import it.polito.applied.smiled.repository.LogRepository;
import it.polito.applied.smiled.repository.LogSessionRepository;
import it.polito.applied.smiled.repository.RegistrationRepository;

@Service
public class LogServiceImpl implements LogService{
	
	@Autowired
	private LogRepository logRepo;
	
	@Autowired
	private RegistrationRepository regRepo;
	
	@Autowired
	private LogSessionRepository logSessionRepo;

	@Override
	public void logRegisterTeacher(String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(null);
		log.setUserId(userId);
		log.setRefer(userId);
		log.setType(LogType.REG_T);
		logRepo.save(log);
	}

	@Override
	public void logUpdateUserProfile(String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(null);
		log.setUserId(userId);
		log.setRefer(userId);
		log.setType(LogType.UP_USER_INFO);
		logRepo.save(log);
	}

	@Override
	public void logChangePassword(String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(null);
		log.setUserId(userId);
		log.setRefer(userId);
		log.setType(LogType.CHANGE_PWD);
		logRepo.save(log);		
	}

	@Override
	public void logConfirmRegisterStudent(String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(null);
		log.setUserId(userId);
		log.setRefer(userId);
		log.setType(LogType.REG_S);
		logRepo.save(log);		
	}

	@Override
	public void logCreateScenario(String scenarioId, String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(scenarioId);
		log.setType(LogType.NEW_SCEN);
		logRepo.save(log);		
	}

	@Override
	public void logUpdateScenarioInfo(String scenarioId, String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(scenarioId);
		log.setType(LogType.UP_SCEN_INFO);
		logRepo.save(log);		
	}

	@Override
	public void logDeleteScenario(String scenarioId, String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(scenarioId);
		log.setType(LogType.DEL_SCEN);
		logRepo.save(log);		
	}

	@Override
	public void logNewAttendees(String scenarioId, String userId,
			List<Reference> list) {
		if(list!=null){
			for(Reference r : list){
				Log log = new Log();
				log.setDate(new Date());
				log.setScenarioId(scenarioId);
				log.setUserId(userId);
				log.setRefer(r.getId());
				log.setType(LogType.NEW_ATTENDEE);
				logRepo.save(log);	
			}
		}
		
	}

	@Override
	public void logNewCollaborator(String scenarioId, String userId,
			Reference r) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(r.getId());
		log.setType(LogType.NEW_COLLAB);
		logRepo.save(log);
	}

	@Override
	public void logRemoveAttendee(String scenarioId, String userId,
			String attendeeId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(attendeeId);
		log.setType(LogType.DEL_ATTENDEE);
		logRepo.save(log);		
	}

	@Override
	public void logRemoveCollaborator(String scenarioId, String userId,
			String collaboratorId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(collaboratorId);
		log.setType(LogType.DEL_COLLAB);
		logRepo.save(log);				
	}

	@Override
	public void logNewCharacter(String scenarioId, String userId, String characterId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(characterId);
		log.setType(LogType.NEW_CHAR);
		logRepo.save(log);			
	}

	@Override
	public void logUpdateCharacterProfile(String scenarioId, String userId, String characterId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(characterId);
		log.setType(LogType.UP_CHAR_INFO);
		logRepo.save(log);					
	}

	@Override
	public void logRemoveCharacter(String scenarioId, String userId, String characterId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(characterId);
		log.setType(LogType.DEL_CHAR);
		logRepo.save(log);		
	}

	@Override
	public void logNewAssociation(String scenarioId, String userId,
			String characterId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(characterId);
		log.setType(LogType.NEW_ASSOCIATION);
		logRepo.save(log);		
	}

	@Override
	public void logRemoveAssociation(String scenarioId, String userId,
			String characterId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(characterId);
		log.setType(LogType.DEL_ASSOCIATION);
		logRepo.save(log);				
	}

	@Override
	public void logUpdatePost(String scenarioId, String userId, String postId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setType(LogType.UP_POST);
		logRepo.save(log);		
	}

	@Override
	public void logInsertPost(String scenarioId, String userId, String postId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setType(LogType.NEW_POST);
		logRepo.save(log);		
	}

	@Override
	public void logDeletePost(String scenarioId, String userId, String postId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setType(LogType.DEL_POST);
		logRepo.save(log);				
	}

	@Override
	public void logNewComment(String scenarioId, String userId, String postId, String commentId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setCommentId(commentId);
		log.setType(LogType.NEW_COMM);
		logRepo.save(log);		
	}

	@Override
	public void logUpdateComment(String scenarioId, String userId,
			String postId, String commentId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setCommentId(commentId);
		log.setType(LogType.UP_COMM);
		logRepo.save(log);				
	}

	@Override
	public void logDeleteComment(String scenarioId, String userId,
			String postId, String commentId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setCommentId(commentId);
		log.setType(LogType.DEL_COMM);
		logRepo.save(log);		
	}

	@Override
	public void logNewMetaComment(String scenarioId, String userId,
			String postId, String metaCommentId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setCommentId(metaCommentId);
		log.setType(LogType.NEW_META_COMM);
		logRepo.save(log);				
	}

	@Override
	public void logUpdateMetaComment(String scenarioId, String userId,
			String postId, String metaCommentId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setCommentId(metaCommentId);
		log.setType(LogType.UP_META_COMM);
		logRepo.save(log);				
	}

	@Override
	public void logDeleteMetaComment(String scenarioId, String userId,
			String postId, String metaCommentId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setCommentId(metaCommentId);
		log.setType(LogType.DEL_META_COMM);
		logRepo.save(log);			
	}

	@Override
	public void logAddLikeToPost(String scenarioId, String userId, String postId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setType(LogType.ADD_LIKE_POST);
		logRepo.save(log);					
	}

	@Override
	public void logRemoveLikeToPost(String scenarioId, String userId,
			String postId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(postId);
		log.setType(LogType.DEL_LIKE_POST);
		logRepo.save(log);					
	}

	@Override
	public void logUpdateScenarioMission(String scenarioId, String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(scenarioId);
		log.setType(LogType.UP_MISSION_SCEN);
		logRepo.save(log);				
	}

	@Override
	public void logUpdateCharacterMission(String scenarioId, String userId,
			String characterId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(characterId);
		log.setType(LogType.UP_MISSION_CHAR);
		logRepo.save(log);					
	}

	@Override
	public void logRemoveCharacterMission(String scenarioId, String userId,
			String characterId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(characterId);
		log.setType(LogType.DEL_MISSION_CHAR);
		logRepo.save(log);			
	}

	@Override
	public void logRemoveScenarioMission(String scenarioId, String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(scenarioId);
		log.setType(LogType.DEL_MISSION_SCEN);
		logRepo.save(log);				
	}

	@Override
	public void logUpdateScenarioCover(String scenarioId, String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(scenarioId);
		log.setType(LogType.UP_SCEN_COVER);
		logRepo.save(log);					
	}

	@Override
	public void logUpdateUserCover(String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(null);
		log.setUserId(userId);
		log.setRefer(userId);
		log.setType(LogType.UP_USER_COVER);
		logRepo.save(log);					
	}

	@Override
	public void logUpdateUserCoverLarge(String userId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(null);
		log.setUserId(userId);
		log.setRefer(userId);
		log.setType(LogType.UP_USER_COVER_L);
		logRepo.save(log);					
	}

	@Override
	public void logUpdateCharacterCover(String scenarioId, String userId,
			String characterId) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(scenarioId);
		log.setUserId(userId);
		log.setRefer(characterId);
		log.setType(LogType.UP_CHAR_COVER);
		logRepo.save(log);					
	}

	@Override
	public void logAddTrustedMedia(String idScenario, String userId,
			String idMedia) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(idScenario);
		log.setUserId(userId);
		log.setRefer(idMedia);
		log.setType(LogType.NEW_TRUST_FILE);
		logRepo.save(log);				
	}

	@Override
	public void logRemoveTrustedMedia(String idScenario, String userId,
			String idMedia) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(idScenario);
		log.setUserId(userId);
		log.setRefer(idMedia);
		log.setType(LogType.DEL_TRUST_FILE);
		logRepo.save(log);			
	}

	@Override
	public void logUpdateTrustedMedia(String idScenario, String userId,
			String idMedia) {
		Log log = new Log();
		log.setDate(new Date());
		log.setScenarioId(idScenario);
		log.setUserId(userId);
		log.setRefer(idMedia);
		log.setType(LogType.UP_TRUST_FILE);
		logRepo.save(log);					
	}

	@Override
	public void logSessionStart(String userId, String sessionId, String ip) {
		LogSession logSession = new LogSession(userId, sessionId, ip);
		logSessionRepo.save(logSession);
	}

	@Override
	public void logSessionStop(String userId, String sessionId, Date endTime) {
		
		logSessionRepo.stopSession(userId, sessionId, endTime);
	}

	@Override
	public Page<Log> getAllLogs(Integer nPag, Integer nItem) throws BadRequestException {
		try{
			Page<Log> logs = logRepo.getPagingLogs(nPag, nItem);
			return logs;
		}catch(MongoException e ){
			throw e;
		}
	}

	@Override
	public Page<RegistrationToken> getPagedRegistrationRequests(Integer nPag, Integer nItem)
			throws BadRequestException {
		try{
			Page<RegistrationToken> reg = regRepo.getPagedRegistrationRequests(nPag, nItem);
			return reg;
		}catch(MongoException e ){
			throw e;
		}
	}
	
	



	
}
