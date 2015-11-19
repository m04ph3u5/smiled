package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.LogSession;

import java.util.Date;
import java.util.List;

public interface CustomLogSessionRepository {
	public void stopSession(String userId, String sessionId, Date end);
	public List<LogSession> findByUserInDate(String userId, Date start, Date end) throws BadRequestException;
	public List<LogSession> findLoggedUsers();
	public List<LogSession> findLoggedUsersInDate(Date start, Date end) throws BadRequestException;
	public Long totalLoggedTimeOfUser(String userId);
	public Long totalLoggedTimeOfUserInDate(String userId, Date start, Date end);
}
