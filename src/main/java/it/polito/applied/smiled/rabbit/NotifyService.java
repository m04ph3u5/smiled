package it.polito.applied.smiled.rabbit;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Scenario;

public interface NotifyService {
	
	public void notifyCreatePost(Scenario s, Post p);
	public void notifyTag(Scenario s, Post p, String userId);
	public void notifyOpenScenario(Scenario s, Reference actor);
	public void createQueue(String userId);
	public void notifyNewComment(Scenario s, Post p, Comment c);
	public void notifyNewMetaComment(Scenario s, Post p, MetaComment c);
	public void notifyLikeToPost(Scenario s, Post p, CharacterReference actor);

}
