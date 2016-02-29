package it.polito.applied.smiled.rabbit;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;

public class Ack extends Comunication{
	
	private List<String> ids;
	
	@JsonCreator
	public Ack(){
		
	}

	public List<String> getIds() {
		return ids;
	}

	public void setIds(List<String> ids) {
		this.ids = ids;
	}
	
	

}
