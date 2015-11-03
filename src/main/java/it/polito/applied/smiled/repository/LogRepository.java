package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.Log;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface LogRepository extends MongoRepository<Log, String>, CustomLogRepository{

	public List<Log> findByUserId(String userId);
	public List<Log> findByScenarioId(String scenarioId);
	public List<Log> findByUserIdAndScenarioId(String userId, String scenarioId);
}
