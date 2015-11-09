package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Mission;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.CriteriaDefinition;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Update.AddToSetBuilder;

import com.mongodb.DB;
import com.mongodb.DBRef;
import com.mongodb.WriteResult;

public class ScenarioRepositoryImpl implements CustomScenarioRepository{

	@Autowired
	private MongoOperations mongoOp;
	
	//Questo metodo ritorna lo scenario dopo la modifica
	@Override
	public Scenario updateScenario(String id, Update update) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		return mongoOp.findAndModify(q, update, options, Scenario.class);
	}

	@Override
	public boolean removeUserFromScenario(String scenarioId, ScenarioStatus status, String userId) {

		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(scenarioId));
		Update u = new Update();
		/*Mettiamo in created_v2 così che il creatore possa ripartire dall'ultimo step di creazione a cui era arrivato, se lo scenario non è già ACTIVE*/
		if(status.equals(ScenarioStatus.CREATED_V1) || status.equals(ScenarioStatus.CREATED_V3))
			u.set("status", ScenarioStatus.CREATED_V2);
		Reference ref = new Reference();
		ref.setId(userId);
		u.pull("attendees", ref);
		u.pull("invited", ref);
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;	
	}
	
	@Override
	public boolean removeCollaboratorFromScenario(String scenarioId,  ScenarioStatus status,
			Reference collaborator, boolean putInAttendeesList) {
			
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(scenarioId));
		Update u = new Update();
		/*Mettiamo in created_v2 così che il creatore possa ripartire dall'ultimo step di creazione a cui era arrivato, se lo scenario non è già ACTIVE*/
		if(status.equals(ScenarioStatus.CREATED_V1) || status.equals(ScenarioStatus.CREATED_V3))
			u.set("status", ScenarioStatus.CREATED_V2);
		
		if(putInAttendeesList)
			u.addToSet("attendees", collaborator);
		
		u.pull("collaborators",collaborator);

		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

//	@Override
//	public boolean addUsersToScenario(List<Reference> l, ScenarioStatus status, String scenarioId) {
//		// TODO 
//		Query q = new Query();
//		q.addCriteria(Criteria.where("id").is(scenarioId));
//		Update u = new Update();
		//VERIFICARE funzionamento addToSetBuilder utilizzato al posto della pushAll deprecata da Mongo
//		AddToSetBuilder addToSetBuilder = u.addToSet("attendees");
//		u=addToSetBuilder.each(l.toArray());
//		//u.pushAll("attendees", l.toArray());
//		
//		
//		/*Mettiamo in created_v2 così che il creatore possa ripartire dall'ultimo step di creazione a cui era arrivato, se lo scenario non è già ACTIVE*/
//		if(status.equals(ScenarioStatus.CREATED_V1) || status.equals(ScenarioStatus.CREATED_V3))
//			u.set("status", ScenarioStatus.CREATED_V2);
//		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
//		if(w.isUpdateOfExisting())
//			return true;
//		else
//			return false;
//	}
	
	@Override
	public boolean addAttendeeToScenario(Reference user, ScenarioStatus status, String scenarioId) {
		// TODO 
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId));
		Update u = new Update();
		u.addToSet("attendees", user);
		/*Mettiamo in created_v2 così che il creatore possa ripartire dall'ultimo step di creazione a cui era arrivato, se lo scenario non è già ACTIVE*/
		if(status.equals(ScenarioStatus.CREATED_V1) || status.equals(ScenarioStatus.CREATED_V3))
			u.set("status", ScenarioStatus.CREATED_V2);
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean addCollaborator(Reference c, ScenarioStatus status, String scenarioId, boolean removeFromAttendees) {
		// TODO 
		//Metodo da implementare
		//Ricorda di mettere lo stato dello scenario in Created_V2 se era in Created_V1 o in Created_V3

		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId));
		
		Update u = new Update();
		u.addToSet("collaborators", c);
		
		if(removeFromAttendees)
			u.pull("attendees", c);
		
		/*Mettiamo in created_v2 così che il creatore possa ripartire dall'ultimo step di creazione a cui era arrivato, se lo scenario non è già ACTIVE*/
		if(status.equals(ScenarioStatus.CREATED_V1) || status.equals(ScenarioStatus.CREATED_V3))
			u.set("status", ScenarioStatus.CREATED_V2);
		
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public void removeScenario(String id) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		
		mongoOp.remove(q, Scenario.class);
	}

	@Override
	public int updateTeacherCollaboratorListReference(String id,
			Reference newRef) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int updateAttendeesListReference(String id, Reference newRef) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int updateTeacherCreatorReference(String id, Reference newRef) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public boolean addCharacter(CharacterReference c, String scenarioId, ScenarioStatus status) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId));
		Update u = new Update();
		
		/*Mettiamo in created_v3 così che il creatore possa ripartire dall'ultimo step di creazione a cui era arrivato, se lo scenario non è già ACTIVE*/
		if(status.equals(ScenarioStatus.CREATED_V1) || status.equals(ScenarioStatus.CREATED_V2))
			u.set("status", ScenarioStatus.CREATED_V3);
		
		u.addToSet("characters", c);
		
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
		
	}

	@Override
	public Scenario removeCharacterFromScenario(String id, String characterId) {

		/*TODO da testare*/
		
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		
		Update u = new Update();
		CharacterReference charRef = new CharacterReference();
		charRef.setId(characterId);
		u.pull("characters", charRef);
		
		return mongoOp.findAndModify(q,u,Scenario.class);
	}

	@Override
	public boolean addUserToInvited(String scenarioId, Reference ref) {
		
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId));
		Update u = new Update();
		u.addToSet("invited", ref);
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean putInDeletedState(String id) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.set("status", ScenarioStatus.DELETED);
		
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public Scenario moveFromInvitedToAttendees(Reference userRef,
			String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId));
		Update u = new Update();
		
		/*TODO verificare funzionamento pull visto che lo userRef passato è diverso da quello memorizzato (anche se con lo stesso id)*/
		Reference refRemove = new Reference();
		refRemove.setId(userRef.getId());
		u.pull("invited", refRemove);

		u.addToSet("attendees", userRef);
//		Reference userRefRemove = new Reference();
//		userRefRemove.setId(userRef.getId());
//		userRefRemove.setEmail(userRef.getEmail());
//		userRefRemove.setType(userRef.getType());
		
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		
		return mongoOp.findAndModify(q, u, options, Scenario.class);

	}

	@Override
	public boolean addPostToScenario(String scenarioId,
			PostReference postReference) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId));
		Update u = new Update();
		u.push("posts", postReference);
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean updatePostDateInScenario(String scenarioId,
			PostReference postRef) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId)
				.andOperator(Criteria.where("posts._id").is(new ObjectId(postRef.getId()))));
		Update u = new Update();
		u.set("posts.$", postRef);
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	//TODO da testare
	@Override
	public boolean updateCharacterToScenario(CharacterReference charRef,
			String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId)
				.andOperator(Criteria.where("characters._id").is(new ObjectId(charRef.getId()))));
		
		Update u = new Update();
		u.set("characters.$", charRef);
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean removePost(String scenarioId, String postId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId));
		
		PostReference post = new PostReference();
		post.setId(postId);
		
		Update u = new Update();
		u.pull("posts", post);
		
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean setCover(String scenarioId, String metaId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(scenarioId));
		
		Update u = new Update();
		u.set("cover",metaId);
		
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;		
	}

	@Override
	public boolean removeUserFromCharacterReference(String idScenario, CharacterReference character, String userToDelete) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(idScenario)
				.andOperator(Criteria.where("characters._id").is(new ObjectId(character.getId()))));
		Update u = new Update();
		character.setUserId(null);
		u.set("characters.$", character);
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;		
	}
	
	@Override
	public boolean deleteMissionToScenario(String idScenario) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(new ObjectId(idScenario)));
		Update u = new Update();
		u.set("mission", null);
		WriteResult w = mongoOp.updateFirst(q, u, Scenario.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public List<Scenario> getMissionsOfScenarios(List<String> scenariosId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").in(scenariosId));
		q.fields().include("id");
		q.fields().include("mission");
		return mongoOp.find(q, Scenario.class);
	}
	
}
