package it.polito.applied.smiled.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import it.polito.applied.smiled.pojo.newspaper.Article;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.scenario.PostStatus;

public class NewspaperRepositoryImpl implements CustomNewspaperRepository{
	
	@Autowired
	MongoOperations mongoOp;
	
	@Override
	public Newspaper getLastNewspaperFromScenario(String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(scenarioId).andOperator((Criteria.where("status").ne(PostStatus.DELETED))));
		List<Newspaper> allNumbers = mongoOp.find(q, Newspaper.class);
		int number = 0;
		Newspaper newspaper = null;
		for(Newspaper n : allNumbers){
			if(n.getNumber()>number){
				newspaper = n;
				number = n.getNumber();
			}
			
		}
		return newspaper;
	}
	@Override
	public Newspaper getLastNewspaperPublishedFromScenario(String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(scenarioId).andOperator((Criteria.where("status").is(PostStatus.PUBLISHED))));
		List<Newspaper> allNumbers = mongoOp.find(q, Newspaper.class);
		int number = 0;
		Newspaper newspaper = null;
		for(Newspaper n : allNumbers){
			if(n.getNumber()>number){
				newspaper = n;
				number = n.getNumber();
			}
			
		}
		return newspaper;
	}

	@Override
	public Newspaper findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(String idScenario, int number) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(idScenario).andOperator((Criteria.where("status").ne(PostStatus.DELETED)).andOperator(Criteria.where("number").is(number))));
		return mongoOp.findOne(q,  Newspaper.class);
	
	}
	
	@Override
	public Newspaper findNewspaperByIdScenarioAndNumberAndStatusNotDeletedOrPublished(String idScenario, int number) {
		Query q = new Query();
		
		q.addCriteria(Criteria.where("idScenario").is(idScenario)
				.andOperator(Criteria.where("status").ne(PostStatus.DELETED)
				.andOperator(Criteria.where("status").ne(PostStatus.PUBLISHED)
				.andOperator(Criteria.where("number").is(number)))));
		return mongoOp.findOne(q,  Newspaper.class);
	}

	@Override
	public List<Newspaper> findByIdScenarioAndNotDeleted(String idScenario) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(idScenario).andOperator((Criteria.where("status").ne(PostStatus.DELETED))));
		return mongoOp.find(q,  Newspaper.class);
	}
	
	@Override
	public List<Newspaper> findByIdScenarioAndPublished(String id) {
		Query q = new Query();
		
		q.addCriteria(Criteria.where("idScenario").is(id)
				.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)));
		return mongoOp.find(q, Newspaper.class);
	}

	@Override
	public Newspaper findByIdScenarioAndNumberAndPublished(String id, int number) {
		Query q = new Query();
		
		q.addCriteria(Criteria.where("idScenario").is(id)
				.andOperator(Criteria.where("status").is(PostStatus.PUBLISHED)		
				.andOperator(Criteria.where("number").is(number))));
		return mongoOp.findOne(q,  Newspaper.class);
	}

	@Override
	public boolean putInDeletedStatus(String idScenario, Integer number) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(idScenario)
				.andOperator(Criteria.where("status").ne(PostStatus.DRAFT)
				.andOperator(Criteria.where("number").is(number))));
		Update u = new Update();
		u.set("status", PostStatus.DELETED);
		Newspaper deleted = mongoOp.findAndModify(q, u, Newspaper.class);
		if(deleted==null)
			return false;
		else 
			return true;

	}

	@Override
	public Newspaper updateArticle(String idScenario, Integer number, Article a) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(idScenario)
				.andOperator(Criteria.where("status").ne(PostStatus.DELETED)
				.andOperator(Criteria.where("number").is(number)
						.andOperator(Criteria.where("articles.idArticleTemplate").is(a.getIdArticleTemplate())))));
		Update u = new Update();
		u.set("articles.$", a);
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		return mongoOp.findAndModify(q, u, options, Newspaper.class);
	}

	@Override
	public Newspaper insertArticle(String idScenario, Integer number, Article a) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(idScenario)
				.andOperator(Criteria.where("status").ne(PostStatus.DELETED)
				.andOperator(Criteria.where("number").is(number))));
		Update u = new Update();
		u.push("articles", a);
		FindAndModifyOptions options = new FindAndModifyOptions();
		options.returnNew(true);
		return mongoOp.findAndModify(q, u, options, Newspaper.class);
	}

	

	

	

}
