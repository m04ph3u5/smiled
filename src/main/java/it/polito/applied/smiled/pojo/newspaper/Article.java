package it.polito.applied.smiled.pojo.newspaper;

import java.util.Date;

import it.polito.applied.smiled.dto.ArticleDTO;
import it.polito.applied.smiled.pojo.Reference;

public class Article {

	private String title;
	private String subtitle;
	private int idArticleTemplate;
	private String text1;
	private String text2;
	private String imageId;
	private Reference user; //utente che ha creato l'articolo 
	private String idLastUserModify; //ultimo utente che ha modificato l'articolo
	private String city;
	
	private Date creationDate;
	private Date lastUpdate;
	
	public Article (){
	
	}
	
	public Article(ArticleDTO aa, Reference u){
		
		this.idArticleTemplate=aa.getIdArticleTemplate();
		
		if(aa.getTitle()!=null)
			this.title=aa.getTitle();
		if(aa.getSubtitle()!=null)
			this.subtitle=aa.getSubtitle();
		if(aa.getImageId()!=null)
			this.imageId=aa.getImageId();
		if(aa.getText1()!=null)
			this.text1=aa.getText1();
		if(aa.getText2()!=null)
			this.text2=aa.getText2();
		if(aa.getCity()!=null)
			this.city=aa.getCity();
		
		this.user=u;
		Date d = new Date();
		this.creationDate= d;
		this.lastUpdate = d;
		this.idLastUserModify = u.getId();
		

	}
	
	public Article(ArticleDTO aa, String userIdDoUpdate, Reference owner, Date creationDate){
		
		this.idArticleTemplate=aa.getIdArticleTemplate();
		
		if(aa.getTitle()!=null)
			this.title=aa.getTitle();
		if(aa.getSubtitle()!=null)
			this.subtitle=aa.getSubtitle();
		if(aa.getImageId()!=null)
			this.imageId=aa.getImageId();
		if(aa.getText1()!=null)
			this.text1=aa.getText1();
		if(aa.getText2()!=null)
			this.text2=aa.getText2();
		if(aa.getCity()!=null)
			this.city=aa.getCity();
		
		Date now = new Date();
		this.lastUpdate = now;
		this.idLastUserModify = userIdDoUpdate;
		this.user = owner;
		this.creationDate = creationDate;
		

	}
	
	
	public String getIdLastUserModify() {
		return idLastUserModify;
	}

	public void setIdLastUserModify(String idLastUserModify) {
		this.idLastUserModify = idLastUserModify;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Date getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

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
