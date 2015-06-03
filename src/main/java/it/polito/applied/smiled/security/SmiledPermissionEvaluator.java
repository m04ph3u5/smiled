package it.polito.applied.smiled.security;

import it.polito.applied.smiled.pojo.Permission;
import it.polito.applied.smiled.pojo.Role;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.repository.PermissionRepository;
import it.polito.applied.smiled.repository.RelationPermissionRepository;

import java.io.Serializable;
import java.lang.annotation.Target;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;

public class SmiledPermissionEvaluator implements PermissionEvaluator{

	@Autowired
	private PermissionRepository permissionRepository;
	
	@Autowired
	private RelationPermissionRepository relationPermissionRepository;
	
	/*Per i permessi in lettura (READ) controlliamo le liste presenti in memoria caricate all'atto del login. Se queste non danno risultato positivo
	 * si va a interrogare la collections dei permessi, così come nei casi di operazioni non in lettura*/
	
	@Override
	public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		
		/*Un ADMIN ha i permessi di fare qualunque operazione*/
		List<Role> roles = (List<Role>) user.getAuthorities();
		for(Role r : roles){
			if(r.getAuthority().equals("ROLE_ADMIN"))
				return true;
		}
		
		boolean founded=false;
		/*Per i permessi in lettura non accettiamo come targetObject Character, in quanto i permessi in lettura su uno specifico Character
		 * derivano dai permessi sullo Scenario a cui il Character appartiene*/
		if(permission.equals("READ")){
			if(targetDomainObject.getClass().isInstance(User.class)){
				User u = (User)targetDomainObject;
				if(user.containsRelationsId(u.getId()))
					founded=true;
			}
			else if(targetDomainObject.getClass().equals(Scenario.class)){
				Scenario s = (Scenario) targetDomainObject;
				if(user.containsOpenScenario(s.getId()) || user.containsClosedScenario(s.getId()))
					founded=true;
			}else
				return false;//se il targetType è diverso da User, Scenario non chiamo il repository ma ritorno false a prescindere
		}
		if(founded)
			return true;
		else{
			if(targetDomainObject.getClass().isInstance(User.class))
				return relationPermissionRepository.hasPermission(user.getId(),targetDomainObject,permission);
			else
				return permissionRepository.hasPermission(user.getId(),targetDomainObject,permission);
		}
	}

	@Override
	public boolean hasPermission(Authentication auth, Serializable targetId,
			String targetType, Object permission) {
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		
		/*Un ADMIN ha i permessi di fare qualunque operazione*/
		List<Role> roles = (List<Role>) user.getAuthorities();
		for(Role r : roles){
			if(r.getAuthority().equals("ROLE_ADMIN"))
				return true;
		}
		
		boolean founded=false;
				
		if(permission.equals("READ")){
			if(targetType.equals("User")){
				if(user.containsRelationsId((String)targetId))
					founded=true;
			}
			else if(targetType.equals("Scenario")){
				if(user.containsOpenScenario((String)targetId) || user.containsClosedScenario((String)targetId))
					founded=true;
			}else
				return false; //se il targetType è diverso da User, Scenario non chiamo il repository ma ritorno false a prescindere
		}
		if(founded)
			return true;
		else{
			if(targetType.equals("User"))
				return relationPermissionRepository.hasPermission(user.getId(),targetId,targetType,permission);
			else
				return permissionRepository.hasPermission(user.getId(),targetId,targetType,permission);
		}
	}
	
	public int addPermission(String id, Class<?> targetClass, String permission, String targetId){
		Permission p = new Permission(id, targetClass, permission, targetId);
		
		if(targetClass.isInstance(User.class) || targetClass.equals(User.class))
			p=relationPermissionRepository.insertRelation(p);
		else
			p = permissionRepository.insert(p);
		
		if(p!=null)
			return 1;
		else
			return 0;
	}
	
	public int removeOnePermission(String id, Class<?> targetClass, String targetId){
		if(targetClass.isInstance(User.class) || targetClass.equals(User.class))
			return relationPermissionRepository.removeOnePermission(id,targetClass,targetId);
		else
			return permissionRepository.removeOnePermission(id,targetClass,targetId);
	}

	/*Rimuove tutti i permessi relativi a quella classe (User, Character o Scenario), per l'oggette avente come id "id" 
	 * Rispetto alla versione a tre parametri in pratica non considera l'id dell'owner del permesso
	 * (utile ad es. nella delete di un character)*/
	public void removeAllPermissionsForTarget(Class<?> class1, String id) {
		// TODO Auto-generated method stub
		
	}

	/*Rimuove più permessi con un unica query. Utile, ad esempio, nel rimuovere degli user da uno scenario*/
	public int removePermissions(List<String> usersToDelete,
			Class<?> class1, String id) {
		if(class1.isInstance(User.class) || class1.equals(User.class))
			return relationPermissionRepository.removePermissions(usersToDelete, class1, id);
		else
			return permissionRepository.removePermissions(usersToDelete, class1, id);
	}

	public int  updatePermission(String userToUpdateId,
			String targetId, Class<?> class1, String newPermission) {
		
		if(class1.isInstance(User.class) || class1.equals(User.class))
			return relationPermissionRepository.updatePermission(userToUpdateId, targetId, class1, newPermission);
		else
			return permissionRepository.updatePermission(userToUpdateId, targetId, class1, newPermission);
		
	}

	public int updatePermissions(List<String> usersList,
			Class<?> class1, String targetId, String permission) {
		
		if(class1.isInstance(User.class) || class1.equals(User.class))
			return relationPermissionRepository.updatePermissions(usersList, class1, targetId, permission);
		else
			return permissionRepository.updatePermissions(usersList, class1, targetId, permission);	
	}

	public int upsertPermission(String userToUpdateId,
			String targetId, Class<?> class1, String newPermission) {
		if(class1.isInstance(User.class) || class1.equals(User.class))
			return relationPermissionRepository.upsertPermission(userToUpdateId, targetId, class1, newPermission);
		else
			return permissionRepository.upsertPermission(userToUpdateId, targetId, class1, newPermission);
		
	}
 
}
