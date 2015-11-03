package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.Log;

import java.util.Date;
import java.util.List;

public interface CustomLogRepository {

	public List<Log> findByUserInDate(String userId, Date start, Date end) throws BadRequestException;
	public List<Log> findByScenarioInDate(String scenarioId, Date start, Date end) throws BadRequestException;
	public List<Log> findByUserAndScenarioInDate(String userId, String scenarioId, Date start, Date end) throws BadRequestException;
	
	public int deleteByScenarioId(String scenarioId);

}
