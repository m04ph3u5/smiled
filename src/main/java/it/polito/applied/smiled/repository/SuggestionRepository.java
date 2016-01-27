package it.polito.applied.smiled.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import it.polito.applied.smiled.pojo.Suggestion;

public interface SuggestionRepository extends MongoRepository<Suggestion, String>, CustomSuggestionRepository  {

}
