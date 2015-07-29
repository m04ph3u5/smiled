package it.polito.applied.smiled.service;

import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.ResourceType;

import java.io.InputStream;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.stereotype.Service;

import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

@Service
public class GridFsManagerImpl implements GridFsManager{

	@Autowired
	private GridFsOperations gridFsOperation;
	
	@Autowired
	private MongoOperations mongoOperations;

	@Override
	public GridFSFile save(InputStream input, String filename,
			String contentType, FileMetadata metadata) {
		return gridFsOperation.store(input, filename, contentType, metadata);
	}

	@Override
	public GridFSDBFile readOneByName(String name) {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(name));
		return gridFsOperation.findOne(q);
	}

	@Override
	public void toOldCover(GridFSFile oldCover) {
		String id = oldCover.getId().toString();
		FileMetadata oldMeta = mongoOperations.getConverter().read(FileMetadata.class, oldCover.getMetaData());
		oldMeta.setType(ResourceType.OLD_COVER);
		oldMeta.setLastChange(new Date());
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(oldCover.getFilename()));
		Update u = new Update();
		u.set("filename", id);
		u.set("metadata", oldMeta);
		mongoOperations.updateFirst(q, u, "fs.files");
	}
	
	
}
