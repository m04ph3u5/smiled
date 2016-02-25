package it.polito.applied.smiled.rabbit;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Mission;
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
	public void notifyNewPersonalMission(Reference user, Scenario s, CharacterReference actor, Mission m) ;
	public void notifyNewGlobalMission(Reference user, Scenario s, Mission m) ;
	public void notifyNewModerator(Reference user, Scenario s, Reference actor) ;
	public void notifyCreatorOfNewModerator(Reference user, Scenario s, Reference actor, String creatorId);
	public void notifyRemoveModerator(Reference user, Scenario s, Reference actor) ;
	public void notifyModifiedPostByOwner(Scenario s, Post p, Post oldPost, Reference actor);
	public void notifyModifiedPostByModerator(Scenario s, Post p, Post oldPost, Reference actor);
	public void notifyDeletedPostByModerator(Reference r, Post p, ScenarioReference s);
	public void notifyNewAttendee(Scenario s, Reference actor, String userAddedId);
	public void notifyRemoveAttendee(Scenario s, Reference actor, String userAddedId);
	public void notifyNewResource(ScenarioReference s, Reference actor, String filename);
	
	
//	public void notifyModifiedCommentByModerator();
//	public void notifyDeletedCommentByModerator();
//	public void notifyDeletedMetaCommentByModerator();
	
	
	
}
