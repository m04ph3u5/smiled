package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.newspaper.Article;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;

public interface CustomNewspaperRepository {

	public Newspaper getLastNewspaperFromScenario(String scenarioId);
	public Newspaper getLastNewspaperPublishedFromScenario(String scenarioId);
	
	public Newspaper findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(String idScenario, int number);
	public Newspaper findNewspaperByIdScenarioAndNumberAndStatusNotDeletedOrPublished(String idScenario, int number);
	public List<Newspaper> findByIdScenarioAndNotDeleted(String id);
	public Newspaper putInDeletedStatus(String idScenario, Integer number);
	public Newspaper updateArticle(String idScenario, Integer number, Article a);
	public Newspaper insertArticle(String idScenario, Integer number, Article a);
	
	public List<Newspaper> findByIdScenarioAndPublished(String id);
	public Newspaper findByIdScenarioAndNumberAndPublished(String id, int number);
}
