package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.scenario.Mission;
import it.polito.applied.smiled.pojo.scenario.Post;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MissionRepository extends MongoRepository<Mission, String>, CustomMissionRepository {
	
	public Mission findById(String id);

	

	
}
