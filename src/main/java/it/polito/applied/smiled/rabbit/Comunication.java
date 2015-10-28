package it.polito.applied.smiled.rabbit;

import java.util.Date;

public abstract class Comunication {

	private String id;
	private Date date;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	
	
}
