package it.polito.applied.smiled.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import it.polito.applied.smiled.pojo.scenario.Character;

public interface CharacterRepository extends MongoRepository<Character, String>, CustomCharacterRepository{

	public Character findById(String id);




}
