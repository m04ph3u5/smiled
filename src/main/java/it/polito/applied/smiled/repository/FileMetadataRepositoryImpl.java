package it.polito.applied.smiled.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;

public class FileMetadataRepositoryImpl implements CustomFileMetadataRepository{

	@Autowired
	private MongoOperations mongoOp;
	
	
}
