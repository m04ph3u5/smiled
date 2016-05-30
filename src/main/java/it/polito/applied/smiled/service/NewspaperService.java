package it.polito.applied.smiled.service;

import java.util.List;

import it.polito.applied.smiled.dto.ArticleDTO;
import it.polito.applied.smiled.dto.NewspaperDTO;
import it.polito.applied.smiled.dto.NewspaperDTOPut;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;

public interface NewspaperService {

	public List<NewspaperTemplate> getAllTemplates();
	public NewspaperTemplate findNewspaperTemplateByIdTemplate(int id);
	
	public Newspaper saveNewspaper(NewspaperDTO nDTO, String scenarioId, String userId) throws BadRequestException;
	public Newspaper updateNewspaper (String scenarioId, Integer number, NewspaperDTOPut dto) throws BadRequestException;
	public String deleteNewspaper(String idScenario, Integer number)throws BadRequestException;
	public Newspaper publishNewspaper(String idScenario, Integer number) throws BadRequestException;
	public Newspaper updateArticle(String idScenario, Integer number, ArticleDTO articleDTO, String userId) throws BadRequestException;

	public List<Newspaper> findNewspapersInScenarioPUBLIC(String idScenario);
	public List<Newspaper> findNewspapersInScenarioPRIVATE(String idScenario);
	public Newspaper findNewspaperNumberInScenarioPUBLIC (String idScenario, int number);
	public Newspaper findNewspaperNumberInScenarioPRIVATE (String idScenario, int number);
	public Newspaper findLastNewspaperInScenarioPUBLIC(String idScenario);
	public Newspaper findLastNewspaperInScenarioPRIVATE(String idScenario);
	public String updateJournalist(String idScenario, Reference newJournalist) throws BadRequestException;

}
