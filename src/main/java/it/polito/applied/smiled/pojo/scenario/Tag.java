package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.Reference;

public class Tag {

	private String text;
	
	/*E' possibile taggare sia user che character*/
	private Reference user;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Reference getUser() {
		return user;
	}

	public void setUser(Reference user) {
		this.user = user;
	}
	
	
}
