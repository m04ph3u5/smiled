package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.scenario.MissionStatus;

import java.util.Date;

public class MissionDTO {

	private String studentId;
	
	private String title;
	private String description;
	
	private Date deliveryDate;
	private MissionStatus status;
	
	public String getStudentId() {
		return studentId;
	}
	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getDeliveryDate() {
		return deliveryDate;
	}
	public void setDeliveryDate(Date deliveryDate) {
		this.deliveryDate = deliveryDate;
	}
	public MissionStatus getStatus() {
		return status;
	}
	public void setStatus(MissionStatus status) {
		this.status = status;
	}
	
}
