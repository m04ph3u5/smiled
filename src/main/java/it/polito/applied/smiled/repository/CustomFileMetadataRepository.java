package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.FileMetadata;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomFileMetadataRepository {

	public boolean setFileMetadataPath(String id, String path);
	public List<FileMetadata> findUserImage(String userId, Pageable p);
	public List<FileMetadata> findUserFile(String userId,Pageable p);
	public List<FileMetadata> findScenarioImage(String idScenario, Pageable p);
	public List<FileMetadata> findScenarioFile(String idScenario, Pageable p);

}
