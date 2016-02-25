package it.polito.applied.smiled.rabbit;

import com.fasterxml.jackson.annotation.JsonCreator;

import it.polito.applied.smiled.pojo.Reference;


public class UserMessage extends Comunication{

//	private String id;
//	private Date date;
//	private ComunicationType type;
	private Reference sender;
	private String text;
	
	@JsonCreator
	public UserMessage(){
		type = ComunicationType.USER_MESSAGE;
	}

//	public String getId() {
//		return id;
//	}
//	public void setId(String id) {
//		this.id = id;
//	}
//	public Date getDate() {
//		return date;
//	}
//	public void setDate(Date date) {
//		this.date = date;
//	}
//	public String getReceiverId() {
//		return receiverId;
//	}
//	public void setReceiverId(String receiverId) {
//		this.receiverId = receiverId;
//	}
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
//	public ComunicationType getType() {
//		return type;
//	}
//	public void setType(ComunicationType type) {
//		this.type = type;
//	}
//		
	
}
