package it.polito.applied.smiled.service;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.security.CustomUserDetails;

import java.io.File;
import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileManagerService {

	public void postCoverScenario(String id, MultipartFile scenarioCover, CustomUserDetails user) throws IllegalStateException, IOException, BadRequestException;

	public File getScenarioCover(String id);

	public File getUserCover(String id);

	public void postCoverUser(MultipartFile userCover,
			CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException;

}
