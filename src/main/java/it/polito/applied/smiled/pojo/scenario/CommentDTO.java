package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.Reference;

import java.util.List;

public class CommentDTO {
	private List<Reference> tags; 
	private String text; 
	
	public List<Reference> getTags() { 
		return tags; 
	} 
	
	public void setTags(List<Reference> tags) { 
		this.tags = tags; 
	} 
	
	public String getText() { 
		return text; 
	} 
	
	public void setText(String text) { 
		this.text = text; 
	} 
}

