package it.polito.applied.smiled.pojo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Permission {

	private String userId;
	
	@Indexed //TODO da valutare indice multiplo (targetId-targetType o altro)
	private String targetId;
	
	private String targetType;
	private List<String> permissions;
	
	public Permission(){
		
	}
	
	public Permission(String userId, Class<?> target, String permission, String targetId){
		
		permissions = createPermissionsArray(permission);
		
		this.userId=userId;
		this.targetType=target.getSimpleName();
		this.targetId=targetId;
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	public String getTargetId() {
		return targetId;
	}
	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}
	public String getTargetType() {
		return targetType;
	}
	public void setTargetType(Class<?> target) {
		this.targetType = target.getSimpleName();
	}
	public void setTargetType(String targetType) {
		this.targetType = targetType;
	}
	public List<String> getPermissions() {
		return permissions;
	}
	public void setPermissions(List<String> permissions) {
		this.permissions = permissions;
	}
	public void addPermission(String permission){
		permissions.add(permission);
	}
	public void removePermission(String permission){
		permissions.remove(permission);
	}
	
	public static List<String> createPermissionsArray (String permission){
		List<String> permissions = new ArrayList<String>();
		if(permission.equals("CREATOR")){
			permissions.add("CREATOR");
			permissions.add("MODERATOR");
			permissions.add("WRITE");
			permissions.add("READ");
		}else if(permission.equals("MODERATOR")){
			permissions.add("MODERATOR");
			permissions.add("WRITE");
			permissions.add("READ");
		}else if(permission.equals("WRITE")){
			permissions.add("WRITE");
			permissions.add("READ");
		}else if(permission.equals("READ")){
			permissions.add("READ");
		}else
			System.out.println("Nessun permesso valido ricevuto"); //TODO loggare e rimuovere stampa
		return permissions;
	}
}
