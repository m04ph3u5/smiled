package it.polito.applied.smiled.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import it.polito.applied.smiled.pojo.Issue;
import it.polito.applied.smiled.pojo.user.User;

public class IssueRepositoryImpl implements CustomIssueRepository{
	
	@Autowired
	private MongoOperations mongoOp;
	
	@Override
	public Page<Issue> getPagingIssues(Integer nPag, Integer nItem) {
		Query q = new Query();

		Sort s;
		s = new Sort( new Order(Direction.DESC, "date"));
		long total = mongoOp.count(q, Issue.class);
		
		Pageable p = new PageRequest(nPag,nItem, s);
		q.with(p);
		
		List<Issue> issues = mongoOp.find(q, Issue.class);
		
		return new PageImpl<Issue>(issues,p,total);
	}

}
