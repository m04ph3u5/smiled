package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.scenario.History;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;

public class ScenarioDTO {
	
	@NotNull
	@Size(min=2, max=64)
	private String name;
	
	//Questa validazione viene fatta solo nella POST (creo scenario) ma non nella PUT dove questo parametro � importante (a dire il vero nel controller lo sovrascrivo con quanto passato nel path della PUT)
	@Null
	private String id;
	
	@NotNull
	@Valid
	private History history;
	//TODO da decidere la questione delle immagini (ricorda di modificare anche mapURL in history)
	private String cover;
	
	//Validazione fatta solo su POST (non su PUT dove viene usato)
	@Null
	private ScenarioStatus status;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
	public ScenarioStatus getStatus() {
		return status;
	}
	public void setStatus(ScenarioStatus status) {
		this.status = status;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	

}
