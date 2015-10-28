package it.polito.applied.smiled.rabbit;

import it.polito.applied.smiled.pojo.Reference;

import org.springframework.data.mongodb.core.mapping.Document;


public class Message extends Comunication{
	
	private String receiverId;
	private Reference sender;
	private String text;

	
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
