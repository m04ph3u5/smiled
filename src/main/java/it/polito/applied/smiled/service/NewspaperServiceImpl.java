package it.polito.applied.smiled.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.polito.applied.smiled.dto.NewspaperDTO;
import it.polito.applied.smiled.dto.NewspaperDTOPut;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.newspaper.Article;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.repository.NewspaperRepository;
import it.polito.applied.smiled.repository.NewspaperTemplateRepository;

@Service
public class NewspaperServiceImpl implements NewspaperService {

	@Autowired
	private NewspaperTemplateRepository newspaperTemplateRepo;
	@Autowired
	private NewspaperRepository newspaperRepo;
	
	@Override
	public List<NewspaperTemplate> getAllTemplates() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public NewspaperTemplate findNewspaperTemplateByIdTemplate(int id) {
		return newspaperTemplateRepo.findByIdTemplate(id);
		
	}

	@Override
	public boolean validateCheckingConstraintsOnCreation(NewspaperDTO nDTO, NewspaperTemplate nTemplate) {
		Article a = nDTO.getArticle();
		if (a==null)
			return true; //ritorno true perchè non ci sono articoli di cui validare i vincoli di spazio
		int idArticleTemplate = a.getIdArticleTemplate();
		for(int i=0; i<nTemplate.getNumArticle(); i++){
			if(nTemplate.getListArticleTemplate().get(i).getIdArticleTemplate() == idArticleTemplate){
				if(a.getTitle().length() <= nTemplate.getListArticleTemplate().get(i).getTitleSize()
					&& a.getSubtitle().length() <= nTemplate.getListArticleTemplate().get(i).getSubtitleSize()
					&& a.getText1().length() <= nTemplate.getListArticleTemplate().get(i).getSize1()
					&& a.getText2().length() <= nTemplate.getListArticleTemplate().get(i).getSize2()	
					&& ((a.getImageId()!=null && nTemplate.getListArticleTemplate().get(i).isHasImage()) || (a.getImageId()==null && !nTemplate.getListArticleTemplate().get(i).isHasImage())  ))
					return true;
			}
		}
		return false;
	}

	@Override
	public Newspaper saveNewspaper(NewspaperDTO nDTO, String scenarioId, String userId) throws BadRequestException {
		Newspaper n = new Newspaper();
		
		//TODO
		//recupero l'ultimo numero di giornale per questo scenario e lo incremento di uno. Se non c'è metto number a 1.	
		//se l'ultimo è draft return badrequest
		
		n.setIdScenario(scenarioId);
		n.setLastUpdate(new Date());
		n.setStatus(PostStatus.DRAFT);
		n.setActualUserId(userId);
		n.setIdTemplate(nDTO.getIdTemplate());
		
		if(nDTO.getDate()!=null)
			n.setHistoricalDate(nDTO.getDate());
		if(nDTO.getArticle()!=null){
			List<Article> articles = new ArrayList<Article>();
			articles.add(nDTO.getArticle());
			n.setArticles(articles);
		}
		if(nDTO.getName()!=null)
			n.setName(nDTO.getName());
		
		//prendo l'ultimo numero del giornale di quello scenario
		Newspaper lastNewspaper = newspaperRepo.getLastNewspaperFromScenario(scenarioId);
		
		if(lastNewspaper==null)
			n.setNumber(1);
		//se l'ultimo numero è ancora in stato draft lancio eccezione (non è possibile creare un nuovo numero)
		else if(lastNewspaper.getStatus().equals(PostStatus.DRAFT))
			throw new BadRequestException("Impossible to create new newspaper because the latter is still in draft status");
		else //altrimenti incremento il numero del nuovo giornale
			n.setNumber(lastNewspaper.getNumber()+1);
		
		return newspaperRepo.save(n);
		
	}

	@Override
	public Newspaper findNewspaperByIdScenarioAndNumber(String idScenario, Integer number) {
		Newspaper n = null;
		if(number==null){
			n = newspaperRepo.findByIdScenarioAndNotDeleted(idScenario);
		}else{
			n = newspaperRepo.findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(idScenario, number);
		}
		return n;
	}

	@Override
	public void updateNewspaper(String scenarioId, int number, NewspaperDTOPut dto) throws BadRequestException {
		Newspaper n = newspaperRepo.findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(scenarioId, number);
		if (n==null)
			throw new BadRequestException("Number of newspaper not founded!");
		if(dto.getDate()!=null)
			n.setHistoricalDate(dto.getDate());
		if(dto.getName()!=null)
			n.setName(dto.getName());
		if(dto.getDate()!=null || dto.getName()!=null)
			newspaperRepo.save(n);
		
	}

	@Override
	public void deleteNewspaper(String idScenario, int number) {
		newspaperRepo.removeByIdScenarioAndNumber(idScenario, number);	
		
	}

	
}
