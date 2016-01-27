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
import org.springframework.data.mongodb.core.query.Query;

import it.polito.applied.smiled.pojo.Suggestion;

public class SuggestionRepositoryImpl implements CustomSuggestionRepository{

	@Autowired 
	private MongoOperations mongoOp;
	
	@Override
	public Page<Suggestion> getPagingSuggestions(Integer nPag, Integer nItem) {
		Query q = new Query();

		Sort s;
		s = new Sort( new Order(Direction.DESC, "date"));
		long total = mongoOp.count(q, Suggestion.class);
		
		Pageable p = new PageRequest(nPag,nItem, s);
		q.with(p);
		
		List<Suggestion> suggestions = mongoOp.find(q, Suggestion.class);
		return new PageImpl<Suggestion>(suggestions,p,total);
	}

}
