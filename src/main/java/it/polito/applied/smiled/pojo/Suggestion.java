package it.polito.applied.smiled.pojo;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Suggestion {

	
	@Id
	private String id;
	
	private String newFeature;
	private String modifyFeature;
	private String deleteFeature;
	private Reference userReference;
	
	private Date date;
	
	
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public Reference getUserReference() {
		return userReference;
	}
	public void setUserReference(Reference userReference) {
		this.userReference = userReference;
	}
	public String getNewFeature() {
		return newFeature;
	}
	public void setNewFeature(String newFeature) {
		this.newFeature = newFeature;
	}
	public String getModifyFeature() {
		return modifyFeature;
	}
	public void setModifyFeature(String modifyFeature) {
		this.modifyFeature = modifyFeature;
	}
	public String getDeleteFeature() {
		return deleteFeature;
	}
	public void setDeleteFeature(String deleteFeature) {
		this.deleteFeature = deleteFeature;
	}
	public String getId() {
		return id;
	}
	
	
}
