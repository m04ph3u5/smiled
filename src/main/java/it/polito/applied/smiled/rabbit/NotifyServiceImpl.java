package it.polito.applied.smiled.rabbit;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Mission;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.Status;
import it.polito.applied.smiled.repository.NotificationRepository;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.updater.AsyncUpdater;

@Service
public class NotifyServiceImpl implements NotifyService{

	private final String TOPIC = "topicExchange";
	private final String DIRECT = "directExchange";
	private final String NARRATORE = "Il Narratore";
	private final int PREVIEW = 15;

	private final String USER_QUEUE_PREFIX="user.";

	@Autowired
	private BrokerProducer brokerProducer;

	@Autowired
	private AsyncUpdater asyncUpdater;

	@Autowired
	private NotificationRepository notificationRepo;


	//TODO gestire persistenza memorizzando in un repository

	@Override
	public void createQueue(String userId) {
		brokerProducer.createQueue(USER_QUEUE_PREFIX+userId);
		brokerProducer.createBinding(USER_QUEUE_PREFIX+userId, DIRECT, USER_QUEUE_PREFIX+userId);
	}

	@Override
	public void addTopicBinding(String topic, String userId){
		brokerProducer.createBinding(USER_QUEUE_PREFIX+userId, TOPIC, topic);
	}

	@Override
	public void removeTopicBinding(String topic, String queue){
		brokerProducer.removeBinding(queue, TOPIC, topic);
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
			brokerProducer.createBinding(USER_QUEUE_PREFIX+r.getId(), TOPIC, "s"+s.getId());
		}
		Notification n = new Notification();
		n.setDate(new Date());
		n.setSender(actor.getId());
		n.setObjectId(s.getId());
		
		n.setVerb(NotificationType.OPEN_SCENARIO);
		if(actor!=null){
			n.setActorId(actor.getId());
			n.setActorName(actor.getFirstname()+" "+actor.getLastname());
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());

	}

	@Override
	public void notifyCloseScenario(Scenario s, Reference actor) {
		Notification n = new Notification();
		n.setDate(new Date());
		if(actor!=null){
			n.setSender(actor.getId());
		}
		n.setObjectId(s.getId());
		
		n.setVerb(NotificationType.CLOSE_SCENARIO);
		if(actor!=null){
			n.setActorId(actor.getId());
			n.setActorName(actor.getFirstname()+" "+actor.getLastname());
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());


		List<Reference> l = new ArrayList<Reference>();
		if(s.getAttendees()!=null)
			l.addAll(s.getAttendees());
		if(s.getCollaborators()!=null)
			l.addAll(s.getCollaborators());
		l.add(s.getTeacherCreator());

		for(Reference r : l){
			brokerProducer.removeBinding(USER_QUEUE_PREFIX+r.getId(), TOPIC, "s"+s.getId());
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
		}else if(p.getClass().equals(Event.class)){
			n.setActorId(null);
			n.setActorName(NARRATORE);
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(p.getUser().getId());
		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());

		/*Notifico i taggati*/
		List<Reference> l = new ArrayList<Reference>();
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			if(status.getTags()!=null){
				l.addAll(status.getTags());
			}
			
		}else if(p.getClass().equals(Event.class)){
			Event event = (Event) p;
			if(event.getTags()!=null){
				l.addAll(event.getTags());
			}
		}
		for(Reference r : l){
			CharacterReference c = s.getCharacter(r.getId());
			if(c!=null && c.getUserId()!=null){
				brokerProducer.createBinding(USER_QUEUE_PREFIX+c.getUserId(), TOPIC, "p"+p.getId());
				brokerProducer.createBinding(USER_QUEUE_PREFIX+c.getUserId(), TOPIC, "pc"+p.getId());
			}
		}

		Notification nTag = new Notification();
		nTag.setDate(new Date());
		nTag.setObjectId(p.getId());
		nTag.setVerb(NotificationType.TAG_ON_CREATE);
		nTag.setTagged(l);
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			nTag.setActorId(status.getCharacter().getId());
			nTag.setActorName(status.getCharacter().getName());
		}else if(p.getClass().equals(Event.class)){
			nTag.setActorId(null);
			nTag.setActorName(NARRATORE);
		}
		nTag.setScenarioId(s.getId());
		nTag.setScenarioName(s.getName());
		brokerProducer.sendNotify(nTag, TOPIC, "pc"+p.getId());
		brokerProducer.createBinding(USER_QUEUE_PREFIX+p.getUser().getId(), TOPIC, "p"+p.getId());
		brokerProducer.createBinding(USER_QUEUE_PREFIX+p.getUser().getId(), TOPIC, "pc"+p.getId());

	}

	@Override
	public void notifyNewComment(Scenario s, Post p, Comment c)  {
		Notification n = new Notification();
		n.setDate(new Date());

		n.setObjectId(p.getId()+"/"+c.getId());
		
		n.setVerb(NotificationType.COMMENT_TO_POST);
		n.setActorId(c.getCharacter().getId());
		n.setActorName(c.getCharacter().getFirstname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setMainReceiver(p.getUser().getId()); //nel caso di nuovo commento il mainReceiver è chi ha scritto il post 
		n.setSender(c.getUser().getId());

		brokerProducer.sendNotify(n, TOPIC, "pc"+p.getId());
		brokerProducer.createBinding(USER_QUEUE_PREFIX+c.getUser().getId(), TOPIC, "pc"+p.getId());
		generateUpdComment(c, p.getId(), s);
	}

	@Override
	public void notifyNewMetaComment(Scenario s, Post p, MetaComment c)  {
		Notification n = new Notification();
		n.setDate(new Date());

		n.setObjectId(p.getId()+"/"+c.getId());
		
		n.setVerb(NotificationType.METACOMMENT_TO_POST);
		n.setActorId(c.getUser().getId());
		n.setActorName(c.getUser().getFirstname()+" "+c.getUser().getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setMainReceiver(p.getUser().getId()); //nel caso di nuovo metacommento il mainReceiver è chi ha scritto il post 
		n.setSender(c.getUser().getId());

		brokerProducer.sendNotify(n, TOPIC, "pc"+p.getId());
		brokerProducer.createBinding(USER_QUEUE_PREFIX+c.getUser().getId(), TOPIC, "pc"+p.getId());
		
		generateUpdComment(c, p.getId(), s);
	}

	@Override
	public void notifyLikeToPost(Scenario s, Post p, CharacterReference actor)  {
		Notification n = new Notification();
		n.setDate(new Date());

		n.setObjectId(p.getId());
	
		n.setVerb(NotificationType.LIKE_TO_POST);
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setMainReceiver(p.getUser().getId()); //nel caso di nuovo like il mainReceiver è chi ha scritto il post 
		n.setSender(actor.getUserId());

		brokerProducer.sendNotify(n, TOPIC, "p"+p.getId());
		generateUpdPostForReload(s, p, actor.getUserId());
	}

	@Override
	public void notifyNewAssociation(Reference user, CharacterReference actor, Scenario s, String sender) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setSender(sender);
		n.setObjectId(user.getId());
		n.setObjectContent(user.getFirstname() +" "+user.getLastname());
		n.setVerb(NotificationType.NEW_ASSOCIATION);
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());
	}

	@Override
	public void notifyDeleteAssociation(Reference user, CharacterReference actor, Scenario s, String sender) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setSender(sender);
		n.setObjectId(user.getId());
		n.setObjectContent(user.getFirstname() +" "+user.getLastname());
		n.setVerb(NotificationType.DEL_ASSOCIATION);
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+user.getId());
		} catch(Exception e){
			System.out.println("Delete association: impossibile inviare la notifica");
		}
		asyncUpdater.removeNotificationFromCharacter(user.getId(), actor, s);
	}

	@Override
	public void notifyNewPersonalMission(Reference user, Scenario s, CharacterReference actor, Mission m, String senderId) {
		Notification n = new Notification();
		n.setDate(new Date());

		
		n.setObjectId(user.getId());
		n.setSender(senderId);
		n.setVerb(NotificationType.NEW_PERSONAL_MISSION);
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+user.getId());
		} catch(Exception e){
			System.out.println("New personal mission: impossibile inviare la notifica");
		}
	}

	@Override
	public void notifyNewGlobalMission(Reference user, Scenario s, Mission m) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.NEW_GLOBAL_MISSION);
		n.setActorId(user.getId());
		n.setActorName(user.getFirstname()+" "+user.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(user.getId());
		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());
	}

	@Override
	public void notifyNewModerator(Reference user, Scenario s, Reference actor) {

		Notification n = new Notification();
		n.setDate(new Date());

		n.setVerb(NotificationType.NEW_MOD);
		n.setObjectId(user.getId());
		n.setMainReceiver(user.getId());
		if(actor!=null){
			n.setActorId(actor.getId());
			n.setActorName(actor.getFirstname()+" "+actor.getLastname());
			n.setSender(actor.getId());
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+user.getId());
			brokerProducer.createBinding(USER_QUEUE_PREFIX+user.getId(), TOPIC, "s"+s.getId());
		}catch(Exception e){
			System.out.println("New moderator: impossibile inviare la notifica");
		}
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
			n.setSender(actor.getId());
		}
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());

		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+creatorId);
		}catch(Exception e){
			System.out.println("New moderator to creator: impossibile inviare la notifica");
		}
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
		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+user.getId());
			brokerProducer.removeBinding(USER_QUEUE_PREFIX+user.getId(), TOPIC, "s"+s.getId());
		}catch(Exception e){
			System.out.println("Remove moderator: impossibile inviare la notifica");
		}
		asyncUpdater.removeModeratorFromScenario(user, s);

	}

	@Override
	public void notifyModifiedPostByOwner(Scenario s, Post p, Post oldPost, CharacterReference actor) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.MODIFIED);
		//Actor is owner of post
		n.setActorId(actor.getId());
		n.setActorName(actor.getName());
		//Object is post itself
		n.setObjectId(p.getId());
		//Sender is again owner of post (just for convenience on client side)
		n.setSender(p.getUser().getId());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		brokerProducer.sendNotify(n, TOPIC, "pc"+p.getId());
		notifyEventuallyTags(s,p,oldPost, p.getUser().getId());
		generateUpdPostForReload(s, p, p.getUser().getId());
	}

	@Override
	public void notifyModifiedPostByModerator(Scenario s, Post p, Post oldPost, Reference actor) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.MODIFIED_POST_BY_MOD);

		//Actor is moderator which modify post
		n.setActorId(actor.getId());
		n.setActorName(actor.getFirstname()+" "+actor.getLastname());
		//Object is post itself
		n.setObjectId(p.getId());
		//Sender is again moderator (just for convenience on client side)
		n.setSender(actor.getId());
		//Main receiver is owner of post
		n.setMainReceiver(p.getUser().getId());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		brokerProducer.sendNotify(n, TOPIC, "pc"+p.getId());	
		notifyEventuallyTags(s,p,oldPost,actor.getId());
		generateUpdPostForReload(s, p, actor.getId());
	}
	
	@Override
	public void notifyDeletedPostByModerator(Reference r, Post p, ScenarioReference s) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.DELETED_POST_BY_MOD);
		n.setObjectId(p.getId());
		n.setActorId(r.getId());
		n.setActorName(r.getFirstname()+" "+r.getLastname());
		n.setSender(r.getId());
		n.setMainReceiver(p.getUser().getId());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+n.getMainReceiver());
	}
	

	@Override
	public void notifyNewAttendee(Scenario s, Reference actor, String userAddedId) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.NEW_ATTENDEE);
		n.setObjectId(s.getId());
		n.setActorId(actor.getId());
		n.setActorName(actor.getFirstname()+" "+actor.getLastname());
		n.setSender(actor.getId());
		n.setMainReceiver(userAddedId);
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+n.getMainReceiver());
		brokerProducer.createBinding(USER_QUEUE_PREFIX+userAddedId, TOPIC, "s"+s.getId());		
	}
	

	@Override
	public void notifyRemoveAttendee(Scenario s, Reference actor, String userAddedId) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.DEL_ATTENDEE);
		n.setObjectId(s.getId());
		n.setActorId(actor.getId());
		n.setActorName(actor.getFirstname()+" "+actor.getLastname());
		n.setSender(actor.getId());
		n.setMainReceiver(userAddedId);
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+n.getMainReceiver());		
		brokerProducer.removeBinding(USER_QUEUE_PREFIX+userAddedId, TOPIC, "s"+s.getId());
		for(CharacterReference cr : s.getCharacters()){
			if(cr.getUserId()!=null && cr.getUserId().equals(userAddedId)){
				asyncUpdater.removeNotificationFromCharacter(userAddedId, cr, s);
				break;
			}
		}
	}
	
	@Override
	public void notifyNewResource(ScenarioReference s, Reference actor, String filename) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.NEW_FILE);
		n.setObjectContent(filename);
		n.setActorId(actor.getId());
		n.setActorName(actor.getFirstname()+" "+actor.getLastname());
		n.setSender(actor.getId());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());		
	}
	

	@Override
	public List<Notification> getLastUserSendedNotification(CustomUserDetails user, Integer num, String old) {
		return notificationRepo.findLastUserSendedNotification(user.getId(), num, old);
	}
	
	private void notifyEventuallyTags(Scenario s, Post p, Post oldPost, String senderId) {
		//Search for new tag
		if(p.getClass().equals(Status.class)){
			Status status = (Status) p;
			Status oldStatus = (Status) oldPost;

			List<Reference> oldTagged = oldStatus.getTags();
			List<Reference> newTagged = new ArrayList<Reference>();
			for(Reference ref : status.getTags()){
				if(!oldTagged.contains(ref)){
					newTagged.add(ref);
				}
			}
			if(newTagged.size()>0){
				Notification nTag = new Notification();
				nTag.setDate(new Date());
				nTag.setObjectId(p.getId());
				nTag.setVerb(NotificationType.TAG_ON_MOD);
				nTag.setActorId(status.getCharacter().getId());
				nTag.setActorName(status.getCharacter().getName());
				nTag.setObjectId(status.getId());
				
				nTag.setSender(senderId);
				nTag.setTagged(newTagged);
				nTag.setScenarioId(s.getId());
				nTag.setScenarioName(s.getName());

				for(Reference r : newTagged){
					CharacterReference c = s.getCharacter(r.getId());
					if(c!=null && c.getUserId()!=null){
						brokerProducer.createBinding(USER_QUEUE_PREFIX+c.getUserId(), TOPIC, "p"+p.getId());
						brokerProducer.createBinding(USER_QUEUE_PREFIX+c.getUserId(), TOPIC, "pc"+p.getId());
					}
				}

				brokerProducer.sendNotify(nTag, TOPIC, "pc"+p.getId());
			}
		}else if(p.getClass().equals(Event.class)){
			Event event = (Event) p;
			Event oldEvent = (Event) oldPost;

			List<Reference> oldTagged = oldEvent.getTags();
			List<Reference> newTagged = new ArrayList<Reference>();
			for(Reference ref : event.getTags()){
				if(!oldTagged.contains(ref)){
					newTagged.add(ref);
				}
			}
			if(newTagged.size()>0){
				Notification nTag = new Notification();
				nTag.setDate(new Date());
				nTag.setObjectId(p.getId());
				nTag.setVerb(NotificationType.TAG_ON_MOD);
				nTag.setActorId("");
				nTag.setActorName("NARRATORE");
				nTag.setObjectId(event.getId());
				
				nTag.setSender(senderId);
				nTag.setTagged(newTagged);
				nTag.setScenarioId(s.getId());
				nTag.setScenarioName(s.getName());
				
				for(Reference r : newTagged){
					CharacterReference c = s.getCharacter(r.getId());
					if(c!=null && c.getUserId()!=null){
						brokerProducer.createBinding(USER_QUEUE_PREFIX+c.getUserId(), TOPIC, "p"+p.getId());
						brokerProducer.createBinding(USER_QUEUE_PREFIX+c.getUserId(), TOPIC, "pc"+p.getId());
					}
				}

				brokerProducer.sendNotify(nTag, TOPIC, "pc"+p.getId());
			}
		}		
	}

	private void generateUpdPostForReload(Scenario s, Post p, String senderId){
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.UPD_POST);
		//Object is post itself
		n.setObjectId(p.getId());
		//Sender is again owner of post (just for convenience on client side
		n.setSender(senderId);
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());
	}
	
	private void generateUpdComment(CommentInterface c, String postId, Scenario s) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		if(c.getClass().equals(Comment.class)){
			n.setVerb(NotificationType.UPD_NEW_COMMENT);
			n.setComment((Comment) c);
		}else if(c.getClass().equals(MetaComment.class)){
			n.setVerb(NotificationType.UPD_NEW_META);
			n.setMetaComment((MetaComment) c);
		}
		n.setSender(c.getUser().getId());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setObjectId(postId);
		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());
	}

	@Override
	public void notifyNewJournalist(Reference teacher, Scenario s, String newJournalistId) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.NEW_JOURNALIST);
		n.setObjectId(s.getId());
		n.setActorId(teacher.getId());
		n.setActorName(teacher.getFirstname()+" "+teacher.getLastname());
		n.setSender(teacher.getId());
		n.setMainReceiver(newJournalistId);
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		
		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+newJournalistId);
		}catch(Exception e){
			System.out.println("New journalist: impossibile inviare la notifica");
		}
			
		
	}

	@Override
	public void notifyDeleteJournalist(Reference teacher, Scenario s, String oldJournalistId) {
		Notification n = new Notification();
		n.setDate(new Date());
		n.setVerb(NotificationType.DEL_JOURNALIST);
		n.setObjectId(s.getId());
		n.setActorId(teacher.getId());
		n.setActorName(teacher.getFirstname()+" "+teacher.getLastname());
		n.setSender(teacher.getId());
		n.setMainReceiver(oldJournalistId);
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+oldJournalistId);
			
		}catch(Exception e){
			System.out.println("Remove journalist: impossibile inviare la notifica");
		}
	}

	@Override
	public void notifyNewspaperON(Scenario s, Reference teacher) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.NEWSPAPER_ON);
		n.setActorId(teacher.getId());
		n.setActorName(teacher.getFirstname()+" "+teacher.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(teacher.getId());
		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());
		
	}

	@Override
	public void notifyNewspaperOFF(Scenario s, Reference teacher) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.NEWSPAPER_OFF);
		n.setActorId(teacher.getId());
		n.setActorName(teacher.getFirstname()+" "+teacher.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(teacher.getId());
		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());
		
	}

	@Override
	public void notifyNewNewspaper(Scenario s, String journalistId, Newspaper newspaper) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.NEW_NEWSPAPER);
		n.setActorId(journalistId);
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(journalistId);
		n.setObjectId(newspaper.getId());
		n.setObjectContent(newspaper.getName() +" ,numero: "+newspaper.getNumber());
		brokerProducer.sendNotify(n, TOPIC, "s"+s.getId());
		
	}

	//viene generata solo se a rimuovere il newspaper è un docente
	@Override
	public void notifyDeleteNewspaper(Scenario s, Reference teacher, Newspaper newspaper) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.DEL_NEWSPAPER);
		n.setActorId(teacher.getId());
		n.setActorName(teacher.getFirstname()+" "+teacher.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(teacher.getId());
		n.setObjectId(newspaper.getId());
		n.setObjectContent(newspaper.getName() +" ,numero: "+newspaper.getNumber());


		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+ newspaper.getActualUserId());
		}catch(Exception e){
			System.out.println("Delete newspaper by teacher: impossibile inviare la notifica");
		}
		
	
		
	}

	//viene generata solo se a modificare il newspaper è un docente
	@Override
	public void notifyUpdateNewspaper(Scenario s, Reference teacher, Newspaper newspaper) {
		
		String journalist = newspaper.getActualUserId();
		if(journalist==null) //se il giornale non ha un giornalista in quel momento non viene generata nessuna notifica
			return;
		
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.UPD_NEWSPAPER);
		n.setActorId(teacher.getId());
		n.setActorName(teacher.getFirstname()+" "+teacher.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(teacher.getId());
		n.setObjectId(newspaper.getId());
		n.setObjectContent(newspaper.getName() +" ,numero: "+newspaper.getNumber());
		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+ newspaper.getActualUserId());
			
		}catch(Exception e){
			System.out.println("Update newspaper by teacher: impossibile inviare la notifica");
		}
		
		
	}

	@Override
	public void notifyNewJournalist(Scenario s, Reference teacher, Newspaper newspaper, String newJournalist) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.NEW_JOURNALIST);
		n.setActorId(teacher.getId());
		n.setActorName(teacher.getFirstname()+" "+teacher.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(teacher.getId());
		n.setObjectId(newspaper.getId());

		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+ newJournalist);
		}catch(Exception e){
			System.out.println("New journalist: impossibile inviare la notifica");
		}
		
	}

	@Override
	public void notifyRemoveournalist(Scenario s, Reference teacher, Newspaper newspaper, String oldJournalist) {
		Notification n = new Notification();
		n.setDate(new Date());
		
		n.setVerb(NotificationType.DEL_JOURNALIST);
		n.setActorId(teacher.getId());
		n.setActorName(teacher.getFirstname()+" "+teacher.getLastname());
		n.setScenarioId(s.getId());
		n.setScenarioName(s.getName());
		n.setSender(teacher.getId());
		n.setObjectId(newspaper.getId());

		try{
			brokerProducer.sendNotify(n, DIRECT, USER_QUEUE_PREFIX+ oldJournalist);
		}catch(Exception e){
			System.out.println("Delete journalist: impossibile inviare la notifica");
		}
		
	}

}
