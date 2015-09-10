package it.polito.applied.smiled.service;

import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.ResourceType;
import it.polito.applied.smiled.pojo.SupportedMedia;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.imageio.ImageIO;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.stereotype.Service;

import com.mongodb.DBObject;
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
	public FileMetadata getMetadata(String filename) {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSFile metaFile = mongoOperations.findOne(q, GridFSFile.class, "fs.files");
		FileMetadata metadata = mongoOperations.getConverter().read(FileMetadata.class, metaFile.getMetaData());
		return metadata;
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
		List<GridFSFile> files = mongoOperations.find(q, GridFSFile.class, "fs.files");
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		for(GridFSFile f : files){
			metas.add(mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData()));
		}
		return metas;
	}

	@Override
	public List<FileMetadata> findUserFile(String id, Pageable p) {
		Query q = new Query();
		q.addCriteria(Criteria.where("metadata.userId").is(id).andOperator(Criteria.where("metadata.type").is(ResourceType.DOCUMENT)));
		q.with(p);
		List<GridFSFile> files = mongoOperations.find(q, GridFSFile.class, "fs.files");
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		for(GridFSFile f : files){
			metas.add(mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData()));
		}
		return metas;
	}

	@Override
	public List<FileMetadata> findScenarioImage(String idScenario, Pageable p) {
		Query q = new Query();
		q.addCriteria(Criteria.where("metadata.scenarioId").is(idScenario).andOperator(Criteria.where("metadata.type").is(ResourceType.IMAGE)));
		q.with(p);
		List<GridFSFile> files = mongoOperations.find(q, GridFSFile.class, "fs.files");
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		for(GridFSFile f : files){
			metas.add(mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData()));
		}
		return metas;
	}

	@Override
	public List<FileMetadata> findScenarioFile(String idScenario, Pageable p) {
		Query q = new Query();
		q.addCriteria(Criteria.where("metadata.scenarioId").is(idScenario).andOperator(Criteria.where("metadata.type").is(ResourceType.DOCUMENT)));
		q.with(p);
		List<GridFSFile> files = mongoOperations.find(q, GridFSFile.class, "fs.files");
		List<FileMetadata> metas = new ArrayList<FileMetadata>();
		for(GridFSFile f : files){
			metas.add(mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData()));
		}
		return metas;
	}

	
	private void generateThumb(InputStream input, String filename,
			String contentType, DBObject metadata) throws IOException {
		// TODO Auto-generated method stub
			BufferedImage sourceImage = ImageIO.read(input);
			int width = sourceImage.getWidth();
			int height = sourceImage.getHeight();
			BufferedImage img2=null;
			if(width>height){
				float extraSize=    height-100;
				float percentHight = (extraSize/height)*100;
				float percentWidth = width - ((width/100)*percentHight);
				BufferedImage img = new BufferedImage((int)percentWidth, 100, BufferedImage.TYPE_4BYTE_ABGR);
				Image scaledImage = sourceImage.getScaledInstance((int)percentWidth, 100, Image.SCALE_SMOOTH);
				Graphics2D g2 = img.createGraphics();
				//g2.setBackground(Color.WHITE);
				g2.clearRect(0,0,(int)percentWidth, 100);
				g2.setComposite(AlphaComposite.Src);
				g2.drawImage(scaledImage, 0, 0, null);
				img2 = new BufferedImage(100, 100 ,BufferedImage.TYPE_4BYTE_ABGR);
				img2 = img.getSubimage((int)((percentWidth-100)/2), 0, 100, 100);

			}else{
				float extraSize=    width-100;
				float percentWidth = (extraSize/width)*100;
				float  percentHight = height - ((height/100)*percentWidth);
				BufferedImage img = new BufferedImage(100, (int)percentHight, BufferedImage.TYPE_4BYTE_ABGR);
				Image scaledImage = sourceImage.getScaledInstance(100,(int)percentHight, Image.SCALE_SMOOTH);
				Graphics2D g2 = img.createGraphics();
				//g2.setBackground(Color.WHITE);
				g2.clearRect(0,0,100, (int)percentHight);
				g2.setComposite(AlphaComposite.Src);
				g2.drawImage(scaledImage, 0, 0, null);
				img2 = new BufferedImage(100, 100 ,BufferedImage.TYPE_4BYTE_ABGR);
				img2 = img.getSubimage(0, (int)((percentHight-100)/2), 100, 100);

			}
			
			String thumbName = "thumb"+filename;
			byte[] buffer = ((DataBufferByte)(img2).getRaster().getDataBuffer()).getData();
			ByteArrayInputStream in = new ByteArrayInputStream(buffer);
			gridFsOperation.store(in, thumbName, "image/png", metadata);
		
		}

	@Override
	public void saveThumb(String filename) throws IOException {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSDBFile file = gridFsOperation.findOne(q);
		generateThumb(file.getInputStream(), filename, file.getContentType(), file.getMetaData());
	}

	@Override
	public void confirmImage(String filename, FileMetadata f) throws IOException {
		f.setType(ResourceType.IMAGE);
		updateMetadata(filename, f);
		saveThumb(filename);		
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
		GridFSFile f = mongoOperations.findOne(q, GridFSFile.class, "fs.files");
		FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
		confirmImage(filename, meta);
		return meta;
	}

	@Override
	public FileMetadata confirmFile(String filename) {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSFile f = mongoOperations.findOne(q, GridFSFile.class, "fs.files");
		FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
		confirmFile(filename, meta);
		return meta;
	}

	@Override
	public FileMetadata putImageInDeleteStatus(String filename) {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSFile f = mongoOperations.findOne(q, GridFSFile.class, "fs.files");
		FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
		meta.setType(ResourceType.DELETED_IMG);
		updateMetadata(filename, meta);
		
		return meta;
	}

	@Override
	public FileMetadata putFileInDeleteStatus(String filename) {
		Query q = new Query();
		q.addCriteria(Criteria.where("filename").is(filename));
		GridFSFile f = mongoOperations.findOne(q, GridFSFile.class, "fs.files");
		FileMetadata meta = mongoOperations.getConverter().read(FileMetadata.class, f.getMetaData());
		meta.setType(ResourceType.DELETED_DOC);
		updateMetadata(filename, meta);
		
		return meta;
	}

	
}
