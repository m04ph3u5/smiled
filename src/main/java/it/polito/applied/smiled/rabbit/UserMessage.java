package it.polito.applied.smiled.rabbit;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonCreator;

import it.polito.applied.smiled.pojo.Reference;


public class UserMessage extends Comunication{


	private Reference sender;
	private String text;
	private Date date;
	
	@JsonCreator
	public UserMessage(){
		type = ComunicationType.USER_MESSAGE;
	}


	public Reference getSender() {
		return sender;
	}
	public void setSender(Reference sender) {
		this.sender = sender;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	
	
}
