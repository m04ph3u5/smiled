package it.polito.applied.smiled.rabbit;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.Status;
import it.polito.applied.smiled.updater.AsyncUpdater;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotifyServiceImpl implements NotifyService{
	
	private final String TOPIC = "topicExchange";
	private final String DIRECT = "directExchange";
	private final String NARRATORE = "NARRATORE";	
	
	@Autowired
	private ManageBroker broker;
	
	@Autowired
	private AsyncUpdater asyncUpdater;
	
	
	//TODO gestire persistenza memorizzando in un repository
	
	@Override
	public void createQueue(String userId) {
		broker.createQueue("u"+userId);
		broker.createBinding("u"+userId, DIRECT, "u"+userId);
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
//		n.setTargetId(s.getId());
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getFirstname()+" "+actor.getLastname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		broker.sendNotify(n, TOPIC, "s"+s.getId());
	}
	
	@Override
	public void notifyCloseScenario(Scenario s, Reference actor){
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(s.getId());
		n.setVerb(NotificationType.CLOSE_SCENARIO);
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getFirstname()+" "+actor.getLastname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		broker.sendNotify(n, TOPIC, "s"+s.getId());
		
		List<Reference> l = new ArrayList<Reference>();
		if(s.getAttendees()!=null)
			l.addAll(s.getAttendees());
		if(s.getCollaborators()!=null)
			l.addAll(s.getCollaborators());
		l.add(s.getTeacherCreator());
					
		for(Reference r : l){
			broker.removeBinding("u"+r.getId(), TOPIC, "s"+s.getId());
		}
	}

	@Override
	public void notifyCreatePost(Scenario s, Post p) {
		
		/*Creazione notifica nuovo post*/
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(p.getId());
		n.setVerb(NotificationType.NEW_POST);
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
			if(c!=null && c.getUserId()!=null){
				broker.createBinding("u"+c.getUserId(), TOPIC, "p"+p.getId());
				broker.createBinding("u"+c.getUserId(), TOPIC, "pc"+p.getId());
			}
		}
		
		Notification nTag = new Notification();
		nTag.setDate(new Date());
		nTag.setObjectId(p.getId());
		nTag.setVerb(NotificationType.TAG_TO_POST);
		NotifyReference refTag = new NotifyReference();
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
		broker.sendNotify(n, TOPIC, "pc"+p.getId());
		
		
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
		
		broker.sendNotify(n, TOPIC, "pc"+p.getId());
		broker.createBinding("u"+c.getUser().getId(), TOPIC, "pc"+p.getId());
	
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
		
		broker.sendNotify(n, TOPIC, "pc"+p.getId());
		broker.createBinding("u"+c.getUser().getId(), TOPIC, "pc"+p.getId());
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

		broker.sendNotify(n, TOPIC, "p"+p.getId());
		broker.createBinding("u"+actor.getUserId(), TOPIC, "p"+p.getId());
	}

	@Override
	public void notifyNewAssociation(Reference user, CharacterReference actor, Scenario s){
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(user.getId());
		n.setVerb(NotificationType.NEW_ASSOCIATION);
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getName());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);

		broker.sendNotify(n, TOPIC, "s"+s.getId());
	}

	@Override
	public void notifyDeleteAssociation(Reference user, CharacterReference actor, Scenario s){
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(user.getId());
		n.setVerb(NotificationType.DEL_ASSOCIATION);
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getName());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);

		broker.sendNotify(n, DIRECT, "u"+user.getId());
//		asyncUpdater.removeNotificationFromCharacter(user, actor, s);
	}

	@Override
	public void notifyNewPersonalMission(Reference user, Scenario s, CharacterReference actor){
		Notification n = new Notification();
		n.setDate(new Date());
		n.setObjectId(user.getId());
		n.setVerb(NotificationType.NEW_PERSONAL_MISSION);
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getName());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		broker.sendNotify(n, DIRECT, "u"+user.getId());

	}

	@Override
	public void notifyNewGlobalMission(Reference user, Scenario s){
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.NEW_GLOBAL_MISSION);
		NotifyReference ref = new NotifyReference();
		ref.setActorId(user.getId());
		ref.setActorName(user.getFirstname()+" "+user.getLastname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		broker.sendNotify(n, TOPIC, "s"+s.getId());
	}

	@Override
	public void notifyNewModerator(Reference user, Scenario s, Reference actor){
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.NEW_MOD);
		n.setObjectId(user.getId());
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getFirstname()+" "+user.getLastname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		broker.sendNotify(n, DIRECT, "u"+user.getId());
		broker.createBinding("u"+user.getId(), TOPIC, "s"+s.getId());

	}
	
	@Override
	public void notifyRemoveModerator(Reference user, Scenario s, Reference actor){
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.DEL_MOD);
		n.setObjectId(user.getId());
		NotifyReference ref = new NotifyReference();
		ref.setActorId(actor.getId());
		ref.setActorName(actor.getFirstname()+" "+user.getLastname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		
		broker.sendNotify(n, DIRECT, "u"+user.getId());
		broker.removeBinding("u"+user.getId(), TOPIC, "s"+s.getId());
//		asyncUpdater.removeModeratorFromScenario(user, s);

	}


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
}
