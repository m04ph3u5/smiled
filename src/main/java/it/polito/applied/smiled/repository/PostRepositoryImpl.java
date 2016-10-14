package it.polito.applied.smiled.repository;

import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.WriteResult;

import it.polito.applied.smiled.dto.NewspaperDTOPut;
import it.polito.applied.smiled.pojo.FileReference;
import it.polito.applied.smiled.pojo.PostReverseDateComparator;
import it.polito.applied.smiled.pojo.PostReverseHistoricalDateComparatorAsc;
import it.polito.applied.smiled.pojo.PostReverseHistoricalDateComparatorDesc;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.CommentInterface;
import it.polito.applied.smiled.pojo.scenario.Event;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
import it.polito.applied.smiled.pojo.scenario.Post;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.pojo.scenario.PublishedNewspaper;
import it.polito.applied.smiled.pojo.scenario.Revision;
import it.polito.applied.smiled.pojo.scenario.RevisionStatus;
import it.polito.applied.smiled.pojo.scenario.Status;

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
	public Post updatePost(String statusId, Update u, boolean toPublish) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(statusId));
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		Post p = mongoOp.findAndModify(q, u, options,Post.class);
		if(!toPublish)
			return p;
		else{
			mongoOp.findAndRemove(q, Post.class);
			p.setId(null);
			mongoOp.insert(p, "post");
			return p;
		}
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
		
	
		Criteria cOr = new Criteria();

		cOr.orOperator(Criteria.where("_class").is(Event.class.getName()), Criteria.where("_class").is(Status.class.getName()));

		q.addCriteria(Criteria.where("scenarioId").is(scenarioId).andOperator(Criteria.where("status").is(status).andOperator(cOr)));
		return mongoOp.find(q, Post.class);
	}

	@Override
	public List<Post> findByIds(List<String> toRetrieveListIds) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").in(toRetrieveListIds));
		return mongoOp.find(q, Post.class);
	}

	@Override
	public void deleteFileFromPost(String postId, FileReference f) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(postId));
		Update u = new Update();
		u.pull("filesMetadata", f);
		
		mongoOp.updateFirst(q, u, Post.class);
		
	}

	@Override
	public void deleteImageFromPost(String postId, FileReference f) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(postId));
		Update u = new Update();
		u.pull("imagesMetadata", f);
		
		mongoOp.updateFirst(q, u, Post.class);		
	}


	@Override
	public List<Post> findLastInNaturalOrderDesc(String scenarioId, String lastPostId, Integer nItem) {
		Query q = new Query();
		if(lastPostId==null || lastPostId.isEmpty())
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)));
		else
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("_id").lt(new ObjectId(lastPostId))
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED))));
		q.with(new Sort(Sort.Direction.DESC, "id"));
		q.limit(nItem);

		return mongoOp.find(q, Post.class);
	}

	@Override
	public List<Post> findLastInNaturalOrderAsc(String scenarioId, String lastPostId, Integer nItem) {
		Query q = new Query();
		if(lastPostId==null || lastPostId.isEmpty())
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)));
		else
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("_id").gt(new ObjectId(lastPostId))
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED))));
		q.with(new Sort(Sort.Direction.ASC, "id"));
		q.limit(nItem);

		return mongoOp.find(q, Post.class);
	}

	@Override
	public List<Post> findLastInHistoricOrderDesc(String scenarioId, Long date, Integer time, Integer nItem) {
		Query q = new Query();
		if(date==null)
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)));
		else{
			Criteria c1 = new Criteria();
			c1.andOperator(Criteria.where("julianDayNumber").is(date),Criteria.where("timeNumber").lt(time));
			Criteria c2 = new Criteria();
			c2.orOperator(c1, Criteria.where("julianDayNumber").lt(date));
			
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(c2
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED))));
		}
		q.with(new Sort(new Sort.Order(Sort.Direction.DESC, "julianDayNumber"), new Sort.Order(Sort.Direction.DESC, "timeNumber")));
		q.limit(nItem);

		return mongoOp.find(q, Post.class);
	}

	@Override
	public List<Post> findLastInHistoricOrderAsc(String scenarioId, Long date, Integer time, Integer nItem) {
		Query q = new Query();
		if(date==null)
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)));
		else{
			Criteria c1 = new Criteria();
			c1.andOperator(Criteria.where("julianDayNumber").is(date),Criteria.where("timeNumber").gt(time));
			Criteria c2 = new Criteria();
			c2.orOperator(c1, Criteria.where("julianDayNumber").gt(date));
			
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(c2
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED))));
		}
		q.with(new Sort(new Sort.Order(Sort.Direction.ASC, "julianDayNumber"), new Sort.Order(Sort.Direction.ASC, "timeNumber")));
		q.limit(nItem);

		return mongoOp.find(q, Post.class);
	}

	@Override
	public List<Post> findLastCharacterPostInHistoricOrderDesc(String scenarioId, String characterId, Long date, Integer time,
			Integer nItem) {
		Query q = new Query();
		System.out.println(characterId);
		if(date==null)
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)
					.andOperator(Criteria.where("character._id").is(new ObjectId(characterId)))));
		else{
			Criteria c1 = new Criteria();
			c1.andOperator(Criteria.where("julianDayNumber").is(date),Criteria.where("timeNumber").lt(time));
			Criteria c2 = new Criteria();
			c2.orOperator(c1, Criteria.where("julianDayNumber").lt(date));
			
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(c2
					.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)
					.andOperator(Criteria.where("character._id").is(new ObjectId(characterId))))));
		}
		q.with(new Sort(new Sort.Order(Sort.Direction.DESC, "julianDayNumber"), new Sort.Order(Sort.Direction.DESC, "timeNumber")));
		q.limit(nItem);

		return mongoOp.find(q, Post.class);
	}

	@Override
	public List<Post> findByScenarioIdAndPostStatusAndUserId(String scenarioId, PostStatus status, Reference ref) {
		Query q = new Query();
	
		Criteria cOr = new Criteria();
		
		cOr.orOperator(Criteria.where("_class").is(Event.class.getName()), Criteria.where("_class").is(Status.class.getName()));
		System.out.println(scenarioId+" "+status+" "+ref.getEmail());
		q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
				.andOperator(Criteria.where("status").is(status)
				.andOperator(Criteria.where("user").is(ref)
				.andOperator(cOr))));
		return mongoOp.find(q, Post.class);
	}

	@Override
	public List<Post> findStatusByScenarioIdAndPostStatusAndUserId(String scenarioId, PostStatus status, Reference ref) {
		Query q = new Query();
		
		q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
				.andOperator(Criteria.where("status").is(status)
				.andOperator(Criteria.where("user").is(ref)
				.andOperator(Criteria.where("_class").is(Status.class.getName())))));
		return mongoOp.find(q, Post.class);
	}

  @Override
  public void updateNewspaperReference(String scenarioId, Integer number, NewspaperDTOPut dto) {
    Query q = new Query();
    q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
        .andOperator(Criteria.where("_class").is(PublishedNewspaper.class.getName())
        .andOperator(Criteria.where("number").is(number))));
    
    Update u = new Update();
    if(dto.getFont()!=null){
      u.set("font", dto.getFont());
    }
    if(dto.getName()!=null){
      u.set("name", dto.getName());
    }
    if(dto.getJulianDayNumber()!=null){
      u.set("julianDaynumber", dto.getJulianDayNumber());
    }
    if(dto.getTimeNumber()!=null){
      u.set("timeNumber", dto.getTimeNumber());
    }
    mongoOp.updateFirst(q, u, Post.class);
  }
}
