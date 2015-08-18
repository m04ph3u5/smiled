package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;

import org.springframework.data.annotation.Id;

public class Mission {
	
	@Id
	private String id;
	
	private Reference student;
	private Reference teacher;
	
	private String title;
	private String description;
	
	private String scenarioId;
	private Date creationDate;
	private Date lastChangeDate;
	private Date deliveryDate;
	
	private MissionStatus status;
	
	public Reference getStudent() {
		return student;
	}

	public String getId(){
		return id;
	}
	
	public void setStudent(Reference student) {
		this.student = student;
	}

	public Reference getTeacher() {
		return teacher;
	}

	public void setTeacher(Reference teacher) {
		this.teacher = teacher;
	}

	public String getScenarioId() {
		return scenarioId;
	}

	public void setScenarioId(String scenarioId) {
		this.scenarioId = scenarioId;
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

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Date getLastChangeDate() {
		return lastChangeDate;
	}

	public void setLastChangeDate(Date lastChangeDate) {
		this.lastChangeDate = lastChangeDate;
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
