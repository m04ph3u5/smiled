package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.LogSession;

import java.util.Date;
import java.util.List;

public class LogSessionRepositoryImpl implements CustomLogSessionRepository{

	@Override
	public List<LogSession> findByUserInDate(String userId, Date start, Date end)
			throws BadRequestException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<String> findLoggedUser() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<String> findLoggedUserInDate(Date start, Date end) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Date totalLoggedTimeOfUser(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Date totalLoggedTimeOfUserInDate(String userId, Date start, Date end) {
		// TODO Auto-generated method stub
		return null;
	}

}
