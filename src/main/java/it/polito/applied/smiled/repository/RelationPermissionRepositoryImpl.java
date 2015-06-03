package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.Permission;
import it.polito.applied.smiled.pojo.user.User;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.WriteResult;

public class RelationPermissionRepositoryImpl implements CustomRelationPermissionRepository{
	
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
		}else
			return false;
		
		Permission p = mongoOp.findOne(q, Permission.class, "relationPermission");
		if(p!=null)
			return true;
		else
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
		}else
			return false;
		
		Permission p = mongoOp.findOne(q, Permission.class, "relationPermission");
		
		if(p!=null)
			return true;
		else
			return false;
	}

	@Override
	public int removeOnePermission(String userId, Class<?> targetClass,
			String targetId) {
		
		if(!targetClass.isInstance(User.class))
			return 0;
		
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId)
				.andOperator(Criteria.where("targetType").is("User")
				.andOperator(Criteria.where("targetId").is(targetId))));
		WriteResult w = mongoOp.remove(q, Permission.class, "relationPermission");
		return w.getN();
		
	}

	@Override
	public int removePermissions(List<String> usersToDelete, Class<?> class1,
			String id) {
		
		if(!class1.isInstance(User.class))
			return 0;
		
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").in(usersToDelete)
				.andOperator(Criteria.where("targetType").is("User")
				.andOperator(Criteria.where("targetId").is(id))));
		WriteResult w = mongoOp.remove(q, Permission.class, "relationPermission");
		return w.getN();
	}

	@Override
	public int updatePermission(String userToUpdateId, String targetId,
			Class<?> class1, String newPermission) {
		
		if(!class1.isInstance(User.class))
			return 0;
		
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userToUpdateId)
				.andOperator(Criteria.where("targetType").is(User.class)
				.andOperator(Criteria.where("targetId").is(targetId))));
		
		List<String> permissions = Permission.createPermissionsArray(newPermission);
		
		Update u = new Update();
		u.set("permissions", permissions);
		
		WriteResult w = mongoOp.updateMulti(q, u, Permission.class, "relationPermission");
		return w.getN();		
	}

	@Override
	public int updatePermissions(List<String> usersList, Class<?> class1,
			String targetId, String permission) {
		
		if(!class1.isInstance(User.class))
			return 0;
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").in(usersList)
				.andOperator(Criteria.where("targetType").is("User")
				.andOperator(Criteria.where("targetId").is(targetId))));
		
		List<String> permissions = Permission.createPermissionsArray(permission);
		
		Update u = new Update();
		u.set("permissions", permissions);
		
		WriteResult w = mongoOp.updateMulti(q, u, Permission.class, "relationPermission");
		return w.getN();	
	}

	@Override
	public Permission insertRelation(Permission p) {
		try{
			mongoOp.insert(p, "relationPermission");
		}catch(Exception e){
			p=null;
		}
		return p;
	}

	@Override
	public int upsertPermission(String userToUpdateId, String targetId,
			Class<?> class1, String newPermission) {
		if(!class1.isInstance(User.class))
			return 0;
		
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userToUpdateId)
				.andOperator(Criteria.where("targetType").is(User.class)
				.andOperator(Criteria.where("targetId").is(targetId))));
		
		List<String> permissions = Permission.createPermissionsArray(newPermission);
		
		Update u = new Update();
		u.set("permissions", permissions);
		
		WriteResult w = mongoOp.upsert(q, u, Permission.class, "relationPermission");
		return w.getN();		
	}

}
