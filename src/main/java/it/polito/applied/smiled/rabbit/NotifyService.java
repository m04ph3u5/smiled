package it.polito.applied.smiled.rabbit;

import java.io.IOException;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;

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
	public void notifyNewAssociation(Reference user, CharacterReference actor, Scenario s) ;
	public void notifyDeleteAssociation(Reference user, CharacterReference actor, Scenario s) ;
	public void notifyNewPersonalMission(Reference user, Scenario s, CharacterReference actor) ;
	public void notifyNewGlobalMission(Reference user, Scenario s) ;
	public void notifyNewModerator(Reference user, Scenario s, Reference actor) ;
	public void notifyRemoveModerator(Reference user, Scenario s, Reference actor) ;
//	public void notifyNewAttendee();
//	public void notifyRemoveAttendee();
//	public void notifyNewResource();
//	public void notifyModifiedPostByModerator();
//	public void notifyDeletedPostByModerator();
//	public void notifyModifiedCommentByModerator();
//	public void notifyDeletedCommentByModerator();
//	public void notifyDeletedMetaCommentByModerator();
//	public void notifyModifiedPostByOwner();
	
	
	
}
