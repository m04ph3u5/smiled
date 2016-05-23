package it.polito.applied.smiled.dto;

import javax.validation.constraints.NotNull;

import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.newspaper.Article;

public class NewspaperDTO {

	@NotNull
	private int idTemplate;
	private String name;
	private HistoricalDate date;
	private Article article;
	public int getIdTemplate() {
		return idTemplate;
	}
	public void setIdTemplate(int idTemplate) {
		this.idTemplate = idTemplate;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public HistoricalDate getDate() {
		return date;
	}
	public void setDate(HistoricalDate date) {
		this.date = date;
	}
	public Article getArticle() {
		return article;
	}
	public void setArticle(Article article) {
		this.article = article;
	}
	
	
}
