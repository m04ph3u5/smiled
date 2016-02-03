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

import java.io.IOException;
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
	public void notifyOpenScenario(Scenario s, Reference actor)  {
		List<Reference> l = new ArrayList<Reference>();
		if(s.getAttendees()!=null)
			l.addAll(s.getAttendees());
		if(s.getCollaborators()!=null)
			l.addAll(s.getCollaborators());
		l.add(s.getTeacherCreator());
					
		for(Reference r : l){
			broker.createBinding("u"+r.getId(), TOPIC, "s"+s.getId());
		}
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(s.getId());
		mp.setVerb(NotificationType.OPEN_SCENARIO);
		mp.setActorId(actor.getId());
		mp.setActorName(actor.getFirstname()+" "+actor.getLastname());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		
		try {
			broker.sendNotify(mp, TOPIC, "s"+s.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
	}
	
	@Override
	public void notifyCloseScenario(Scenario s, Reference actor) {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(s.getId());
		mp.setVerb(NotificationType.CLOSE_SCENARIO);
		mp.setActorId(actor.getId());
		mp.setActorName(actor.getFirstname()+" "+actor.getLastname());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		
		try {
			broker.sendNotify(mp, TOPIC, "s"+s.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		
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
	public void notifyCreatePost(Scenario s, Post p)  {
		
		/*Creazione notifica nuovo post*/
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(p.getId());
		mp.setVerb(NotificationType.NEW_POST);
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			mp.setActorId(status.getCharacter().getId());
			mp.setActorName(status.getCharacter().getName());
		}else if(p.getClass().equals(Status.class)){
			mp.setActorId(null);
			mp.setActorName(NARRATORE);
		}
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		try {
			broker.sendNotify(mp, TOPIC, "s"+s.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		
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
		
		MessagePayload mpTag = new MessagePayload();
		mpTag.setDate(new Date());
		mpTag.setObjectId(p.getId());
		mpTag.setVerb(NotificationType.TAG_TO_POST);
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			mpTag.setActorId(status.getCharacter().getId());
			mpTag.setActorName(status.getCharacter().getName());
		}else if(p.getClass().equals(Status.class)){
			mpTag.setActorId(null);
			mpTag.setActorName(NARRATORE);
		}
		mpTag.setScenarioId(s.getId());
		mpTag.setScenarioName(s.getName());
		try {
			broker.sendNotify(mpTag, TOPIC, "pc"+p.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		
		
	}

	@Override
	public void notifyNewComment(Scenario s, Post p, Comment c)  {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(p.getId()+"/"+c.getId());
		mp.setVerb(NotificationType.COMMENT_TO_POST);
		mp.setActorId(c.getCharacter().getId());
		mp.setActorName(c.getCharacter().getFirstname());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		
		try {
			broker.sendNotify(mp, TOPIC, "pc"+p.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		broker.createBinding("u"+c.getUser().getId(), TOPIC, "pc"+p.getId());
	
	}
	
	@Override
	public void notifyNewMetaComment(Scenario s, Post p, MetaComment c)  {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(p.getId()+"/"+c.getId());
		mp.setVerb(NotificationType.METACOMMENT_TO_POST);
		mp.setActorId(c.getUser().getId());
		mp.setActorName(c.getUser().getFirstname()+" "+c.getUser().getLastname());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		
		try {
			broker.sendNotify(mp, TOPIC, "pc"+p.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		broker.createBinding("u"+c.getUser().getId(), TOPIC, "pc"+p.getId());
	}

	@Override
	public void notifyLikeToPost(Scenario s, Post p, CharacterReference actor)  {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(p.getId());
		mp.setVerb(NotificationType.LIKE_TO_POST);
		mp.setActorId(actor.getId());
		mp.setActorName(actor.getName());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());

		try {
			broker.sendNotify(mp, TOPIC, "p"+p.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		broker.createBinding("u"+actor.getUserId(), TOPIC, "p"+p.getId());
	}

	@Override
	public void notifyNewAssociation(Reference user, CharacterReference actor, Scenario s) {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(user.getId());
		mp.setVerb(NotificationType.NEW_ASSOCIATION);
		mp.setActorId(actor.getId());
		mp.setActorName(actor.getName());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());

		try {
			broker.sendNotify(mp, TOPIC, "s"+s.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
	}

	@Override
	public void notifyDeleteAssociation(Reference user, CharacterReference actor, Scenario s) {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(user.getId());
		mp.setVerb(NotificationType.DEL_ASSOCIATION);
		mp.setActorId(actor.getId());
		mp.setActorName(actor.getName());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());

		try {
			broker.sendNotify(mp, DIRECT, "u"+user.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		asyncUpdater.removeNotificationFromCharacter(user, actor, s);
	}

	@Override
	public void notifyNewPersonalMission(Reference user, Scenario s, CharacterReference actor) {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setObjectId(user.getId());
		mp.setVerb(NotificationType.NEW_PERSONAL_MISSION);
		mp.setActorId(actor.getId());
		mp.setActorName(actor.getName());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		
		try {
			broker.sendNotify(mp, DIRECT, "u"+user.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}

	}

	@Override
	public void notifyNewGlobalMission(Reference user, Scenario s) {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setVerb(NotificationType.NEW_GLOBAL_MISSION);
		mp.setActorId(user.getId());
		mp.setActorName(user.getFirstname()+" "+user.getLastname());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		
		try {
			broker.sendNotify(mp, TOPIC, "s"+s.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
	}

	@Override
	public void notifyNewModerator(Reference user, Scenario s, Reference actor) {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setVerb(NotificationType.NEW_MOD);
		mp.setObjectId(user.getId());
		mp.setActorId(actor.getId());
		mp.setActorName(actor.getFirstname()+" "+user.getLastname());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		
		try {
			broker.sendNotify(mp, DIRECT, "u"+user.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		broker.createBinding("u"+user.getId(), TOPIC, "s"+s.getId());

	}
	
	@Override
	public void notifyRemoveModerator(Reference user, Scenario s, Reference actor) {
		MessagePayload mp = new MessagePayload();
		mp.setDate(new Date());
		
		mp.setVerb(NotificationType.DEL_MOD);
		mp.setObjectId(user.getId());
		mp.setActorId(actor.getId());
		mp.setActorName(actor.getFirstname()+" "+user.getLastname());
		mp.setScenarioId(s.getId());
		mp.setScenarioName(s.getName());
		
		try {
			broker.sendNotify(mp, DIRECT, "u"+user.getId());
		} catch (IOException e) {
			System.out.println("SERIALIZATION EXCEPTION");
		}
		broker.removeBinding("u"+user.getId(), TOPIC, "s"+s.getId());
		asyncUpdater.removeModeratorFromScenario(user, s);

	}

}
