package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.FileMetadata;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileMetadataRepository extends MongoRepository<FileMetadata, String>{

	public FileMetadata findById(String id);
}
