package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.scenario.RevisionStatus;

public class RevisionDTO {

	private RevisionStatus status;
	private String comment;
	
	
	public RevisionStatus getStatus() {
		return status;
	}
	public void setStatus(RevisionStatus status) {
		this.status = status;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
}
