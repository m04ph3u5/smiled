package it.polito.applied.smiled.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.polito.applied.smiled.dto.NewspaperDTO;
import it.polito.applied.smiled.pojo.newspaper.Article;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;
import it.polito.applied.smiled.repository.NewspaperRepository;
import it.polito.applied.smiled.repository.NewspaperTemplateRepository;

@Service
public class NewspaperServiceImpl implements NewspaperService {

	@Autowired
	private NewspaperTemplateRepository newspaperTemplateRepo;
	@Autowired
	private NewspaperRepository newspaperRepository;
	
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
	public Newspaper saveNewspaper(NewspaperDTO nDTO) {
		Newspaper n = new Newspaper();
		
		//TODO
		//recupero l'ultimo numero di giornale per questo scenario e lo incremento di uno. Se non c'è metto number a 1.	
		//se l'ultimo è draft return badrequest
		n.setIdTemplate(nDTO.getIdTemplate());
		n.setNumber(1);
		if(nDTO.getClass()!=null)
			n.setDate(nDTO.getDate());
		if(nDTO.getArticle()!=null){
			List<Article> articles = new ArrayList<Article>();
			articles.add(nDTO.getArticle());
			n.setArticles(articles);
		}
		if(nDTO.getName()!=null)
			n.setName(nDTO.getName());
		
			
		return newspaperRepository.save(n);
		
	}

	
}
