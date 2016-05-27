package it.polito.applied.smiled.pojo.newspaper;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class NewspaperTemplate {

	@Id
	private String id;
	private int idTemplate;
	private int numArticle;
	private List<ArticleTemplate> listArticleTemplate;
	
	public int getIdTemplate() {
		return idTemplate;
	}
	public void setIdTemplate(int idTemplate) {
		this.idTemplate = idTemplate;
	}
	public int getNumArticle() {
		return numArticle;
	}
	public void setNumArticle(int numArticle) {
		this.numArticle = numArticle;
	}
	public List<ArticleTemplate> getListArticleTemplate() {
		return listArticleTemplate;
	}
	public void setListArticleTemplate(List<ArticleTemplate> listArticleTemplate) {
		this.listArticleTemplate = listArticleTemplate;
	}
	
	
}
