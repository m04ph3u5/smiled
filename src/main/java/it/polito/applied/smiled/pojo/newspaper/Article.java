package it.polito.applied.smiled.pojo.newspaper;

import it.polito.applied.smiled.pojo.Reference;

public class Article {

	private String title;
	private String subtitle;
	private int idArticleTemplate;
	private String text1;
	private String text2;
	private String imageId;
	private Reference user;
	private String city;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getSubtitle() {
		return subtitle;
	}
	public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}
	public int getIdArticleTemplate() {
		return idArticleTemplate;
	}
	public void setIdArticleTemplate(int idArticleTemplate) {
		this.idArticleTemplate = idArticleTemplate;
	}
	public String getText1() {
		return text1;
	}
	public void setText1(String text1) {
		this.text1 = text1;
	}
	public String getText2() {
		return text2;
	}
	public void setText2(String text2) {
		this.text2 = text2;
	}
	public String getImageId() {
		return imageId;
	}
	public void setImageId(String imageId) {
		this.imageId = imageId;
	}
	public Reference getUser() {
		return user;
	}
	public void setUser(Reference user) {
		this.user = user;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	
}
