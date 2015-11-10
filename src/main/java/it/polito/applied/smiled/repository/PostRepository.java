package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.scenario.Post;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String>, CustomPostRepository{

	public Post findById(String id);

}
