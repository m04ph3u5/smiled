package it.polito.applied.smiled.rabbit;

import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;


public class UserMessage{

	private String id;
	private Date date;
	private String receiverId;
	private Reference sender;
	private String text;

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
	public String getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(String receiverId) {
		this.receiverId = receiverId;
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
		
	
}
