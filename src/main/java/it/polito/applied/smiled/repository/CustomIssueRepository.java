package it.polito.applied.smiled.repository;

import org.springframework.data.domain.Page;

import it.polito.applied.smiled.pojo.Issue;

public interface CustomIssueRepository {
	public Page<Issue> getPagingIssues(Integer nPag, Integer nItem);
}
