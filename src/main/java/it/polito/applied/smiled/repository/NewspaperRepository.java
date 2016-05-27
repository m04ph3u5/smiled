package it.polito.applied.smiled.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import it.polito.applied.smiled.pojo.newspaper.Newspaper;

public interface NewspaperRepository extends MongoRepository<Newspaper, String>, CustomNewspaperRepository {
	
	public Newspaper findById(String id);
	public Long removeByIdScenarioAndNumber(String idScenario, int number);
	

}
