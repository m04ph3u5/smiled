package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.FileReference;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.pojo.scenario.Revision;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Update;


public interface CustomPostRepository {
	
	public Page<Post> customPageableFindAll(List<String> postsId, int size, Pageable p, boolean historicOrder, Boolean orderDesc, String userId, boolean moderator);	
	public Post updatePost(String statusId, Update u, boolean toPublish);
	public boolean deletePost(String postId);
	public boolean putInDeleteStatus(String id);
	public boolean addRevision(String postId, String scenarioId, Revision revision);
	public Post addComment(String idScenario, String postId, CommentInterface comment);
	public boolean updateComment(String idScenario, String postId, CommentInterface comment);
	public boolean removeComment(String idScenario, String postId, CommentInterface comment);
	public List<Post> findByScenarioIdAndPostStatus(String scenarioId, PostStatus status);
	public List<Post> findByIds(List<String> toRetrieveListIds);
	public void deleteFileFromPost(String postId, FileReference f);
	public void deleteImageFromPost(String postId, FileReference f);
	public List<Post> findLastInNaturalOrderDesc(String scenarioId, String lastPostId, Integer nItem);
	public List<Post> findLastInNaturalOrderAsc(String scenarioId, String lastPostId, Integer nItem);
	public List<Post> findLastInHistoricOrderDesc(String scenarioId, Long date, Integer time, Integer nItem);
	public List<Post> findLastInHistoricOrderAsc(String scenarioId, Long date, Integer time, Integer nItem);
	public List<Post> findLastCharacterPostInHistoricOrderDesc(String scenarioId, String characterId, Long date, Integer time,
			Integer nItem);

}
