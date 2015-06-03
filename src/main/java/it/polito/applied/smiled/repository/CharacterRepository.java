package it.polito.applied.smiled.repository;

import java.util.List;

import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.repository.MongoRepository;

import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.scenario.Character;

public interface CharacterRepository extends MongoRepository<Character, String>, CustomCharacterRepository{

	public Character findById(String id);





}
