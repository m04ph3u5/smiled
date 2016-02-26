package it.polito.applied.smiled.rabbit;

import java.util.Date;

import org.springframework.data.mongodb.core.index.Indexed;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use=JsonTypeInfo.Id.CLASS, include=JsonTypeInfo.As.PROPERTY, property="type")
@JsonSubTypes({  
    @Type(value = Notification.class, name = "notification"),  
    @Type(value = UserMessage.class, name = "userMessage") })  
public abstract class Comunication {
	
	String id;
	ComunicationType type;
	@Indexed
	String receiverId;
	boolean viewed;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public ComunicationType getType() {
		return type;
	}
	public void setType(ComunicationType type) {
		this.type = type;
	}
	public String getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(String receiverId) {
		this.receiverId = receiverId;
	}
	public boolean isViewed() {
		return viewed;
	}
	public void setViewed(boolean viewed) {
		this.viewed = viewed;
	}
	
	
	
}

