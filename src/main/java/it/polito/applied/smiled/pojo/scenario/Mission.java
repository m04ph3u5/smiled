package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;

import org.springframework.data.annotation.Id;

public class Mission {
	

	private Reference teacher;
	
	private String title;
	private String description;
	
	private Date lastChangeDate;
	

	public Reference getTeacher() {
		return teacher;
	}

	public void setTeacher(Reference teacher) {
		this.teacher = teacher;
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

	public Date getLastChangeDate() {
		return lastChangeDate;
	}

	public void setLastChangeDate(Date lastChangeDate) {
		this.lastChangeDate = lastChangeDate;
	}
}
