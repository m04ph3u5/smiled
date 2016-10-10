package it.polito.applied.smiled.dto;

public class NewspaperDTOPut {

  private String name;
  private Long julianDayNumber;
  private Integer timeNumber;
  private String font;

  //booleano che se a true chiede di pubblicare il newspaper
  private boolean publish;


  public boolean getPublish() {
    return publish;
  }
  public void setPublish(boolean publish) {
    this.publish = publish;
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
  public String getFont() {
    return font;
  }
  public void setFont(String font) {
    this.font = font;
  }

}
