package it.polito.applied.smiled.repository;

import java.util.Date;

import org.springframework.data.domain.Page;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.InfoStatistics;
import it.polito.applied.smiled.pojo.Log;
import it.polito.applied.smiled.pojo.LogType;

public interface CustomLogRepository {

	public Page<Log> findByUserInDateAndType(String userId, Date start, Date end, LogType type, Integer nPag, Integer nItem) throws BadRequestException;
	public Page<Log> findByScenarioInDateAndType(String scenarioId, Date start, Date end, LogType type, Integer nPag, Integer nItem) throws BadRequestException;
	public Page<Log> findByUserAndScenarioInDateAndType(String userId, String scenarioId, Date start, Date end, LogType type, Integer nPag, Integer nItem) throws BadRequestException;
	public long numLogOfUser(String userId) throws BadRequestException;
	public long numLogOfScenario(String scenarioId) throws BadRequestException;
	public long numLogOfUserInScenario(String userId, String scenarioId) throws BadRequestException;
	public int deleteByScenarioId(String scenarioId);
	public Page<Log> getPagingLogs(Date start, Date end, LogType type, Integer nPag, Integer nItem);
	public InfoStatistics getInfoStatisticsUser(String userId);
	public InfoStatistics getInfoStatisticsScenario(String scenarioId);
	public InfoStatistics getInfoStatisticsUserInScenario(String userId, String scenarioId);
}
