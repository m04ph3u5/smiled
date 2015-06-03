package it.polito.applied.smiled.pojo;

import it.polito.applied.smiled.pojo.scenario.Character;

public class CharacterReference {

	private String id;
	private String characterName;
	private String characterCover;
	private String userId;
	
	public CharacterReference(){
		
	}
	
	public CharacterReference(Character c){
		this.id=c.getId();
		this.characterName=c.getName();
		this.characterCover=c.getCover();
		if(c.getActualUser()!=null)
			this.userId=c.getActualUser().getId();
	}
	
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCharacterName() {
		return characterName;
	}
	public void setCharacterName(String characterName) {
		this.characterName = characterName;
	}
	public String getCharacterCover() {
		return characterCover;
	}
	public void setCharacterCover(String characterCover) {
		this.characterCover = characterCover;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	
}
