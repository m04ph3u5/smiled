package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.Permission;

import java.io.Serializable;
import java.util.List;

public interface CustomRelationPermissionRepository {

	public boolean hasPermission(String id, Object targetDomainObject,
			Object permission);
	
	public boolean hasPermission(String id, Serializable targetId,
			String targetType, Object permission);
	
	public int removeOnePermission(String id, Class<?> targetClass,
			String targetId);
	
	public int removePermissions(List<String> usersToDelete, Class<?> class1,
			String id);
	
	public int updatePermission(String userToUpdateId, String targetId,
			Class<?> class1, String newPermission);
	
	public int updatePermissions(List<String> usersList, Class<?> class1,
			String targetId, String permission);
	
	public Permission insertRelation(Permission p);
	
	int upsertPermission(String userToUpdateId, String targetId,
			Class<?> class1, String newPermission);
}
