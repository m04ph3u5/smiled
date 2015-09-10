package it.polito.applied.smiled.service;

import it.polito.applied.smiled.pojo.FileMetadata;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.data.domain.Pageable;

import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

public interface GridFsManager {

	GridFSFile save(InputStream input, String string, String contentType,
			FileMetadata meta) throws IOException;

	GridFSDBFile readOneByName(String name);

	void toOldCover(GridFSFile oldCover);

	FileMetadata getMetadata(String filename);

	void updateMetadata(String filename, FileMetadata fileMeta);

	FileMetadata getMetadata(GridFSDBFile file);

	List<FileMetadata> findUserImage(String id, Pageable p);

	List<FileMetadata> findUserFile(String id, Pageable p);

	List<FileMetadata> findScenarioImage(String idScenario, Pageable p);

	List<FileMetadata> findScenarioFile(String idScenario, Pageable p);

	void saveThumb(String filename) throws IOException;

	void confirmImage(String filename, FileMetadata f) throws IOException;

	void confirmFile(String filename, FileMetadata f);

	FileMetadata confirmImage(String string) throws IOException;

	FileMetadata confirmFile(String string);

	FileMetadata putImageInDeleteStatus(String string);

	FileMetadata putFileInDeleteStatus(String string);

	GridFSDBFile readOneById(String name);

}
