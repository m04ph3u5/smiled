package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.FileMetadata;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileMetadataRepository extends MongoRepository<FileMetadata, String>, CustomFileMetadataRepository{

	public FileMetadata findById(String id);





}
