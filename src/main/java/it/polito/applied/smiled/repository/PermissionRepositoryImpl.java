package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.Permission;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.User;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.apache.taglibs.standard.lang.jstl.AndOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.WriteResult;

public class PermissionRepositoryImpl implements CustomPermissionRepository{

	@Autowired
	private MongoOperations mongoOp;
	
	
	@Override
	public boolean hasPermission(String userId, Object targetDomainObject,
			Object permission) {
		Query q = new Query();
		Class<?> c = targetDomainObject.getClass();
		if(c.isInstance(User.class)){
			User u = (User) targetDomainObject;
			q.addCriteria(Criteria.where("userId").is(userId)
					.andOperator(Criteria.where("targetType").is(User.class.getSimpleName())
					.andOperator(Criteria.where("targetId").is(u.getId())
					.andOperator(Criteria.where("permissions").is(permission)))));
		}else if(c.equals(Scenario.class)){
			Scenario s = (Scenario) targetDomainObject;
			q.addCriteria(Criteria.where("userId").is(userId)
					.andOperator(Criteria.where("targetType").is(c.getSimpleName())
					.andOperator(Criteria.where("targetId").is(s.getId())
					.andOperator(Criteria.where("permissions").is(permission)))));
		}else if(c.equals(Character.class)){
			Character ch = (Character) targetDomainObject;
			q.addCriteria(Criteria.where("userId").is(userId)
					.andOperator(Criteria.where("targetType").is(c.getSimpleName())
					.andOperator(Criteria.where("targetId").is(ch.getId())
					.andOperator(Criteria.where("permissions").is(permission)))));
		}else if(c.equals(Newspaper.class)){
			Newspaper n = (Newspaper) targetDomainObject;
			q.addCriteria(Criteria.where("userId").is(userId)
					.andOperator(Criteria.where("targetType").is(c.getSimpleName())
					.andOperator(Criteria.where("targetId").is(n.getIdScenario())
					.andOperator(Criteria.where("permissions").is(permission)))));
		}else
			return false;
		
		Permission p = mongoOp.findOne(q, Permission.class);
		if(p!=null)
			return true;
		
		return false;
	}

	@Override
	public boolean hasPermission(String userId, Serializable targetId,
			String targetType, Object permission) {
		
		Query q = new Query();
		if(targetType.equals("User")){
			q.addCriteria(Criteria.where("userId").is(userId)
					.andOperator(Criteria.where("targetType").is(User.class.getSimpleName())
					.andOperator(Criteria.where("targetId").is((String)targetId)
					.andOperator(Criteria.where("permissions").is(permission)))));
		}else if(targetType.equals("Scenario")){
			q.addCriteria(Criteria.where("userId").is(userId)
					.andOperator(Criteria.where("targetType").is(Scenario.class.getSimpleName())
					.andOperator(Criteria.where("targetId").is((String)targetId)
					.andOperator(Criteria.where("permissions").is(permission)))));
		}else if(targetType.equals("Character")){
			q.addCriteria(Criteria.where("userId").is(userId)
							.andOperator(Criteria.where("targetType").is(Character.class.getSimpleName())
							.andOperator(Criteria.where("targetId").is((String)targetId)
							.andOperator(Criteria.where("permissions").is(permission)))));
		}else if(targetType.equals("Newspaper")){
				q.addCriteria(Criteria.where("userId").is(userId)
								.andOperator(Criteria.where("targetType").is(Newspaper.class.getSimpleName())
								.andOperator(Criteria.where("targetId").is((String)targetId)
								.andOperator(Criteria.where("permissions").is(permission)))));	
		}else
			return false;
		
		Permission p = mongoOp.findOne(q, Permission.class);
		
		if(p!=null)
			return true;
		
		return false;
	}

	@Override
	public int removeOnePermission(String userId, Class<?> targetClass,
			String targetId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId)
				.andOperator(Criteria.where("targetType").is(targetClass.getSimpleName())
				.andOperator(Criteria.where("targetId").is(targetId))));
		WriteResult w = mongoOp.remove(q, Permission.class);
		return w.getN();
	}

	@Override
	public int removePermissions(List<String> usersToDelete, Class<?> class1,
			String id) {

		Query q = new Query();
		q.addCriteria(Criteria.where("userId").in(usersToDelete)
				.andOperator(Criteria.where("targetType").is(class1.getSimpleName())
				.andOperator(Criteria.where("targetId").is(id))));
		WriteResult w = mongoOp.remove(q, Permission.class);
		return w.getN();
	}

	/*Questo metodo utilizza l'update multi in modo da tenere coerenti eventuali permessi multipli per la stessa risorsa e per lo stesso utente 
	 * (creati concorrentemente, anche se teoricamente non dovrebbe accadere)*/
	@Override
	public int updatePermission(String userId,
			String id, Class<?> class1, String permission) {
		
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId)
				.andOperator(Criteria.where("targetType").is(class1.getSimpleName())
				.andOperator(Criteria.where("targetId").is(id))));
		
		List<String> permissions = Permission.createPermissionsArray(permission);
		
		Update u = new Update();
		u.set("permissions", permissions);
		
		WriteResult w = mongoOp.updateMulti(q, u, Permission.class);
		return w.getN();		
	}

	@Override
	public int updatePermissions(List<String> usersList,
			Class<?> class1, String targetId, String permission) {
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").in(usersList)
				.andOperator(Criteria.where("targetType").is(class1.getSimpleName())
				.andOperator(Criteria.where("targetId").is(targetId))));
		
		List<String> permissions = Permission.createPermissionsArray(permission);
		
		Update u = new Update();
		u.set("permissions", permissions);
		
		WriteResult w = mongoOp.updateMulti(q, u, Permission.class);
		return w.getN();	
		
	}

	@Override
	public int upsertPermission(String userToUpdateId, String targetId,
			Class<?> class1, String newPermission) {
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userToUpdateId)
				.andOperator(Criteria.where("targetType").is(class1.getSimpleName())
				.andOperator(Criteria.where("targetId").is(targetId))));
		
		List<String> permissions = Permission.createPermissionsArray(newPermission);
		
		Update u = new Update();
		u.set("permissions", permissions);
		
		WriteResult w = mongoOp.upsert(q, u, Permission.class);
		return w.getN();		
	}
	
	

}
