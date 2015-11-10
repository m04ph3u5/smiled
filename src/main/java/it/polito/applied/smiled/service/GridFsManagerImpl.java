package it.polito.applied.smiled.service;

import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.ResourceType;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.gridfs.GridFsCriteria;
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
			String contentType, FileMetadata metadata) throws IOException {
		
		GridFSFile meta = gridFsOperation.store(input, filename, contentType, metadata);
		return meta;
	}

	@Override
	public GridFSDBFile readOneByName(String name) {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(name));
		return gridFsOperation.findOne(q);
	}
	
	@Override
	public GridFSDBFile readOneById(String id) {
		Query q = new Query();
		q.addCriteria(Criteria.where("_id").is(new ObjectId(id)));
		return gridFsOperation.findOne(q);
	}

	@Override
	public void toOldCover(GridFSFile oldCover) {
		if(oldCover!=null){
			String id = oldCover.getId().toString();
			FileMetadata oldMeta = mongoOperations.getConverter().read(FileMetadata.class, oldCover.getMetaData());
			
			System.out.println("OLD META: "+oldMeta.getOriginalName());
			
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

	@Override
	public FileMetadata getMetadata(String filename) throws NotFoundException {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSDBFile file = gridFsOperation.findOne(q);
		if(file==null)
			throw new NotFoundException();
		FileMetadata metadata = mongoOperations.getConverter().read(FileMetadata.class, file.getMetaData());
		metadata.setId(file.getFilename());
		return metadata;
	}
	
	@Override
	public GridFSFile getOriginalMetadata(String filename) {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		return mongoOperations.findOne(q, GridFSFile.class, "fs.files");
	}

	@Override
	public void updateMetadata(String filename, FileMetadata fileMeta) {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		Update u = new Update();
		u.set("metadata", fileMeta);
		mongoOperations.updateFirst(q, u, "fs.files");
	}

	@Override
	public FileMetadata getMetadata(GridFSDBFile file) {
		return mongoOperations.getConverter().read(FileMetadata.class, file.getMetaData());
	}

	@Override
	public List<FileMetadata> findUserImage(String id, Pageable p) {
		Query q = new Query();
		q.addCriteria(Criteria.where("metadata.userId").is(id).andOperator(Criteria.where("metadata.type").is(ResourceType.IMAGE)));
		q.with(p);
		List<GridFSDBFile> files = gridFsOperation.find(q);
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		if(files!=null){
			for(GridFSDBFile f : files){
				metas.add(mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData()));
			}
		}
		return metas;
	}

	@Override
	public List<FileMetadata> findUserFile(String id, Pageable p) {
		Query q = new Query();
		q.addCriteria(Criteria.where("metadata.userId").is(id).andOperator(Criteria.where("metadata.type").is(ResourceType.DOCUMENT)));
		q.with(p);
		List<GridFSDBFile> files = gridFsOperation.find(q);
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		if(files!=null){
			for(GridFSDBFile f : files){
				metas.add(mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData()));
			}
		}
		return metas;
	}

	@Override
	public List<FileMetadata> findScenarioImage(String idScenario, Pageable p) {
		Query q = new Query();
		q.addCriteria(Criteria.where("metadata.scenarioId").is(idScenario).andOperator(Criteria.where("metadata.type").is(ResourceType.IMAGE)));
		q.with(p);
		List<GridFSDBFile> files = gridFsOperation.find(q);
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		if(files!=null){
			for(GridFSDBFile f : files){
				metas.add(mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData()));
			}
		}
		return metas;
	}

	@Override
	public List<FileMetadata> findScenarioFile(String idScenario, Pageable p) {
		Query q = new Query();
		q.addCriteria(Criteria.where("metadata.scenarioId").is(idScenario).andOperator(Criteria.where("metadata.type").is(ResourceType.DOCUMENT)));
		q.with(p);
		List<GridFSDBFile> files = gridFsOperation.find(q);
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		if(files!=null){
			for(GridFSDBFile f : files){
				metas.add(mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData()));
			}
		}
		return metas;
	}
	
	@Override
	public List<FileMetadata> findScenarioTrustedMedia(String idScenario) {
		Query q = new Query();
		q.addCriteria(Criteria.where("metadata.scenarioId").is(idScenario).andOperator(Criteria.where("metadata.trusted").is(true)));
//		List<GridFSFile> files = mongoOperations.find(q, GridFSFile.class, "fs.files");
		List<GridFSDBFile> files = gridFsOperation.find(q);
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		if(files!=null){
			for(GridFSDBFile f : files){
				FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
				meta.setId(f.getFilename());
				metas.add(meta);	
				System.out.println(f.getFilename()+" ");
			}
		}
		return metas;
	}

		
	@Override
	public void confirmImage(String filename, FileMetadata f) throws IOException {
		f.setType(ResourceType.IMAGE);
		updateMetadata(filename, f);
	}

	@Override
	public void confirmFile(String filename, FileMetadata f) {
		f.setType(ResourceType.DOCUMENT);	
		updateMetadata(filename, f);
	}

	@Override
	public FileMetadata confirmImage(String filename) throws IOException {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSDBFile f = gridFsOperation.findOne(q);
		if(f==null)
			throw new FileNotFoundException();
		FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
		if(meta.getId()==null)
			meta.setId(filename);
		confirmImage(filename, meta);
		System.out.println("META - id:"+meta.getId()+" originalName:"+meta.getOriginalName()+" userID: "+meta.getUserId());
		return meta;
	}

	@Override
	public FileMetadata confirmFile(String filename) throws FileNotFoundException {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSDBFile f = gridFsOperation.findOne(q);
		if(f==null)
			throw new FileNotFoundException();
		FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
		if(meta.getId()==null)
			meta.setId(filename);
		confirmFile(filename, meta);
		return meta;
	}

	@Override
	public FileMetadata putImageInDeleteStatus(String filename) throws FileNotFoundException {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSDBFile f = gridFsOperation.findOne(q);
		if(f==null)
			throw new FileNotFoundException();
		FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
		meta.setType(ResourceType.DELETED_IMG);
		if(meta.getId()==null)
			meta.setId(filename);
		updateMetadata(filename, meta);
		
		return meta;
	}

	@Override
	public FileMetadata putFileInDeleteStatus(String filename) throws FileNotFoundException {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSFile f = mongoOperations.findOne(q, GridFSFile.class, "fs.files");
		if(f==null)
			throw new FileNotFoundException();
		FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
		meta.setType(ResourceType.DELETED_DOC);
		if(meta.getId()==null)
			meta.setId(filename);
		updateMetadata(filename, meta);
		
		return meta;
	}

	@Override
	public void deleteMedia(String idMedia) {
		Query q = new Query();
//		if(onlyTrusted)
//			q.addCriteria(Criteria.where("files_id").is(idMedia).andOperator(Criteria.where("trusted").is(true)));
//		else
//			q.addCriteria(Criteria.where("files_id").is(idMedia));
//		
		q.addCriteria(GridFsCriteria.whereFilename().is(idMedia));
		
		
		gridFsOperation.delete(q);
	}

	
}
