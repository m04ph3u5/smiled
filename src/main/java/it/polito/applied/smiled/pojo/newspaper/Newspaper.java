package it.polito.applied.smiled.pojo.newspaper;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.PostStatus;

@Document
public class Newspaper {
	@Id
	private String id;
	private String name;
	private HistoricalDate historicalDate;
	private int idTemplate;
	private Date lastUpdate;
	private int number;
	private List<Article> articles;
	private String idScenario;
	private String actualUserId;
	private PostStatus status;
	private Date publishedDate;
	
	
	public String getId() {
		return id;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public HistoricalDate getHistoricalDate() {
		return historicalDate;
	}

	public void setHistoricalDate(HistoricalDate historicalDate) {
		this.historicalDate = historicalDate;
	}

	public int getIdTemplate() {
		return idTemplate;
	}
	public void setIdTemplate(int idTemplate) {
		this.idTemplate = idTemplate;
	}
	public Date getLastUpdate() {
		return lastUpdate;
	}
	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public List<Article> getArticles() {
		return articles;
	}
	public void setArticles(List<Article> articles) {
		this.articles = articles;
	}
	public String getIdScenario() {
		return idScenario;
	}
	public void setIdScenario(String idScenario) {
		this.idScenario = idScenario;
	}
	
	public String getActualUserId() {
		return actualUserId;
	}

	public void setActualUserId(String actualUserId) {
		this.actualUserId = actualUserId;
	}

	public PostStatus getStatus() {
		return status;
	}
	public void setStatus(PostStatus status) {
		this.status = status;
	}
	public Date getPublishedDate() {
		return publishedDate;
	}
	public void setPublishedDate(Date publishedDate) {
		this.publishedDate = publishedDate;
	}
	
	
}
