package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.ExceptionOnClient;
import it.polito.applied.smiled.pojo.user.User;

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

public class ExceptionOnClientRepositoryImpl implements CustomExceptionOnClientRepository{

	@Autowired
	private MongoOperations mongoOp;
	
	@Override
	public Page<ExceptionOnClient> getPagingException(Integer nPag, Integer nItem){
		Query q = new Query();
		Sort s;
		s = new Sort( new Order(Direction.DESC, "date"));
		
		long total = mongoOp.count(q, ExceptionOnClient.class);
		Pageable p = new PageRequest(nPag,nItem, s);
		q.with(p);
		List<ExceptionOnClient> exceptions = mongoOp.find(q, ExceptionOnClient.class);
		return new PageImpl<ExceptionOnClient>(exceptions, p, total);
	}
	

}
