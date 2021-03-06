package it.polito.applied.smiled.pojo.newspaper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import it.polito.applied.smiled.pojo.scenario.PostStatus;

@Document
public class Newspaper {
  @Id
  private String id;
  private String name;
  private Long julianDayNumber;
  private Integer timeNumber;
  private int idTemplate;
  private Date creationDate;
  private Date lastUpdate;
  private int number;
  private List<Article> articles;
  private String idScenario;
  private String actualUserId;
  private PostStatus status;
  private Date publishedDate;
  private String font;

  public Newspaper(){
    super();
    articles = new ArrayList<Article>();
  }

  public String getId() {
    return id;
  }


  public Date getCreationDate() {
    return creationDate;
  }

  public void setCreationDate(Date creationDate) {
    this.creationDate = creationDate;
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
  public String getFont() {
    return font;
  }
  public void setFont(String font) {
    this.font = font;
  }


}
