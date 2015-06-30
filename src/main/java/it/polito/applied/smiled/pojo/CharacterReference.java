package it.polito.applied.smiled.pojo;

import it.polito.applied.smiled.pojo.scenario.Character;

public class CharacterReference {

	private String id;
	private String name;
	private String cover;
	private String userId;
	
	public CharacterReference(){
		
	}
	
	public CharacterReference(Character c){
		this.id=c.getId();
		this.name=c.getName();
		this.cover=c.getCover();
		if(c.getActualUser()!=null)
			this.userId=c.getActualUser().getId();
	}
	
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCover() {
		return cover;
	}
	public void setCover(String cover) {
		this.cover = cover;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	
}
