package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.dto.FirstPasswordDTO;
import it.polito.applied.smiled.dto.UserDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;
import it.polito.applied.smiled.pojo.user.Student;
import it.polito.applied.smiled.pojo.user.Teacher;
import it.polito.applied.smiled.pojo.user.UserProfile;
import it.polito.applied.smiled.pojo.user.UserStatus;
import it.polito.applied.smiled.pojo.user.User;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Update.AddToSetBuilder;
import org.springframework.data.mongodb.core.query.Update.PushOperatorBuilder;

import com.mongodb.DB;
import com.mongodb.DBRef;
import com.mongodb.WriteResult;

public class UserRepositoryImpl implements CustomUserRepository {
	
	@Autowired
	private MongoOperations mongoOp;

	@Override
	public String updateToApproveUserStatus(String email) {
		Query q = new Query();
		Criteria c = new Criteria();
		c.orOperator(Criteria.where("status").is(UserStatus.STATUS_PENDING),(Criteria.where("status").is(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD)));
		q.addCriteria(Criteria.where("email").is(email)
				.andOperator(c));
		Update u = new Update();
		u.set("status", UserStatus.STATUS_APPROVED);
		User user = mongoOp.findAndModify(q, u, User.class);
		if (user!=null)
			return user.getFirstName()+" "+user.getLastName();
		else
			return null;
	}

	@Override
	public void deletePendingByEmail(String email) {
		Query q = new Query();
		q.addCriteria(Criteria.where("email").is(email).andOperator(Criteria.where("status").is(UserStatus.STATUS_PENDING)));
		mongoOp.remove(q, User.class);
	}

	@Override
	public User addTeacherToStudent(String id, Reference teacher) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.addToSet("teachers", teacher);
		return mongoOp.findAndModify(q, u, User.class);

	}


	/*A questo metodo non passiamo la vecchia password in quanto 
	 * non è possibile controllare la password con una query in Mongo
	 * (BCrypt mischia il sale con la pwd e salva una sola riga nel DB)
	 * Il controllo viene fatto a monte (nel Service) della chiamata a questo
	 * metodo*/
	@Override
	public int changePassword(String userEmail, String newPassword) {

		Query q = new Query();
		q.addCriteria(Criteria.where("email").is(userEmail));
		Update u = new Update();
		u.set("password", newPassword);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}
	
	@Override
	public User changeFirstPassword(FirstPasswordDTO firstPassword, String hashNewPassword) {
		Query q = new Query();
		q.addCriteria(Criteria.where("email").is(firstPassword.getEmail())
				.andOperator(Criteria.where("status").is(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD)));
		Update u = new Update();
		u.set("status", UserStatus.STATUS_APPROVED);
		u.set("password", hashNewPassword);
		u.set("firstName", firstPassword.getFirstname());
		u.set("lastName", firstPassword.getLastname());
		u.set("profile.bornDate", firstPassword.getBornDate());
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		return mongoOp.findAndModify(q, u, options, User.class);
	}

	@Override
	public int openScenarioToUser(String id, ScenarioReference scenario) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.addToSet("openScenarios", scenario);
		u.pull("invitingScenariosId", scenario.getId());
		ScenarioReference ref = new ScenarioReference();
		ref.setId(scenario.getId());
		u.pull("creatingScenarios", ref);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}
	
	@Override
	public int insertInCreatedScenarioOfUser(String id,
			ScenarioReference scenario) {
		
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.addToSet("creatingScenarios", scenario);
		u.pull("invitingScenariosId", scenario.getId());
		
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}


	@Override
	public User updateUser(Update update, String userEmail) {
		Query q = new Query();
		q.addCriteria(Criteria.where("email").is(userEmail));
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		return mongoOp.findAndModify(q, update, options, User.class);
	}


	@Override
	public int updateTeachersListReference(String id, Reference newRef) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(id).andOperator(Criteria.where("teachers._id").is(new ObjectId(newRef.getId()))));
		Update u = new Update();
		u.set("teachers.$", newRef);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}

	@Override
	public int updateColleaguesListReference(String id, Reference newRef) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(id).andOperator(Criteria.where("colleagues._id").is(new ObjectId(newRef.getId()))));
		Update u = new Update();
		u.set("colleagues.$", newRef);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}

	@Override
	public int updateStudentsListReference(String id, Reference newRef) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(id).andOperator(Criteria.where("students._id").is(new ObjectId(newRef.getId()))));
		Update u = new Update();
		u.set("students.$", newRef);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}

	@Override
	public int updateFriendsListReference(String id, Reference newRef) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(id).andOperator(Criteria.where("friends._id").is(new ObjectId(newRef.getId()))));
		Update u = new Update();
		u.set("friends.$", newRef);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}

	@Override
	public Page<User> getPagingUsers(Integer nPag, Integer nItem, int type) {  //type mi dice se voglio dei teacher (1), degli student(2) o entrambi + moderatori(3)
		Query q = new Query();
		if(type==1){
			q.addCriteria(Criteria.where("_class").is("it.polito.applied.smiled.pojo.user.Teacher").andOperator(Criteria.where("status").ne(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD).andOperator(Criteria.where("status").ne(UserStatus.STATUS_PENDING).andOperator(Criteria.where("status").ne(UserStatus.STATUS_CANCELED)))));
		}else if(type==2){
			q.addCriteria(Criteria.where("_class").is("it.polito.applied.smiled.pojo.user.Student").andOperator(Criteria.where("status").ne(UserStatus.STATUS_PENDING_DEFAULT_PASSWORD).andOperator(Criteria.where("status").ne(UserStatus.STATUS_PENDING).andOperator(Criteria.where("status").ne(UserStatus.STATUS_CANCELED)))));
		}else if(type==3){
			;   //restituisce tutti: studenti, teacher e moderatori NOT USED
		}else{
			return null;
		}
		
		
		Sort s;
		s = new Sort( new Order(Direction.DESC, "registrationDate"));
		long total = mongoOp.count(q, User.class);
		
		Pageable p = new PageRequest(nPag,nItem, s);
		q.with(p);
		
		List<User> users = mongoOp.find(q,User.class);
		return new PageImpl<User>(users,p,total);
	}

	@Override
	public Page<User> getPagingTeachersByRegex(String regex, Integer nPag, Integer nItem) throws BadRequestException{
		Query q = new Query();
		long total;
		//TODO total va calcolato
		Pageable p = new PageRequest(nPag,nItem);
		q.with(p);
		
		
		String queryx[] = regex.split(" ");
		
		if(queryx.length<=1){
			Criteria internal = new Criteria();
			Criteria external = new Criteria();
			internal.orOperator(Criteria.where("firstName").regex(regex, "i"), Criteria.where("lastName").regex(regex, "i"));
			external.andOperator(internal, Criteria.where("_class").is("it.polito.applied.smiled.pojo.user.Teacher"), Criteria.where("status").ne("STATUS_PENDING"));
			
			q.addCriteria(external);
			System.out.println("q: "+ q.toString());
		}else{
			ArrayList<Criteria> cr = new ArrayList<Criteria>();
			for (String qq : queryx) {
			    Criteria fCriteria = Criteria.where("firstName").regex(qq, "i");
			    cr.add(fCriteria);
			    Criteria lCriteria = Criteria.where("lastName").regex(qq, "i");
			    cr.add(lCriteria);
			}
			Criteria c = cr.remove(0);
			
			Criteria [] orArray = cr.toArray(new Criteria[cr.size()]);
			Criteria c2 = cr.remove(0);
			Criteria [] orArray2 = cr.toArray(new Criteria[cr.size()]);

			c2.orOperator(orArray2);
			c.orOperator(orArray);
			
			Criteria internal = new Criteria();
			Criteria external = new Criteria();
			
			internal.orOperator(c,c2);
			external.andOperator(internal, Criteria.where("_class").is("it.polito.applied.smiled.pojo.user.Teacher") , Criteria.where("status").ne("STATUS_PENDING"));
			q.addCriteria(external);
			
			//q.addCriteria(Criteria.where("_class").is("it.polito.applied.smiled.pojo.user.Teacher").andOperator(c));
		}
		
		
		
		
		total = mongoOp.count(q, User.class);
		List<User> matching = mongoOp.find(q,User.class);
		return new PageImpl<User>(matching,p,total);
		
	}
	
	@Override
	public int removeScenarioFromUser(String userToRemove, String scenarioId) {
		
		WriteResult w = null;
		
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(userToRemove));
		Update u = new Update();
		ScenarioReference scenarioRef = new ScenarioReference();
		scenarioRef.setId(scenarioId);
		
		u.pull("openScenarios", scenarioRef);
		u.pull("closedScenarios", scenarioRef);
		u.pull("invitingScenariosId", scenarioId);
		u.pull("creatingScenarios", scenarioRef);
		
		w = mongoOp.updateFirst(q, u, User.class);
		
		return w.getN();
		/*db.user.update(
			{_id: ObjectId("5536841e44aebd89bd12fa9d")},
			{ $pull: {"openScenarios": {$id : ObjectId("553916ef44ae6bc2f38a02df")}}}
		);*/
	}
	

	@Override
	public int removeScenarioFromUsers(List<String> usersToRemove, String id) {
		
		if(usersToRemove==null || usersToRemove.isEmpty())
			return 0;

		WriteResult w = null;
		
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").in(usersToRemove));
		Update u = new Update();
		
		ScenarioReference scenarioRef = new ScenarioReference();
		scenarioRef.setId(id);
		
		u.pull("openScenarios", scenarioRef);
		u.pull("creatingScenarios", scenarioRef);
		u.pull("closedScenarios", scenarioRef);
		u.pull("invitingScenariosId", id);
		
		w = mongoOp.updateMulti(q, u, User.class);
		
		return w.getN();
	}

	@Override
	public int openScenarioToUsers(List<String> listId, ScenarioReference scen) {

		WriteResult w = null;

		Query q = new Query();
		q.addCriteria(Criteria.where("id").in(listId));
		Update u = new Update();
		u.addToSet("openScenarios", scen);
		u.pull("invitingScenariosId", scen.getId());
		ScenarioReference ref = new ScenarioReference();
		ref.setId(scen.getId());
		u.pull("creatingScenarios", ref);
		if(listId.size()==1)
			w = mongoOp.updateFirst(q, u, User.class);
		else
			w = mongoOp.updateMulti(q, u, User.class);
		return w.getN();
		
	}

	@Override
	public int addStudentToTeacher(String teacherId, Reference studentRef) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(teacherId));
		Update u = new Update();
		
		if(studentRef.getType().equals(Student.class.getSimpleName()))
			u.addToSet("students", studentRef);
		

		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}

	@Override
	public boolean addInvitingScenario(String userId,	String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(userId));
		Update u = new Update();
		u.addToSet("invitingScenariosId", scenarioId);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}
	
	
	
	@Override
	public boolean deleteScenarioFromCreator(String creatorId, String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(creatorId));
		Update u = new Update();
		ScenarioReference scenarioRef = new ScenarioReference();
		scenarioRef.setId(scenarioId);
		u.pull("openScenarios", scenarioRef);
		u.pull("closedScenarios", scenarioRef);
		u.push("myDeletedScenarios", scenarioId);
		
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean removeScenarioAndSaveInBlockedList(String userToDelete,
			String id) {
		
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(userToDelete));
		Update u = new Update();
		ScenarioReference scenarioRef = new ScenarioReference();
		scenarioRef.setId(id);
		
		u.pull("openScenarios", scenarioRef);
		u.pull("closedScenarios", scenarioRef);
		u.pull("creatingScenarios", scenarioRef);
		u.pull("invitingScenariosId", id);
		
		u.addToSet("blockedScenariosId",id);
		
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
		
	}
	
	//TODO da testare!!!
	@Override
	public boolean removeActualCharacterToUser(String userId,
			String characterId, String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(userId)
				.andOperator(Criteria.where("openScenarios._id").is(new ObjectId(scenarioId))));
		Update u = new Update();
		u.set("openScenarios.$.myCharacterId",null);
		u.set("openScenarios.$.myCharacterName",null);
		
		
		User user = mongoOp.findAndModify(q, u, User.class);
		if(user!=null){
			
			for(ScenarioReference sr : user.getOpenScenarios()){
				if(sr.getId().equals(scenarioId)){
					sr.addPastCharacter(characterId);
					sr.setMyCharacterId(null);
					sr.setMyCharacterName(null);
					Query q2= new Query();
					q2.addCriteria(Criteria.where("id").is(userId)
							.andOperator(Criteria.where("openScenarios._id").is(new ObjectId(scenarioId))));
					Update u2 = new Update();
					u2.set("openScenarios.$",sr);
					user = mongoOp.findAndModify(q2, u2, User.class);
					break;
				}
			}
			
			return true;
		}
		else 
			return false;
		
	}

	@Override
	public boolean addActualCharacterToUser(String userId, Reference characterRef,
			String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(userId)
				.andOperator(Criteria.where("openScenarios._id").is(new ObjectId(scenarioId))));
		Update u = new Update();
		u.set("openScenarios.$.myCharacterId",characterRef.getId());
		u.set("openScenarios.$.myCharacterName",characterRef.getFirstname());
		
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean moveScenarioFromOpenToInviting(String collaboratorId,
			String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(collaboratorId));
		Update u = new Update();
		ScenarioReference ref = new ScenarioReference();
		ref.setId(scenarioId);
		u.pull("openScenarios", ref);
		u.pull("creatingScenarios", ref);
		u.push("invitingScenariosId",scenarioId);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean removeDraftPost(String userId, String postId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(userId));
		Update u = new Update();
		u.pull("draftPostsId", postId);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean addDraftPost(String userId, String postId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(userId));
		Update u = new Update();
		u.addToSet("draftPostsId", postId);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean setCover(String userId, String coverId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(new ObjectId(userId)));
		Update u = new Update();
		u.set("profile.coverPhotoId", coverId);

		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}
	
	@Override
	public boolean setCoverLarge(String userId, String coverId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(new ObjectId(userId)));
		Update u = new Update();
		u.set("profile.largeCoverPhotoId", coverId);

		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
		
	}

	@Override
	public int createScenarioToUser(String id,
			ScenarioReference scenario) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.addToSet("creatingScenarios", scenario);
		u.pull("invitingScenariosId", scenario.getId());
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		return w.getN();
	}

	@Override
	public boolean addColleagueToTeacher(String id, Reference r) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.addToSet("colleagues", r);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean updateNameOfOneScenarioReference(String userId,
			Scenario scenario, String newNameOfScenario) {
		Query q = new Query();
		String scenarioId = scenario.getId();
		Criteria c = new Criteria();
		Update u = new Update();
		
		if(scenario.getStatus().equals(ScenarioStatus.CREATED_V1) || 
				scenario.getStatus().equals(ScenarioStatus.CREATED_V2) || 
						scenario.getStatus().equals(ScenarioStatus.CREATED_V3)){
			
							c.andOperator(Criteria.where("id").is(userId), Criteria.where("creatingScenarios._id").is(new ObjectId(scenarioId) ));
							u.set("creatingScenarios.$.name", newNameOfScenario);
							
		}else if (scenario.getStatus().equals(ScenarioStatus.ACTIVE)){
			c.andOperator(Criteria.where("id").is(userId), Criteria.where("openScenarios._id").is(new ObjectId(scenarioId) ));
			u.set("openScenarios.$.name", newNameOfScenario);
		}else{
			return false;
		}
		
	
		q.addCriteria(c);
		WriteResult w = mongoOp.updateFirst(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean updateNameOfAllScenarioReference(
			List<String> idOfPeopleToUpdate, Scenario scenario,
			String newNameOfScenario) {
		Query q = new Query();
		String scenarioId = scenario.getId();
		Criteria c = new Criteria();
		Update u = new Update();
		
		if(scenario.getStatus().equals(ScenarioStatus.CREATED_V1) || 
				scenario.getStatus().equals(ScenarioStatus.CREATED_V2) || 
						scenario.getStatus().equals(ScenarioStatus.CREATED_V3)){
			
							c.andOperator(Criteria.where("id").in(idOfPeopleToUpdate), Criteria.where("creatingScenarios._id").is(new ObjectId(scenarioId) ));
							u.set("creatingScenarios.$.name", newNameOfScenario);
							
		}else if (scenario.getStatus().equals(ScenarioStatus.ACTIVE)){
			c.andOperator(Criteria.where("id").in(idOfPeopleToUpdate), Criteria.where("openScenarios._id").is(new ObjectId(scenarioId) ));
			u.set("openScenarios.$.name", newNameOfScenario);
		}else{
			return false;
		}
		
	
		q.addCriteria(c);
		WriteResult w = mongoOp.updateMulti(q, u, User.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public void addFriendsToUser(String userId, List<Reference> newFriends) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(userId));
		Update u = new Update();
		AddToSetBuilder addToSet = u.addToSet("friends");
		addToSet.each(newFriends);
		mongoOp.updateFirst(q, u, User.class);
	}

	@Override
	public void addFriendToUsers(List<Reference> users, Reference user) {
		Query q = new Query();
		List<String> ids = new ArrayList<String>(users.size());
		for(Reference r : users)
			ids.add(r.getId());
		q.addCriteria(Criteria.where("id").in(ids));
		Update u = new Update();
		u.addToSet("friends", user);
		mongoOp.updateMulti(q, u, User.class);
	}
}
