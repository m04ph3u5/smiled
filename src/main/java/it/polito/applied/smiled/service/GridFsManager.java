package it.polito.applied.smiled.service;

import it.polito.applied.smiled.pojo.FileMetadata;

import java.io.InputStream;

import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

public interface GridFsManager {

	GridFSFile save(InputStream input, String string, String contentType,
			FileMetadata meta);

	GridFSDBFile readOneByName(String name);

	void toOldCover(GridFSFile oldCover);

}
