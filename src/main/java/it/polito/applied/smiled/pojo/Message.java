package it.polito.applied.smiled.pojo;

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document
public class Message {
	
	@Id
	private String id;
	private String idFrom;
	
	@NotNull
	@Email
	private String idTo;
	
	@NotNull
	private String text;
	private Date date;
	
	public Message(String idFrom, String idTo, String text){
		this.idFrom = idFrom;
		this.idTo = idTo;
		this.text = text;
		this.date = new Date();
	}

	public String getId() {
		return id;
	}
	

	public String getIdFrom() {
		return idFrom;
	}

	public void setIdFrom(String idFrom) {
		this.idFrom = idFrom;
	}

	public String getIdTo() {
		return idTo;
	}

	public void setIdTo(String idTo) {
		this.idTo = idTo;
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
