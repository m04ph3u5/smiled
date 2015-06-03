package it.polito.applied.smiled.pojo.user;

import it.polito.applied.smiled.pojo.Reference;

/*Questa classe ha lo scopo di mappare l'oggetto utilizzato nella classe User per 
 * rappresentare gli scenari aperti a cui ogni user sta partecipando. Riporta, oltre
 * che le indicazioni dello scenario, anche i riferimenti al personaggio attivo 
 * interpretato dall'utente in quello scenario.
 * Ne esiste una versione simile (ClosedScenario), che contiene solo i riferimenti 
 * allo scenario e non al personaggio, essendo lo scenario terminato*/
public class UserOpenScenario {

	/*Id, name e url alla cover dello Scenario*/
	private Reference scenarioReference;
	/*Id, name e url alla cover Character interpretato attualmente dallo User,
	 * in questo Scenario*/
	private Reference actualCharacterReference;
	
	public Reference getScenarioReference() {
		return scenarioReference;
	}
	public void setScenarioReference(Reference scenarioReference) {
		this.scenarioReference = scenarioReference;
	}
	public Reference getActualCharacterReference() {
		return actualCharacterReference;
	}
	public void setActualCharacterReference(Reference actualCharacterReference) {
		this.actualCharacterReference = actualCharacterReference;
	}
	
	
	
	
}
