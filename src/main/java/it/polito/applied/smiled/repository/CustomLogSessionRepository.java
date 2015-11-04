package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.LogSession;

import java.util.Date;
import java.util.List;

public interface CustomLogSessionRepository {
	public List<LogSession> findByUserInDate(String userId, Date start, Date end) throws BadRequestException;
	public List<String> findLoggedUser();
	public List<String> findLoggedUserInDate(Date start, Date end);
	public Date totalLoggedTimeOfUser(String userId);
	public Date totalLoggedTimeOfUserInDate(String userId, Date start, Date end);
}
