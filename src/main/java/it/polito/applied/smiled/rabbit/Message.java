package it.polito.applied.smiled.rabbit;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import it.polito.applied.smiled.pojo.Reference;

@Document
public class Message {
	
	private String id;
	private String receiverId;
	private Reference sender;
	private String text;
	private Date date;
	
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
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getId() {
		return id;
	}
	
	
	
}
