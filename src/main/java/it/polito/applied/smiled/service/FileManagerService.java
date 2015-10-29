package it.polito.applied.smiled.service;

import it.polito.applied.smiled.dto.FileMetadataDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.pojo.MediaDataAndContentType;
import it.polito.applied.smiled.security.CustomUserDetails;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.multipart.MultipartFile;

public interface FileManagerService {

	public void postCoverScenario(String id, MultipartFile scenarioCover, CustomUserDetails user) throws IllegalStateException, IOException, BadRequestException, HttpMediaTypeNotAcceptableException;

	public byte[] getScenarioCover(String id) throws IOException, NotFoundException;

	public byte[] getUserCover(String id) throws NotFoundException, IOException;

	public void postCoverUser(MultipartFile userCover,
			CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException;

	public void postCoverCharacter(MultipartFile characterCover, String id, String characterId,
			CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException;

	public byte[] getCharacterCover(String characterId) throws NotFoundException, IOException;

	public MediaDataAndContentType getMedia(String id, Authentication auth, Boolean getThumb) throws FileNotFoundException, IOException, ForbiddenException, HttpMediaTypeNotAcceptableException;

	public String postMedia(MultipartFile media, CustomUserDetails user, String idScenario) throws HttpMediaTypeNotAcceptableException, IllegalStateException, IOException;

	public void postMediaMetadata(String idMedia, FileMetadataDTO fileMeta, Authentication user, Boolean trusted) throws BadRequestException, ForbiddenException, IOException;

	public Page<FileMetadataDTO> getUserImageMetadata(CustomUserDetails user, int nPag, int nItem) throws IOException;

	public Page<FileMetadataDTO> getUserFilesMetadata(CustomUserDetails user,
			Integer nPag, Integer nItem) throws IOException;

//	public Page<FileMetadataDTO> getScenarioImageMetadata(String idScenario,
//			Integer nPag, Integer nItem) throws IOException;
//
//	public Page<FileMetadataDTO> getScenarioFilesMetadata(String idScenario,
//			Integer nPag, Integer nItem) throws IOException;
	
	public List<FileMetadataDTO> getTrustedScenarioMediaMetadata(String idScenario);

	public void postCoverLargeUser(MultipartFile userCover,
			CustomUserDetails user) throws HttpMediaTypeNotAcceptableException, BadRequestException, IOException;

	public byte[] getUserCoverLarge(String id) throws FileNotFoundException, IOException;

	public byte[] getToolMap(Integer version) throws BadRequestException, IOException;

}
