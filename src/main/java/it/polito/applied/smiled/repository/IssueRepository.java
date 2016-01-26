package it.polito.applied.smiled.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import it.polito.applied.smiled.pojo.Issue;

public interface IssueRepository extends MongoRepository<Issue, String>, CustomIssueRepository {

}
