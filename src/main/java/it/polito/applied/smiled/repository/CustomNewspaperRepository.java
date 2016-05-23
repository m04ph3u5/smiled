package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.newspaper.Newspaper;

public interface CustomNewspaperRepository {

	public Newspaper getLastNewspaperFromScenario(String scenarioId);
	public Newspaper findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(String idScenario, int number);
	public Newspaper findByIdScenarioAndNotDeleted(String id);

}
