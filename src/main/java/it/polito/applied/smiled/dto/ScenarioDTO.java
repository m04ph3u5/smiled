package it.polito.applied.smiled.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;

import it.polito.applied.smiled.pojo.scenario.History;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;

public class ScenarioDTO {

  @NotNull
  @Size(min = 2, max = 64)
  private String name;

  @NotNull
  @Valid
  private History history;
  // TODO da decidere la questione delle immagini (ricorda di modificare anche
  // mapURL in history)
  private String cover;

  // Validazione fatta solo su POST (non su PUT dove viene usato)
  @Null
  private ScenarioStatus status;

  private String description;

  private boolean showRelationsToAll;

  private boolean newspaperEnabled;

  private boolean realMap;

  public boolean isNewspaperEnabled() {
    return newspaperEnabled;
  }

  public void setNewspaperEnabled(boolean newspaperEnabled) {
    this.newspaperEnabled = newspaperEnabled;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public ScenarioStatus getStatus() {
    return status;
  }

  public void setStatus(ScenarioStatus status) {
    this.status = status;
  }

  public History getHistory() {
    return history;
  }

  public void setHistory(History history) {
    this.history = history;
  }

  public String getCover() {
    return cover;
  }

  public void setCover(String cover) {
    this.cover = cover;
  }

  public boolean isShowRelationsToAll() {
    return showRelationsToAll;
  }

  public void setShowRelationsToAll(boolean showRelationsToAll) {
    this.showRelationsToAll = showRelationsToAll;
  }

  public boolean isRealMap() {
    return realMap;
  }

  public void setRealMap(boolean realMap) {
    this.realMap = realMap;
  }

  
}
