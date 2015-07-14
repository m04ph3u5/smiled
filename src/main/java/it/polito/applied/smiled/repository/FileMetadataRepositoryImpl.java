package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.ResourceType;
import it.polito.applied.smiled.pojo.SupportedMedia;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mongodb.WriteResult;

public class FileMetadataRepositoryImpl implements CustomFileMetadataRepository{

	@Autowired
	private MongoOperations mongoOp;

	@Override
	public boolean setFileMetadataPath(String id, String path) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id));
		Update u = new Update();
		u.set("path", path);
		WriteResult w = mongoOp.updateFirst(q, u, FileMetadata.class);
		if(w.isUpdateOfExisting())
			return true;
		else
			return false;	
	}

	@Override
	public List<FileMetadata> findUserImage(String userId, Pageable p) {
		Query q = new Query();
		Criteria c1 = new Criteria();
		c1.orOperator(Criteria.where("format").is(SupportedMedia.jpg),Criteria.where("format").is(SupportedMedia.png));
		Criteria c2 = new Criteria();
		c2.andOperator(Criteria.where("type").ne(ResourceType.TO_CONFIRM_IMG),Criteria.where("type").ne(ResourceType.ACTUAL_COVER));
		q.addCriteria(Criteria.where("userId").is(userId).andOperator(c1.andOperator(c2)));
		q.with(p);
		return mongoOp.find(q, FileMetadata.class);
	}

	@Override
	public List<FileMetadata> findUserFile(String userId, Pageable p) {
		Query q = new Query();
		
		q.addCriteria(Criteria.where("userId").is(userId)
				.andOperator(Criteria.where("format").ne(SupportedMedia.jpg)
						.andOperator(Criteria.where("format").ne(SupportedMedia.png)
								.andOperator(Criteria.where("type").ne(ResourceType.TO_CONFIRM_DOC)))));
		q.with(p);
		return mongoOp.find(q, FileMetadata.class);
	}

	@Override
	public List<FileMetadata> findScenarioImage(String idScenario, Pageable p) {
		Query q = new Query();
		Criteria c1 = new Criteria();
		c1.orOperator(Criteria.where("format").is(SupportedMedia.jpg),Criteria.where("format").is(SupportedMedia.png));
		Criteria c2 = new Criteria();
		c2.andOperator(Criteria.where("type").ne(ResourceType.TO_CONFIRM_IMG),Criteria.where("type").ne(ResourceType.ACTUAL_COVER));
		q.addCriteria(Criteria.where("scenarioId").is(idScenario).andOperator(c1.andOperator(c2)));
		q.with(p);
		return mongoOp.find(q, FileMetadata.class);
	}

	@Override
	public List<FileMetadata> findScenarioFile(String idScenario, Pageable p) {
		Query q = new Query();
		Criteria c1 = new Criteria();
		c1.andOperator(Criteria.where("format").ne(SupportedMedia.jpg),Criteria.where("format").ne(SupportedMedia.png));
		q.addCriteria(Criteria.where("scenarioId").is(idScenario).andOperator(c1.andOperator(Criteria.where("type").ne(ResourceType.TO_CONFIRM_DOC))));
		q.with(p);
		return mongoOp.find(q, FileMetadata.class);
	}

	@Override
	public FileMetadata confirmImage(String imageId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(imageId));
		Update u = new Update();
		u.set("type", ResourceType.IMAGE);
		
		return mongoOp.findAndModify(q, u, FileMetadata.class);
	}

	@Override
	public FileMetadata confirmFile(String fileId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(fileId));
		Update u = new Update();
		u.set("type", ResourceType.DOCUMENT);
		
		return mongoOp.findAndModify(q, u, FileMetadata.class);
	}

	@Override
	public FileMetadata putImageInDeleteStatus(String id) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id).andOperator(Criteria.where("type").is("IMAGE")));
		
		Update u = new Update();
		u.set("type", ResourceType.DELETED_IMG);
	
		return mongoOp.findAndModify(q, u, FileMetadata.class);
	}

	@Override
	public FileMetadata putFileInDeleteStatus(String id) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(id).andOperator(Criteria.where("type").is("DOCUMENT")));
		Update u = new Update();
		u.set("type", ResourceType.DELETED_DOC);
		
		return mongoOp.findAndModify(q, u, FileMetadata.class);
	}
	
	
}
