package it.polito.applied.smiled.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import it.polito.applied.smiled.pojo.newspaper.NewspaperTemplate;

public interface NewspaperTemplateRepository extends MongoRepository<NewspaperTemplate, String>{

	public NewspaperTemplate findByIdTemplate(int id);
}
