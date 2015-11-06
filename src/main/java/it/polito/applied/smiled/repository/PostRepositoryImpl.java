package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.PostReverseDateComparator;
import it.polito.applied.smiled.pojo.PostReverseHistoricalDateComparatorAsc;
import it.polito.applied.smiled.pojo.PostReverseHistoricalDateComparatorDesc;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.pojo.scenario.Revision;
import it.polito.applied.smiled.pojo.scenario.RevisionStatus;
import it.polito.applied.smiled.pojo.scenario.Status;
import it.polito.applied.smiled.pojo.user.User;

import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.WriteResult;

public class PostRepositoryImpl implements CustomPostRepository{

	@Autowired
	MongoOperations mongoOp;

	@Override
	public Page<Post> customPageableFindAll(List<String> postsId, int size, Pageable p, boolean historicOrder, Boolean orderDesc, String userId, boolean moderator) {
		
		Query q = new Query();
		q.addCriteria(Criteria.where("id").in(postsId));
		
		List<Post> posts = mongoOp.find(q, Post.class);
		
		if(posts!=null){
			Iterator<Post> it = posts.iterator();
			while(it.hasNext()){
				Post post = it.next();
				if(post.getRevision().getStatus().equals(RevisionStatus.TO_MODIFY_NOT_VISIBLE)){
					if(!post.getUser().getId().equals(userId) && !moderator){
						it.remove();
						size--;
					}
				}
			}
			if(historicOrder){
				if(orderDesc)
					Collections.sort(posts, new PostReverseHistoricalDateComparatorDesc());
				else
					Collections.sort(posts, new PostReverseHistoricalDateComparatorAsc());
			}
			else
				Collections.sort(posts, new PostReverseDateComparator());
		}
		return new PageImpl<Post>(posts,p,size);
		
	}

	@Override
	public Post updatePost(String statusId, Update u) {
		
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(statusId));
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		return mongoOp.findAndModify(q, u, options,Post.class);
		
	}

	@Override
	public boolean deletePost(String postId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(postId));
		WriteResult w = mongoOp.remove(q,Post.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean putInDeleteStatus(String postId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(postId));
		Update u = new Update();
		u.set("status", PostStatus.DELETED);
		
		WriteResult w = mongoOp.updateFirst(q,u,Post.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean addRevision(String postId, String scenarioId,
			Revision revision) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(postId)
				.andOperator(Criteria.where("scenarioId").is(scenarioId)));
		Update u = new Update();
		u.set("revision", revision);
		
		WriteResult w = mongoOp.updateFirst(q,u,Post.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public Post addComment(String idScenario, String postId, CommentInterface comment) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(postId)
				.andOperator(Criteria.where("scenarioId").is(idScenario)));
		Update u = new Update();
		
		if(comment.getClass().equals(Comment.class)){
			Comment c = (Comment) comment;
			u.addToSet("comments", c);
		}else if(comment.getClass().equals(MetaComment.class)){
			MetaComment m = (MetaComment) comment;
			u.addToSet("metaComments", m);
		}
		
		return mongoOp.findAndModify(q, u, Post.class);
	}
	
	@Override
	public boolean updateComment(String idScenario, String postId, CommentInterface comment) {
		Query q = new Query();
		Update u = new Update();

		if(comment.getClass().equals(Comment.class)){
			q.addCriteria(Criteria.where("id").is(new ObjectId(postId))
				.andOperator(Criteria.where("scenarioId").is(idScenario)				
				.andOperator(Criteria.where("comments.id").is(comment.getId()))));
			u.set("comments.$", comment);
		}else if(comment.getClass().equals(MetaComment.class)){
			q.addCriteria(Criteria.where("id").is(new ObjectId(postId))
					.andOperator(Criteria.where("scenarioId").is(idScenario)				
					.andOperator(Criteria.where("metaComments.id").is(comment.getId()))));
			u.set("metaComments.$", comment);
		}
		
		WriteResult w = mongoOp.updateFirst(q, u, Post.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public boolean removeComment(String idScenario, String postId, CommentInterface comment) {
		Query q = new Query();
		Update u = new Update();
		if(comment.getClass().equals(Comment.class)){
			q.addCriteria(Criteria.where("id").is(postId)
				.andOperator(Criteria.where("scenarioId").is(idScenario)));			
			u.pull("comments", comment);
		}else if(comment.getClass().equals(MetaComment.class)){
			q.addCriteria(Criteria.where("id").is(postId)
					.andOperator(Criteria.where("scenarioId").is(idScenario)));				
			u.pull("metaComments", comment);
		}
		WriteResult w = mongoOp.updateFirst(q, u, Post.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;
	}

	@Override
	public List<Post> findByScenarioIdAndPostStatus(String scenarioId,
			PostStatus status) {
		Query q = new Query();
		Criteria c = new Criteria();
		c.orOperator(Criteria.where("_class").is(Status.class.getName()),Criteria.where("_class").is(Event.class.getName()));
		q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
				.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)
						.andOperator(c)));
		return mongoOp.find(q, Post.class);
	}

	@Override
	public List<Post> findByIds(List<String> toRetrieveListIds) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").in(toRetrieveListIds));
		return mongoOp.find(q, Post.class);
	}
	
}
