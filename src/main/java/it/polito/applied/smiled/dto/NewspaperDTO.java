package it.polito.applied.smiled.dto;

import javax.validation.constraints.NotNull;

import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.newspaper.Article;

public class NewspaperDTO {

	@NotNull
	private int idTemplate;
	private String name;
	private Long julianDayNumber;
	private Integer timeNumber;
	private ArticleDTO articleDTO;
	
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
	
	public Long getJulianDayNumber() {
		return julianDayNumber;
	}
	public void setJulianDayNumber(Long julianDayNumber) {
		this.julianDayNumber = julianDayNumber;
	}
	public Integer getTimeNumber() {
		return timeNumber;
	}
	public void setTimeNumber(Integer timeNumber) {
		this.timeNumber = timeNumber;
	}
	public ArticleDTO getArticleDTO() {
		return articleDTO;
	}
	public void setArticleDTO(ArticleDTO articleDTO) {
		this.articleDTO = articleDTO;
	}
	
	
	
}
