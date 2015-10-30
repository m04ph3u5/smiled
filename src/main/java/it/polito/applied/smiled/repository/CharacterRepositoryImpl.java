package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Mission;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.WriteResult;

public class CharacterRepositoryImpl implements CustomCharacterRepository{

	@Autowired
	MongoOperations mongoOp;

	@Override
	public int updateActualUserReference(String id, Reference newRef) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.set("actualUser", newRef);
		WriteResult w = mongoOp.updateFirst(q, u, Character.class);
		return w.getN();
	}

	@Override
	public Character updateCharacter(
			String id, Update update) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		return mongoOp.findAndModify(q, update, options, Character.class);
	}

	@Override
	public void removeCharacters(List<String> idCharacters) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").in(idCharacters));
		mongoOp.remove(q, Character.class);
		
	}
	
	@Override
	public boolean removeCharacter(String characterId){
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(characterId));
		
		WriteResult w = mongoOp.remove(q, Character.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
		
	}

	@Override
	public boolean putToDeletedCharacter(String characterId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(characterId));
		
		Update u = new Update();
		u.set("deleted", true);
		WriteResult w = mongoOp.updateFirst(q, u, Character.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
		
	}

	@Override
	public boolean addPostToCharacter(String id, PostReference postReference) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.push("posts", postReference);
		WriteResult w = mongoOp.updateFirst(q, u, Character.class);
		
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean removePostFromCharacter(String id, String postId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		
		PostReference post = new PostReference();
		post.setId(postId);
		
		Update u = new Update();
		u.pull("posts", post);
		
		WriteResult w = mongoOp.updateFirst(q, u, Character.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean setCover(String characterId, String coverId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(new ObjectId(characterId)));
		Update u = new Update();
		u.set("coverPhotoId", coverId);
		WriteResult w = mongoOp.updateFirst(q, u, Character.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public List<Character> getAllCharactersFromScenario(String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(scenarioId).andOperator((Criteria.where("deleted").is(false))));
		return mongoOp.find(q, Character.class);
		
	}

}
