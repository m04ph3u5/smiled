package it.polito.applied.smiled.pojo;

import java.util.Date;
import java.util.List;

import it.polito.applied.smiled.pojo.scenario.Scenario;

public class ScenarioReference {
	
	private String id;
	private String name;
	private String cover;
	
	private String myCharacterId;
	private String myCharacterName;
	private String myCharacterCover;
	
	private Date creationDate;
	
	private List<String> myPastCharactersId;
	
	public ScenarioReference(){
		
	}
	
	public ScenarioReference(Scenario scenario){
		this.id=scenario.getId();
		this.cover=scenario.getCover();
		this.name=scenario.getName();
		myCharacterId=null;
		myCharacterName=null;
		myCharacterCover=null;
		myPastCharactersId=null;
		this.creationDate=scenario.getCreationDate();
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
	public String getMyCharacterId() {
		return myCharacterId;
	}
	public void setMyCharacterId(String myCharacterId) {
		this.myCharacterId = myCharacterId;
	}
	public String getMyCharacterName() {
		return myCharacterName;
	}
	public void setMyCharacterName(String myCharacterName) {
		this.myCharacterName = myCharacterName;
	}
	public String getMyCharacterCover() {
		return myCharacterCover;
	}
	public void setMyCharacterCover(String myCharacterCover) {
		this.myCharacterCover = myCharacterCover;
	}

	public List<String> getMyPastCharactersId() {
		return myPastCharactersId;
	}

	public void setMyPastCharactersId(List<String> myPastCharactersId) {
		this.myPastCharactersId = myPastCharactersId;
	}
	
	public void addPastCharacter(String id){
		if(myPastCharactersId!=null)
			myPastCharactersId.add(id);
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	
	
	
//	@Override
//	public boolean equals(Object o){
//		if(o instanceof ScenarioReference){
//			ScenarioReference s = (ScenarioReference) o;
//			
//			if(this.id!=null &&s.getId()!=null)
//		    	  if (this.id.equals(s.getId())) 
//			         return true;
//		}
//		
//		return false;
//	}

}
