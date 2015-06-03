package it.polito.applied.smiled.pojo;

import javax.validation.constraints.NotNull;

public class Id {

	@NotNull
	private String id;
	
	public Id(){
		
	}
	
	public Id(String id){
		this.id=id;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	@Override
	public String toString(){
		return id;
	}
}
