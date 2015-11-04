package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.LogSession;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface LogSessionRepository extends MongoRepository<LogSession, String>, CustomLogSessionRepository{
	
	public List<LogSession> findByUserId(String userId);

}
