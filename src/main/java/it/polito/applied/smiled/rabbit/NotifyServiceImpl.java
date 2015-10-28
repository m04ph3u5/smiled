package it.polito.applied.smiled.rabbit;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.Status;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotifyServiceImpl implements NotifyService{
	
	private final String TOPIC = "topicExchange";
	private final String DIRECT = "directExchange";
	private final String NARRATORE = "NARRATORE";
	
	
	@Autowired
	private ManageBroker broker;
	
	//TODO gestire persistenza memorizzando in un repository
	

	private boolean isNotifiable(Scenario s, String userId){
		Reference r = new Reference();
		r.setId(userId);
		if(s.getTeacherCreator().equals(r))
			return true;
		if(s.getAttendees()!=null && s.getAttendees().contains(r))
			return true;
		if(s.getCollaborators()!=null && s.getCollaborators().contains(r))
			return true;
		
		return false;
	}

	@Override
	public void notifyCreatePost(Scenario s, Post p) {
		
		/*Creazione notifica nuovo post*/
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(p.getId());
		n.setVerb(NotificationType.NEW_POST);
		n.setTargetId(s.getId());
		NotifyReference ref = new NotifyReference();
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			ref.setActorId(status.getCharacter().getId());
			ref.setActorName(status.getCharacter().getName());
		}else if(p.getClass().equals(Status.class)){
			ref.setActorId(null);
			ref.setActorName(NARRATORE);
		}
			
		
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		broker.sendNotify(n, TOPIC, "s"+s.getId());
		
		/*Notifico i taggati*/
		List<Reference> l = new ArrayList<Reference>();
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			if(status.getTags()!=null){
				l.addAll(status.getTags());
			}
		
		}else if(p.getClass().equals(Status.class)){
			Event event = (Event) p;
			if(event.getTags()!=null){
				l.addAll(event.getTags());
			}
		}
		for(Reference r : l){
			CharacterReference c = s.getCharacter(r.getId());
			if(c!=null && c.getUserId()!=null)
				notifyTag(s,p,c.getUserId());
		}
		
	}

	@Override
	public void notifyTag(Scenario s, Post p, String userId) {
		if(isNotifiable(s,userId)){
			Notification n = new Notification();
			n.setDate(new Date());
			n.setObjectId(p.getId());
			n.setVerb(NotificationType.TAG_TO_POST);
			n.setTargetId(userId);
			NotifyReference ref = new NotifyReference();
			if(p.getClass().equals(Status.class)){
				Status status = (Status) p;
				ref.setActorId(status.getCharacter().getId());
				ref.setActorName(status.getCharacter().getName());
			}else if(p.getClass().equals(Status.class)){
				ref.setActorId(null);
				ref.setActorName(NARRATORE);
			}
			ref.setScenarioId(s.getId());
			ref.setScenarioName(s.getName());
			n.setInfo(ref);
			broker.sendNotify(n, DIRECT, "u"+userId);
		}
	}

	@Override
	public void notifyOpenScenario(Scenario s, Reference actor) {
		List<Reference> l = new ArrayList<Reference>();
		if(s.getAttendees()!=null)
			l.addAll(s.getAttendees());
		if(s.getCollaborators()!=null)
			l.addAll(s.getCollaborators());
		l.add(s.getTeacherCreator());
					
		for(Reference r : l){
			broker.createBinding("u"+r.getId(), TOPIC, "s"+s.getId());
		}
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(s.getId());
		n.setVerb(NotificationType.OPEN_SCENARIO);
		n.setTargetId(s.getId());
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getFirstname()+" "+actor.getLastname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		broker.sendNotify(n, TOPIC, "s"+s.getId());
	}

	@Override
	public void createQueue(String userId) {
		broker.createQueue("u"+userId);
		broker.createBinding("u"+userId, DIRECT, "u"+userId);
	}

	@Override
	public void notifyNewComment(Scenario s, Post p, Comment c) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(p.getId()+"/"+c.getId());
		n.setVerb(NotificationType.COMMENT_TO_POST);
		NotifyReference ref = new NotifyReference();
		ref.setActorId(c.getCharacter().getId());
		ref.setActorName(c.getCharacter().getFirstname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		Set<Reference> set = new HashSet<Reference>();
		String userOfStatus = null;
		List<String> notified = new ArrayList<String>();

		/*Elenco personaggi che hanno commentato*/
		if(p.getComments()!=null){
			for(Comment comment : p.getComments()){
				set.add(comment.getCharacter());
			}
		}
		
		/*Elenco personaggi taggati nel post*/
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			if(status.getTags()!=null){
				set.addAll(status.getTags());
			}	
			userOfStatus = status.getCharacter().getUserId();
		}else if(p.getClass().equals(Status.class)){
			Event event = (Event) p;
			if(event.getTags()!=null){
				set.addAll(event.getTags());
			}
		}		
		
		for(Reference rTest : set){
			System.out.println(rTest.getFirstname());
		}
		System.out.println("--------------");
		set.remove(c.getCharacter());
		
		for(Reference rTest : set){
			System.out.println(rTest.getFirstname());
		}
		
		/*Notifiche*/
		for(Reference r : set){
			CharacterReference character = s.getCharacter(r.getId());
			if(character!=null && character.getUserId()!=null){
				if(isNotifiable(s,character.getUserId())){
					n.setTargetId(character.getUserId());
					broker.sendNotify(n, DIRECT, "u"+character.getUserId());
					notified.add(character.getUserId());
				}
			}
		}
		
		/*Notifico il creatore del post se non è stato già notificato e se non è il creatore del commento*/
		if(!notified.contains(p.getUser().getId()) && !p.getUser().getId().equals(c.getUser().getId()) && isNotifiable(s,p.getUser().getId())){
			n.setTargetId(p.getUser().getId());
			broker.sendNotify(n, DIRECT, "u"+p.getUser().getId());
			notified.add(p.getUser().getId());
		}
		/*Nel caso di status notifico il personaggio che attualmente sta interpretando il personaggio di riferimento, 
		 * a patto che non sia stato già notificato e non sia il creatore del commento*/
		if(userOfStatus!=null && !notified.contains(userOfStatus) && !userOfStatus.equals(c.getUser().getId()) && isNotifiable(s, userOfStatus)){
			n.setTargetId(userOfStatus);
			broker.sendNotify(n, DIRECT, "u"+userOfStatus);
		}
	
	}

	@Override
	public void notifyLikeToPost(Scenario s, Post p, CharacterReference actor) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(p.getId());
		n.setVerb(NotificationType.LIKE_TO_POST);
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getName());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);

		Set<Reference> set = new HashSet<Reference>();
		String userOfStatus = null;
		List<String> notified = new ArrayList<String>();

		/*Elenco personaggi taggati nel post*/
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			if(status.getTags()!=null){
				set.addAll(status.getTags());
			}	
			userOfStatus = status.getCharacter().getUserId();
		}else if(p.getClass().equals(Status.class)){
			Event event = (Event) p;
			if(event.getTags()!=null){
				set.addAll(event.getTags());
			}
		}	
		
		Reference refChar = new Reference();
		refChar.setId(actor.getId());
		set.remove(refChar);
		
		for(Reference r : set){
			CharacterReference character = s.getCharacter(r.getId());
			if(character!=null && character.getUserId()!=null){
				if(isNotifiable(s, character.getUserId())){
					n.setTargetId(character.getUserId());
					broker.sendNotify(n, DIRECT, "u"+character.getUserId());
					notified.add(character.getUserId());
				}
			}
		}
		
		
		String userLike = actor.getUserId();
		
		/*Notifico il creatore del post se non è stato già notificato e se non è il creatore del commento*/
		if(!notified.contains(p.getUser().getId()) && !p.getUser().getId().equals(userLike) && isNotifiable(s, p.getUser().getId())){
			n.setTargetId(p.getUser().getId());
			broker.sendNotify(n, DIRECT, "u"+p.getUser().getId());
			notified.add(p.getUser().getId());
		}
		/*Nel caso di status notifico il personaggio che attualmente sta interpretando il personaggio di riferimento, 
		 * a patto che non sia stato già notificato e non sia il creatore del commento*/
		if(userOfStatus!=null && !notified.contains(userOfStatus) && !userOfStatus.equals(userLike) && isNotifiable(s, userOfStatus)){
			n.setTargetId(userOfStatus);
			broker.sendNotify(n, DIRECT, "u"+userOfStatus);
		}
	}

	@Override
	public void notifyNewMetaComment(Scenario s, Post p, MetaComment c) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(p.getId()+"/"+c.getId());
		n.setVerb(NotificationType.METACOMMENT_TO_POST);
		NotifyReference ref = new NotifyReference();
		ref.setActorId(c.getUser().getId());
		ref.setActorName(c.getUser().getFirstname()+" "+c.getUser().getLastname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		Set<Reference> set = new HashSet<Reference>();
		/*Elenco utenti che hanno metacommentato*/
		if(p.getMetaComments()!=null){
			for(MetaComment comment : p.getMetaComments()){
				set.add(comment.getUser());
			}
		}
		
		set.add(p.getUser());
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			String userId = status.getCharacter().getUserId();
			if(userId!=null){
				Reference userRef = new Reference();
				userRef.setId(userId);
				set.add(userRef);
			}
		}
		
		set.remove(c.getUser());
		
		for(Reference r : set){
			if(isNotifiable(s, r.getId())){
				n.setTargetId(r.getId());
				broker.sendNotify(n, DIRECT, "u"+r.getId());
			}
		}
	}
}
