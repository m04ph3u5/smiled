package it.polito.applied.smiled.rabbit;

import java.util.List;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Mission;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.security.CustomUserDetails;

public interface NotifyService {
	
	/*METODI GESTIONE CODE*/
	public void createQueue(String userId);
	public void addTopicBinding(String topic, String queue);
	public void removeTopicBinding(String topic, String queue);
	
	/*METODI NOTIFICHE*/
	public void notifyOpenScenario(Scenario s, Reference actor) ;
	public void notifyCloseScenario(Scenario s, Reference actor) ;
	public void notifyCreatePost(Scenario s, Post p) ;
	public void notifyNewComment(Scenario s, Post p, Comment c) ;
	public void notifyNewMetaComment(Scenario s, Post p, MetaComment c) ;
	public void notifyLikeToPost(Scenario s, Post p, CharacterReference actor) ;
	public void notifyNewAssociation(Reference user, CharacterReference actor, Scenario s, String senderId) ;
	public void notifyNewJournalist(Reference teacher, Scenario s, String newJournalistId);
	public void notifyDeleteJournalist(Reference teacher, Scenario s, String oldJournalistId);
	public void notifyDeleteAssociation(Reference user, CharacterReference actor, Scenario s, String senderId) ;
	public void notifyNewPersonalMission(Reference user, Scenario s, CharacterReference actor, Mission m, String senderId) ;
	public void notifyNewGlobalMission(Reference user, Scenario s, Mission m) ;
	public void notifyNewModerator(Reference user, Scenario s, Reference actor) ;
	public void notifyCreatorOfNewModerator(Reference user, Scenario s, Reference actor, String creatorId);
	public void notifyRemoveModerator(Reference user, Scenario s, Reference actor) ;
	public void notifyModifiedPostByOwner(Scenario s, Post p, Post oldPost, CharacterReference actor);
	public void notifyModifiedPostByModerator(Scenario s, Post p, Post oldPost, Reference actor);
	public void notifyDeletedPostByModerator(Reference r, Post p, ScenarioReference s);
	public void notifyNewAttendee(Scenario s, Reference actor, String userAddedId);
	public void notifyRemoveAttendee(Scenario s, Reference actor, String userAddedId);
	public void notifyNewResource(ScenarioReference s, Reference actor, String filename);
	
	
	/*
	 * Notifiche relative al newspaper --------INIZIO----------------------------------
	 */
	
//	public void notifyNewspaperON(Scenario s, Reference actor);
//	public void notifyNewspaperOFF(Scenario s, Reference actor);
	public void notifyNewNewspaper(Scenario s, Reference journalist, Newspaper newspaper);
	public void notifyDeleteNewspaper(Scenario s, Reference actor, Newspaper newspaper);
	public void notifyUpdateNewspaper(Scenario s, Reference actor, Newspaper newspaper);
	public void notifyNewJournalist(Scenario s, Reference actor, Newspaper newspaper, String newJournalistId);
	public void notifyRemoveournalist(Scenario s, Reference actor, Newspaper newspaper, String oldJournalistId);
	
	/*
	 * Notifiche relative al newspaper --------FINE----------------------------------
	 */
	
	public List<Notification> getLastUserSendedNotification(CustomUserDetails user, Integer num, String old);
	
	
//	public void notifyModifiedCommentByModerator();
//	public void notifyDeletedCommentByModerator();
//	public void notifyDeletedMetaCommentByModerator();
	
	
	
}
