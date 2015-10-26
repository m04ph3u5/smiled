package it.polito.applied.smiled.rabbit;

import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.Status;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.amqp.core.Queue;
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
		
		/*Generazione "gruppo" post*/
		List<Reference> l = new ArrayList<Reference>();
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			l.addAll(status.getTags());
		
		}else if(p.getClass().equals(Status.class)){
			Event event = (Event) p;
			l.addAll(event.getTags());
		}
		for(Reference r : l){
			broker.createBinding("u"+r.getId(), TOPIC, "p"+p.getId());
			notifyTag(s,p,r.getId());
		}
		broker.createBinding("u"+p.getUser().getId(), TOPIC, "p"+p.getId());
		
	}

	@Override
	public void notifyTag(Scenario s, Post p, String userId) {
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
		n.setTargetId(p.getId());
		NotifyReference ref = new NotifyReference();
		ref.setActorId(c.getCharacter().getId());
		ref.setActorName(c.getCharacter().getFirstname());
		ref.setScenarioId(s.getId());
		ref.setScenarioName(s.getName());
		n.setInfo(ref);
		broker.sendNotify(n, TOPIC, "p"+p.getId());
		
		broker.createBinding("u"+c.getUser().getId(), TOPIC, "p"+p.getId());
	}

	@Override
	public void likeToPost(Scenario s, Post p, Reference actor) {
		// TODO Auto-generated method stub
		
	}
}
