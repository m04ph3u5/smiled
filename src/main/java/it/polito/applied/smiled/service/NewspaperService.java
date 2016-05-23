package it.polito.applied.smiled.service;

import java.util.List;

import it.polito.applied.smiled.dto.NewspaperDTO;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;

public interface NewspaperService {

	public List<NewspaperTemplate> getAllTemplates();
	public NewspaperTemplate findNewspaperTemplateByIdTemplate(int id);
	public boolean validateCheckingConstraintsOnCreation(NewspaperDTO nDTO, NewspaperTemplate nTemplate);
	public Newspaper saveNewspaper(NewspaperDTO nDTO);
}
