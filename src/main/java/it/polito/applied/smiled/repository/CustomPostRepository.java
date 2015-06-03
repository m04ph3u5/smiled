package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.Revision;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Update;


public interface CustomPostRepository {
	
	public Page<Post> customPageableFindAll(List<String> postsId, int size, Pageable p, boolean historicOrder, String userId, boolean moderator);	
	public Post updatePost(String statusId, Update u);
	public boolean deletePost(String postId);
	public boolean putInDeleteStatus(String id);
	public boolean addRevision(String postId, String scenarioId, Revision revision);
	public boolean addComment(String idScenario, String postId, CommentInterface comment);
	public boolean updateComment(String idScenario, String postId, CommentInterface comment);
	public boolean removeComment(String idScenario, String postId, CommentInterface comment);
}
