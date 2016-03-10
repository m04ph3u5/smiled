package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ScenarioRepository extends MongoRepository<Scenario, String>, CustomScenarioRepository{

	public Scenario findById(String id);

	public List<Scenario> findByStatus(ScenarioStatus status);


	

}
