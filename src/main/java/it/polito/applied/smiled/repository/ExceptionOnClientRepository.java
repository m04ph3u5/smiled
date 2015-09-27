package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.ExceptionOnClient;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ExceptionOnClientRepository extends MongoRepository<ExceptionOnClient, String>, CustomExceptionOnClientRepository{



}
