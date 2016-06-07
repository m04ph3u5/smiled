package it.polito.applied.smiled.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.polito.applied.smiled.dto.ArticleDTO;
import it.polito.applied.smiled.dto.NewspaperDTO;
import it.polito.applied.smiled.dto.NewspaperDTOPut;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.newspaper.Article;
import it.polito.applied.smiled.pojo.newspaper.ArticleTemplate;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.rabbit.NotifyService;
import it.polito.applied.smiled.repository.NewspaperRepository;
import it.polito.applied.smiled.repository.NewspaperTemplateRepository;
import it.polito.applied.smiled.repository.ScenarioRepository;
import it.polito.applied.smiled.repository.UserRepository;
import it.polito.applied.smiled.security.CustomUserDetails;

@Service
public class NewspaperServiceImpl implements NewspaperService {

	@Autowired
	private NewspaperTemplateRepository newspaperTemplateRepo;
	@Autowired
	private NewspaperRepository newspaperRepo;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private ScenarioRepository scenarioRepo;
	@Autowired
	private UserService userService;
	@Autowired
	private NotifyService notify;
	
	@Override
	public List<NewspaperTemplate> getAllTemplates() {
		return newspaperTemplateRepo.findAll();
	}

	@Override
	public NewspaperTemplate findNewspaperTemplateByIdTemplate(int id) {
		return newspaperTemplateRepo.findByIdTemplate(id);
		
	}
	private boolean validateCheckingConstraints(Article a, NewspaperTemplate nTemplate) {
		int idArticleTemplate = a.getIdArticleTemplate();
		for(int i=0; i<nTemplate.getNumArticle(); i++){
			if(nTemplate.getListArticleTemplate().get(i).getIdArticleTemplate() == idArticleTemplate){
				
				if(a.getTitle()!=null){
					if(a.getTitle().length() > nTemplate.getListArticleTemplate().get(i).getTitleSize())
						return false;
				}
				if(a.getSubtitle()!=null){
					if(a.getSubtitle().length() > nTemplate.getListArticleTemplate().get(i).getSubtitleSize())
						return false;	
				}
				if(a.getText1()!=null){
					if(a.getText1().length() > nTemplate.getListArticleTemplate().get(i).getSize1())
						return false;
				}
				if(a.getText2()!=null){
					if(a.getText2().length() > nTemplate.getListArticleTemplate().get(i).getSize2())
						return false;
				}
				if(a.getImageId()==null && nTemplate.getListArticleTemplate().get(i).isHasImage() || a.getImageId()!=null && !nTemplate.getListArticleTemplate().get(i).isHasImage()){
					return false;
				}
				break;
				
			}
		}
		return true;
	}



	@Override
	public Newspaper saveNewspaper(NewspaperDTO nDTO, String scenarioId, String userId) throws BadRequestException {
		
		
		Newspaper n = new Newspaper();
		User u = userRepo.findById(userId);
		Reference userRef = new Reference (u);
		if (u==null)
			throw new BadRequestException("User not found!");
		//TODO
		//recupero l'ultimo numero di giornale per questo scenario e lo incremento di uno. Se non c'è metto number a 1.	
		//se l'ultimo è draft return badrequest
		
		n.setIdScenario(scenarioId);
		Date d = new Date();
		n.setCreationDate(d);
		n.setLastUpdate(d);
		n.setStatus(PostStatus.DRAFT);
		n.setActualUserId(userId);
		n.setIdTemplate(nDTO.getIdTemplate());
		
		if(nDTO.getDate()!=null)
			n.setHistoricalDate(nDTO.getDate());
		if(nDTO.getArticleDTO()!=null){
			List<Article> articles = new ArrayList<Article>();
			Article myArticle = new Article(nDTO.getArticleDTO(), userRef);
			articles.add(myArticle);
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
	public Newspaper findLastNewspaperInScenarioPUBLIC(String idScenario) {
		return newspaperRepo.getLastNewspaperPublishedFromScenario(idScenario);
	}

	@Override
	public Newspaper findLastNewspaperInScenarioPRIVATE(String idScenario) {
		return newspaperRepo.getLastNewspaperFromScenario(idScenario);
	}
	
	@Override
	public List<Newspaper> findNewspapersInScenarioPUBLIC(String idScenario) {
		return newspaperRepo.findByIdScenarioAndPublished(idScenario);
		
	}

	@Override
	public List<Newspaper> findNewspapersInScenarioPRIVATE(String idScenario) {
		return newspaperRepo.findByIdScenarioAndNotDeleted(idScenario);
		
	}

	@Override
	public Newspaper findNewspaperNumberInScenarioPUBLIC(String idScenario, int number) {
		return newspaperRepo.findByIdScenarioAndNumberAndPublished(idScenario, number);
		
	}

	@Override
	public Newspaper findNewspaperNumberInScenarioPRIVATE(String idScenario, int number) {
		return newspaperRepo.findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(idScenario, number);
	}
	

	@Override
	public Newspaper updateNewspaper(String scenarioId, Integer number, NewspaperDTOPut dto, CustomUserDetails activeUser) throws BadRequestException {
		Newspaper n = newspaperRepo.findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(scenarioId, number);
		if (n==null)
			throw new BadRequestException("Number "+number+" of this newspaper not founded!");
	
		
		if(dto.getDate()!=null)
			n.setHistoricalDate(dto.getDate());
		if(dto.getName()!=null)
			n.setName(dto.getName());
		if(dto.getDate()!=null || dto.getName()!=null)
			n = newspaperRepo.save(n);
		else
			return null;
		
		if(!n.getActualUserId().equals(activeUser.getId())){
			//genero la notifica per il giornalista solo se a fare l'operazione è un moderatore
			User moderator = userRepo.findById(activeUser.getId());
			Scenario scen = scenarioRepo.findById(scenarioId);
			if(scen == null || scen.getStatus().equals(ScenarioStatus.DELETED) || scen.getStatus().equals(ScenarioStatus.CLOSED))
				throw new BadRequestException("Scenario not founded!");
			Reference ref = new Reference (moderator);
			notify.notifyUpdateNewspaper(scen, ref, n);
		}
		
		
		return n;
		
	}

	@Override
	public String deleteNewspaper(String idScenario, Integer number, CustomUserDetails activeUser) throws BadRequestException {
		Newspaper n = newspaperRepo.findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(idScenario, number);
		String ret;
		if(n==null)
			throw new BadRequestException("Newspaper not found!");
		if(n.getStatus().equals(PostStatus.DRAFT)){
			Long num = newspaperRepo.removeByIdScenarioAndNumber(idScenario, number);
			if (num==0)
				throw new BadRequestException("Newspaper not deleted!");
			else 
				return "-1";
		}else{
			ret= newspaperRepo.putInDeletedStatus(idScenario, number).getId();
		}
		
		if(!n.getActualUserId().equals(activeUser.getId())){
			//genero la notifica per il giornalista solo se a fare l'operazione è una persona diversa dal giornalista stesso (sicuramente un moderatore)
			User moderator = userRepo.findById(activeUser.getId());
			Scenario scen = scenarioRepo.findById(idScenario);
			if(scen == null || scen.getStatus().equals(ScenarioStatus.DELETED) || scen.getStatus().equals(ScenarioStatus.CLOSED))
				throw new BadRequestException("Scenario not founded!");
			Reference ref = new Reference (moderator);
			notify.notifyUpdateNewspaper(scen, ref, n);
		}
		
		return ret;
	}

	@Override
	public Newspaper publishNewspaper(String idScenario, Integer number, CustomUserDetails activeUser) throws BadRequestException, ForbiddenException {
		
		// TODO Verifico che per tutti gli articoli siano rispettati i vincoli
		Newspaper n = newspaperRepo.findNewspaperByIdScenarioAndNumberAndStatusNotDeletedOrPublished(idScenario, number);
		if(n==null)
			throw new BadRequestException("Newspaper not found or already published!");
		Scenario scen = scenarioRepo.findById(idScenario);
		if(scen == null || scen.getStatus().equals(ScenarioStatus.DELETED) || scen.getStatus().equals(ScenarioStatus.CLOSED))
			throw new BadRequestException("Scenario not founded!");
		
		if(!activeUser.getId().equals(n.getActualUserId()))  //se un docente prova a pubblicare un newspaper senza essere il giornalista dello scenario scatta una forbidden exception
			throw new ForbiddenException("You can't publish this article");
		//Verifico che il numero di articoli prodotti sia corrispondente al numero di articoli definito nel template del newspaper
		int idTemplate = n.getIdTemplate();
		NewspaperTemplate nT = newspaperTemplateRepo.findByIdTemplate(idTemplate);
		if(nT==null)
			throw new BadRequestException("idTemplate not valid!");
		
		if(n.getArticles()==null || n.getArticles().size()!=nT.getNumArticle())
			throw new BadRequestException("Num articles written != num articles of template");
		for(Article a : n.getArticles()){
			if( !validateCheckingConstraints(a, nT))
				throw new BadRequestException("Constraints not fulfilled for this idArticleTemplate: "+a.getIdArticleTemplate());
		}
		n.setStatus(PostStatus.PUBLISHED);
		Date publishedDate = new Date();
		n.setPublishedDate(publishedDate);
		n.setLastUpdate(publishedDate);
		Newspaper publishedNewspaper = newspaperRepo.save(n);
	
		notify.notifyNewNewspaper(scen, activeUser.getId(), publishedNewspaper);
		
		return publishedNewspaper;
	}

	@Override
	public Newspaper updateArticle(String idScenario, Integer number, ArticleDTO articleDTO, CustomUserDetails activeUser)
			throws BadRequestException {
		
		Scenario s = scenarioRepo.findById(idScenario);
		if(s==null)
			throw new BadRequestException("Scenario with idScenario: "+idScenario+" not found!");
		
		Newspaper n = newspaperRepo.findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(idScenario, number);
		if(n==null)
			throw new BadRequestException("Newspaper not found in scenario: "+s.getName());
	
		User user = userRepo.findById(activeUser.getId());
		if(user==null)
			throw new BadRequestException("User not found!");
		Reference userRef = new Reference (user);
		
		PostStatus statusNewspaper = n.getStatus();
		int idTemplate = n.getIdTemplate();
		NewspaperTemplate nT = newspaperTemplateRepo.findByIdTemplate(idTemplate);
		if(nT==null)
			throw new BadRequestException("Newspaper template not found!");
		ArticleTemplate aT = null;
		for(ArticleTemplate a: nT.getListArticleTemplate()){
			if(a.getIdArticleTemplate()==articleDTO.getIdArticleTemplate()){
				aT=a;
				break;
			}
		}
		
		if(aT==null)
			throw new BadRequestException("idArticleTemplate not found for this newspaperTemplate!");
		
		
		if(statusNewspaper.equals(PostStatus.DELETED))
			throw new BadRequestException("Impossible to update article in newspaper deleted!");
		
		for(Article aa: n.getArticles()){
			if(aa.getIdArticleTemplate()==articleDTO.getIdArticleTemplate()){
				//si tratta di una modifica
				Article a = new Article(articleDTO, activeUser.getId(), aa.getUser(), aa.getCreationDate());
				if( !validateCheckingConstraints(a, nT))
					throw new BadRequestException("Constraints not fulfilled for this idArticleTemplate: "+a.getIdArticleTemplate());
				Newspaper ret = newspaperRepo.updateArticle(idScenario, number, a);
				notify.notifyUpdateNewspaper(s, userRef, ret);
				return ret;
				
			}
			
		}
		
		//se arrivo qua significa che non ho trovato un article con quell'id nel newspaper, quindi si tratta di un inserimento di un nuovo articolo
		//controllo quindi che il newspaper non sia published poichè in quel caso l'articolo ci sarebbe già stato
		if(statusNewspaper.equals(PostStatus.PUBLISHED))
			throw new BadRequestException("impossible to modify article with idArticle passed. Cause: not found idArticle");
		
		//se arrivo qui significa che l'operazione corrisponde all'inserimento di un nuovo article (quindi creo un Article a partire da ArticleDTO)
		
		Article newA = new Article(articleDTO, userRef);
		if(statusNewspaper.equals(PostStatus.PUBLISHED)){
			if( !validateCheckingConstraints(newA, nT))
				throw new BadRequestException("Constraints not fulfilled for this idArticleTemplate: "+newA.getIdArticleTemplate());
			
		}
		Newspaper ret = newspaperRepo.insertArticle(idScenario, number, newA);
		notify.notifyUpdateNewspaper(s, userRef, ret);
		return ret;
	}

	@Override
	public String updateJournalist(String idScenario, Reference newJournalist, CustomUserDetails activeUser) throws BadRequestException {
		Scenario scen = scenarioRepo.findById(idScenario);
		if(scen==null)
			throw new BadRequestException("Scenario not found!");
		String idOldJournalist = null;
		if(scen.getActualJournalist()!=null)
			idOldJournalist=scen.getActualJournalist().getId();
		
		if(newJournalist!=null){
			List<Reference> allPeopleInScenario = new ArrayList<Reference>();
			if(scen.getAttendees()!=null)
				allPeopleInScenario.addAll(scen.getAttendees());
			if(scen.getCollaborators()!=null)
				allPeopleInScenario.addAll(scen.getCollaborators());
			allPeopleInScenario.add(scen.getTeacherCreator());
			boolean userInScenario=false;
			for (Reference r : allPeopleInScenario){
				if(r.equals(newJournalist)){
					userInScenario=true;
					break;
				}
			}
			if(userInScenario==false)
				throw new BadRequestException("User not in scenario!");
		}
		
		
		Reference oldUserJournalist = scen.getActualJournalist();
		scen.setActualJournalist(newJournalist); //il setter comporta aggiornamento mappa pastJournalistId con relative date
		scenarioRepo.save(scen);
		
		/*Tutte le associazioni relative a User e Permission vengono fatte solo se lo stato dello scenario è ACTIVE.
		 * IN caso contrario le associazioni verranno create all'attivazione dello scenario in modo asincrono*/

		if(scen.getStatus().equals(ScenarioStatus.ACTIVE)){

			/*Gestione dei permessi: togliamo il permesso di journalist al vecchio possessore e lo assegniamo al nuovo*/
			
			if(oldUserJournalist!=null){
				userService.removeJournalistPermission(oldUserJournalist.getId(), idScenario);
				notify.notifyDeleteJournalist(oldUserJournalist, scen, oldUserJournalist.getId());
			}
			if(newJournalist!=null){
				userService.addJournalistPermission(newJournalist.getId(), idScenario);
				notify.notifyNewJournalist(newJournalist, scen, newJournalist.getId());
			}
				
		
			
		}
		return idOldJournalist;

	}

	
}
