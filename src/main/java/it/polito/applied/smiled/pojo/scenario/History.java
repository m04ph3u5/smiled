package it.polito.applied.smiled.pojo.scenario;

import javax.validation.constraints.NotNull;

import it.polito.applied.smiled.pojo.HistoricalDate;

public class History {
  // TODO
  /*
   * DA CONTROLLARE SE POSSIBILE MAPPARE DATA STORICA SU OGGETTO DATE
   * DIRETTAMENTE
   */
  @NotNull
  private HistoricalDate startDate;
  @NotNull
  private HistoricalDate endDate;

  private String description;
  private String mapId;

  private RealMap realMap;

  public HistoricalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(HistoricalDate startDate) {
    this.startDate = startDate;
  }

  public HistoricalDate getEndDate() {
    return endDate;
  }

  public void setEndDate(HistoricalDate endDate) {
    this.endDate = endDate;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getMapId() {
    return mapId;
  }

  public void setMapId(String map) {
    this.mapId = map;
  }

  public RealMap getRealMap() {
    return realMap;
  }

  public void setRealMap(RealMap realMap) {
    this.realMap = realMap;
  }

}
