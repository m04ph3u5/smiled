package it.polito.applied.smiled.service;

import java.util.List;

import it.polito.applied.smiled.dto.NewspaperDTO;
import it.polito.applied.smiled.dto.NewspaperDTOPut;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;

public interface NewspaperService {

	public List<NewspaperTemplate> getAllTemplates();
	public NewspaperTemplate findNewspaperTemplateByIdTemplate(int id);
	public boolean validateCheckingConstraintsOnCreation(NewspaperDTO nDTO, NewspaperTemplate nTemplate);
	public Newspaper saveNewspaper(NewspaperDTO nDTO, String scenarioId, String userId) throws BadRequestException;
	public Newspaper findNewspaperByIdScenarioAndNumber(String idScenario, Integer number);
	public void updateNewspaper (String scenarioId, int number, NewspaperDTOPut dto) throws BadRequestException;
	public void deleteNewspaper(String idScenario, int number);
}
