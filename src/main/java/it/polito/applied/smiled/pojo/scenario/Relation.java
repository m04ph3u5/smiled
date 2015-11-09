package it.polito.applied.smiled.pojo.scenario;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;

public class Relation extends Post{

	private Reference characterInitiator;
	private Reference characterConfirmator;
	
	/*Lo user initiator è già presente nella classe astratta POST (user)*/
	private Reference userConfirmator;
	
	private RelationType type;
	
	public Relation(){
		this.setCreationDate(new Date());
		this.setLastChangeDate(this.getCreationDate());
		this.setLikes(new HashSet<CharacterReference>());
		this.setComments(new ArrayList<Comment>());
		this.setMetaComments(new ArrayList<MetaComment>());
		this.setRevision(new Revision());
	}
	

	public Reference getCharacterInitiator() {
		return characterInitiator;
	}

	public void setCharacterInitiator(Reference characterInitiator) {
		this.characterInitiator = characterInitiator;
	}

	public Reference getCharacterConfirmator() {
		return characterConfirmator;
	}

	public void setCharacterConfirmator(Reference characterConfirmator) {
		this.characterConfirmator = characterConfirmator;
	}

	public Reference getUserConfirmator() {
		return userConfirmator;
	}

	public void setUserConfirmator(Reference userConfirmator) {
		this.userConfirmator = userConfirmator;
	}

	public RelationType getType() {
		return type;
	}

	public void setType(RelationType type) {
		this.type = type;
	}
	
	
}
