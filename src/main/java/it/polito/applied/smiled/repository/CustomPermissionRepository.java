package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.scenario.Scenario;

import java.io.Serializable;
import java.util.List;

public interface CustomPermissionRepository {

	public boolean hasPermission(String username, Object targetDomainObject,
			Object permission);
	public boolean hasPermission(String username, Serializable targetId,
			String targetType, Object permission);
	
	public int removeOnePermission(String userEmail, Class<?> targetClass,
			String targetId);
	
	public int removePermissions(List<String> usersToDelete, Class<?> class1,
			String id);
	
	public int updatePermission(String userId,
			String id, Class<?> class1, String newPermission);
	
	public int updatePermissions(List<String> usersList,
			Class<?> class1, String targetId, String permission);
	
	public int upsertPermission(String userToUpdateId, String targetId,
			Class<?> class1, String newPermission);

}
