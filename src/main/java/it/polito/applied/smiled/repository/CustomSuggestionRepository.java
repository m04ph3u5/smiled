package it.polito.applied.smiled.repository;

import org.springframework.data.domain.Page;

import it.polito.applied.smiled.pojo.Suggestion;

public interface CustomSuggestionRepository {
	public Page<Suggestion> getPagingSuggestions(Integer nPag, Integer nItem);
}
