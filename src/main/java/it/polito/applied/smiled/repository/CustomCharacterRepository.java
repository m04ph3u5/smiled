package it.polito.applied.smiled.repository;

import java.util.List;

import org.springframework.data.mongodb.core.query.Update;

import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;


public interface CustomCharacterRepository {
	
	public int updateActualUserReference(String id, Reference newRef);	
	public Character updateCharacter(String id, Update u);	
	public void removeCharacters(List<String> idCharacters);
	public boolean removeCharacter(String characterId);
	public boolean putToDeletedCharacter(String characterId);
	public boolean addPostToCharacter(String id, PostReference postReference);
	public boolean removePostFromCharacter(String id, String id2);
	public boolean setCover(String userId, String coverId);
	public List<Character> getAllCharactersFromScenario(String scenarioId);

}
