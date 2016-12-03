package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.HistoricalDate;

public class MapLayer {

  /**
   * json object contains "json" representation of each possible layers drawable
   * on a map (i.e. polyline, polygon, etc.)
   */
  private Object json;
  private HistoricalDate from;
  private HistoricalDate to;
  private String name;

  public Object getJson() {
    return json;
  }

  public void setJson(Object json) {
    this.json = json;
  }

  public HistoricalDate getFrom() {
    return from;
  }

  public void setFrom(HistoricalDate from) {
    this.from = from;
  }

  public HistoricalDate getTo() {
    return to;
  }

  public void setTo(HistoricalDate to) {
    this.to = to;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

}
