package it.polito.applied.smiled.rabbit;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Mission;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.Status;
import it.polito.applied.smiled.updater.AsyncUpdater;

@Service
public class NotifyServiceImpl implements NotifyService{
	
	private final String TOPIC = "topicExchange";
	private final String DIRECT = "directExchange";
	private final String NARRATORE = "Il Narratore";
	private final int PREVIEW = 15;
	
	private final String USER_QUEUE_PREFIX="user.";
	
	@Autowired
	private ManageBroker broker;
	
	@Autowired
	private AsyncUpdater asyncUpdater;
	
	
	
	//TODO gestire persistenza memorizzando in un repository
	
	@Override
	public void createQueue(String userId) {
		broker.createQueue(USER_QUEUE_PREFIX+userId);
		broker.createBinding(USER_QUEUE_PREFIX+userId, DIRECT, USER_QUEUE_PREFIX+userId);
	}
	
	@Override
	public void addTopicBinding(String topic, String queue){
		broker.createBinding(queue, TOPIC, topic);
	}
	
	@Override
	public void removeTopicBinding(String topic, String queue){
		broker.removeBinding(queue, TOPIC, topic);
	}
	
	@Override
	public void notifyOpenScenario(Scenario s, Reference actor)  {
		List<Reference> l = new ArrayList<Reference>();
		if(s.getAttendees()!=null)
			l.addAll(s.getAttendees());
		if(s.getCollaborators()!=null)
			l.addAll(s.getCollaborators());
		l.add(s.getTeacherCreator());
					
		for(Reference r : l){
			broker.createBinding(USER_QUEUE_PREFIX+r.getId(), TOPIC, "s"+s.getId());
		}
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setObjectId(s.getId());
		n.setObjectContent(s.getName());
		n.setVerb(NotificationType.OPEN_SCENARIO);
		if(actor!=null){
			n.setActorId(actor.getId());
			n.setActorName(actor.getFirstname()+" "+actor.getLastname());
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, TOPIC, "s"+s.getId());
		
	}
	
	@Override
	public void notifyCloseScenario(Scenario s, Reference actor) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setObjectId(s.getId());
		n.setObjectContent(s.getName());
		n.setVerb(NotificationType.CLOSE_SCENARIO);
		if(actor!=null){
			n.setActorId(actor.getId());
			n.setActorName(actor.getFirstname()+" "+actor.getLastname());
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, TOPIC, "s"+s.getId());
		
		
		List<Reference> l = new ArrayList<Reference>();
		if(s.getAttendees()!=null)
			l.addAll(s.getAttendees());
		if(s.getCollaborators()!=null)
			l.addAll(s.getCollaborators());
		l.add(s.getTeacherCreator());
					
		for(Reference r : l){
			broker.removeBinding(USER_QUEUE_PREFIX+r.getId(), TOPIC, "s"+s.getId());
		}
	}

	@Override
	public void notifyCreatePost(Scenario s, Post p)  {
		
		/*Creazione notifica nuovo post*/
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setObjectId(p.getId());
		n.setVerb(NotificationType.NEW_POST);
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			n.setActorId(status.getCharacter().getId());
			n.setActorName(status.getCharacter().getName());
		}else if(p.getClass().equals(Status.class)){
			n.setActorId(null);
			n.setActorName(NARRATORE);
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
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
			if(c!=null && c.getUserId()!=null){
				broker.createBinding(USER_QUEUE_PREFIX+c.getUserId(), TOPIC, "p"+p.getId());
				broker.createBinding(USER_QUEUE_PREFIX+c.getUserId(), TOPIC, "pc"+p.getId());
			}
		}
		
		Notification nTag = new Notification();
		nTag.setDate(new Date());
		nTag.setObjectId(p.getId());
		nTag.setVerb(NotificationType.TAG_TO_POST);
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			nTag.setActorId(status.getCharacter().getId());
			nTag.setActorName(status.getCharacter().getName());
		}else if(p.getClass().equals(Status.class)){
			nTag.setActorId(null);
			nTag.setActorName(NARRATORE);
		}
		nTag.setScenarioId(s.getId());
		nTag.setScenarioName(s.getName());
		broker.sendNotify(nTag, TOPIC, "pc"+p.getId());
		
	}

	@Override
	public void notifyNewComment(Scenario s, Post p, Comment c)  {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setObjectId(p.getId()+"/"+c.getId());
		if(c.getText().length()<=PREVIEW)
			n.setObjectContent(c.getText());
		else
			n.setObjectContent(c.getText().substring(0, PREVIEW)+"...");
		n.setVerb(NotificationType.COMMENT_TO_POST);
		n.setActorId(c.getCharacter().getId());
		n.setActorName(c.getCharacter().getFirstname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, TOPIC, "pc"+p.getId());
		broker.createBinding(USER_QUEUE_PREFIX+c.getUser().getId(), TOPIC, "pc"+p.getId());
	}
	
	@Override
	public void notifyNewMetaComment(Scenario s, Post p, MetaComment c)  {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setObjectId(p.getId()+"/"+c.getId());
		if(c.getText().length()<=PREVIEW)
			n.setObjectContent(c.getText());
		else
			n.setObjectContent(c.getText().substring(0, PREVIEW)+"...");
		n.setVerb(NotificationType.METACOMMENT_TO_POST);
		n.setActorId(c.getUser().getId());
		n.setActorName(c.getUser().getFirstname()+" "+c.getUser().getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, TOPIC, "pc"+p.getId());
		broker.createBinding(USER_QUEUE_PREFIX+c.getUser().getId(), TOPIC, "pc"+p.getId());
	}

	@Override
	public void notifyLikeToPost(Scenario s, Post p, CharacterReference actor)  {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setObjectId(p.getId());
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			if(status.getText().length()<=PREVIEW)
				n.setObjectContent(status.getText());
			else
				n.setObjectContent(status.getText().substring(0, PREVIEW)+"...");
		}else if(p.getClass().equals(Event.class)){
			Event event = (Event) p;
			if(event.getText().length()<=PREVIEW)
				n.setObjectContent(event.getText());
			else
				n.setObjectContent(event.getText().substring(0, PREVIEW)+"...");
		}
		n.setVerb(NotificationType.LIKE_TO_POST);
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		broker.sendNotify(n, TOPIC, "p"+p.getId());
	}

	@Override
	public void notifyNewAssociation(Reference user, CharacterReference actor, Scenario s) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setObjectId(user.getId());
		n.setVerb(NotificationType.NEW_ASSOCIATION);
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		broker.sendNotify(n, TOPIC, "s"+s.getId());
	}

	@Override
	public void notifyDeleteAssociation(Reference user, CharacterReference actor, Scenario s) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setObjectId(user.getId());
		n.setVerb(NotificationType.DEL_ASSOCIATION);
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		broker.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+user.getId());
		asyncUpdater.removeNotificationFromCharacter(user, actor, s);
	}

	@Override
	public void notifyNewPersonalMission(Reference user, Scenario s, CharacterReference actor, Mission m) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		if(!m.getTitle().isEmpty()){
			if(m.getTitle().length()<=PREVIEW)
				n.setObjectContent(m.getTitle());
			else
				n.setObjectContent(m.getTitle().substring(0, PREVIEW)+"...");
		}else if(!m.getDescription().isEmpty()){
			if(m.getDescription().length()<=PREVIEW)
				n.setObjectContent(m.getDescription());
			else
				n.setObjectContent(m.getDescription().substring(0, PREVIEW)+"...");
		}
		n.setObjectId(user.getId());
		n.setVerb(NotificationType.NEW_PERSONAL_MISSION);
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+user.getId());
	}

	@Override
	public void notifyNewGlobalMission(Reference user, Scenario s, Mission m) {
		Notification n = new Notification();
		n.setDate(new Date());
		if(!m.getTitle().isEmpty()){
			if(m.getTitle().length()<=PREVIEW)
				n.setObjectContent(m.getTitle());
			else
				n.setObjectContent(m.getTitle().substring(0, PREVIEW)+"...");
		}else if(!m.getDescription().isEmpty()){
			if(m.getDescription().length()<=PREVIEW)
				n.setObjectContent(m.getDescription());
			else
				n.setObjectContent(m.getDescription().substring(0, PREVIEW)+"...");
		}
		n.setVerb(NotificationType.NEW_GLOBAL_MISSION);
		n.setActorId(user.getId());
		n.setActorName(user.getFirstname()+" "+user.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, TOPIC, "s"+s.getId());
	}

	@Override
	public void notifyNewModerator(Reference user, Scenario s, Reference actor) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.NEW_MOD);
		n.setObjectId(user.getId());
		if(actor!=null){
			n.setActorId(actor.getId());
			n.setActorName(actor.getFirstname()+" "+user.getLastname());
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+user.getId());
		broker.createBinding(USER_QUEUE_PREFIX+user.getId(), TOPIC, "s"+s.getId());
	}
	
	@Override
	public void notifyCreatorOfNewModerator(Reference user, Scenario s, Reference actor, String creatorId) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.NEW_MOD_TO_CREATOR);
		n.setObjectId(user.getId());
		n.setObjectContent(user.getFirstname()+" "+user.getLastname());
		if(actor!=null){
			n.setActorId(actor.getId());
			n.setActorName(actor.getFirstname()+" "+user.getLastname());
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+creatorId);
	}
	
	@Override
	public void notifyRemoveModerator(Reference user, Scenario s, Reference actor) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.DEL_MOD);
		n.setObjectId(user.getId());
		n.setActorId(actor.getId());
		n.setActorName(actor.getFirstname()+" "+user.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		broker.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+user.getId());
		broker.removeBinding(USER_QUEUE_PREFIX+user.getId(), TOPIC, "s"+s.getId());
		asyncUpdater.removeModeratorFromScenario(user, s);

	}

	

}
