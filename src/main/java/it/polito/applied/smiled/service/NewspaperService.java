package it.polito.applied.smiled.service;

import java.io.IOException;
import java.util.List;

import it.polito.applied.smiled.dto.ArticleDTO;
import it.polito.applied.smiled.dto.NewspaperDTO;
import it.polito.applied.smiled.dto.NewspaperDTOPut;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;
import it.polito.applied.smiled.security.CustomUserDetails;

public interface NewspaperService {

	public List<NewspaperTemplate> getAllTemplates();
	public NewspaperTemplate findNewspaperTemplateByIdTemplate(int id);
	
	public Newspaper saveNewspaper(NewspaperDTO nDTO, String scenarioId, String userId) throws BadRequestException;
	public Newspaper updateNewspaper (String scenarioId, Integer number, NewspaperDTOPut dto, CustomUserDetails activeUser) throws BadRequestException;
	public String deleteNewspaper(String idScenario, Integer number, CustomUserDetails activeUser)throws BadRequestException;
	public Newspaper publishNewspaper(String idScenario, Integer number, CustomUserDetails activeUser) throws BadRequestException, ForbiddenException;
	public Newspaper updateArticle(String idScenario, Integer number, ArticleDTO articleDTO, CustomUserDetails activeUser) throws BadRequestException, IOException, NotFoundException, ForbiddenException;

	public List<Newspaper> findNewspapersInScenarioPUBLIC(String idScenario);
	public List<Newspaper> findNewspapersInScenarioPRIVATE(String idScenario);
	public Newspaper findNewspaperNumberInScenarioPUBLIC (String idScenario, int number);
	public Newspaper findNewspaperNumberInScenarioPRIVATE (String idScenario, int number);
	public Newspaper findLastNewspaperInScenarioPUBLIC(String idScenario);
	public Newspaper findLastNewspaperInScenarioPRIVATE(String idScenario);
	public String updateJournalist(String idScenario, Reference newJournalist, CustomUserDetails activeUser) throws BadRequestException;

}
