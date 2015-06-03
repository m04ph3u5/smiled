package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.Reference;

public class Revision {
	
	private Reference revisor;
	private RevisionStatus status;
	private String comment;
	
	public Revision(){
		status=RevisionStatus.NO_REVISION;
	}
	
	public Reference getRevisor() {
		return revisor;
	}
	public void setRevisor(Reference revisor) {
		this.revisor = revisor;
	}
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
