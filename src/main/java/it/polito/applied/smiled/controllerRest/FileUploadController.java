package it.polito.applied.smiled.controllerRest;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.FileManagerService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.MongoException;

@RestController
@RequestMapping(value="/v1/")
public class FileUploadController {
	
	@Autowired
	private FileManagerService fileManagerService;

	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{id}/cover", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void uploadCoverScenario(@PathVariable String id, @RequestPart("file") MultipartFile scenarioCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException{
		fileManagerService.postCoverScenario(id, scenarioCover, user);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{id}/cover", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ')")
	public FileSystemResource getCoverScenario(@PathVariable String id) throws BadRequestException, IllegalStateException, IOException{
		return new FileSystemResource(fileManagerService.getScenarioCover(id));
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="me/cover", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER')")
	public void uploadMeCover(@RequestPart("file") MultipartFile userCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException{
		fileManagerService.postCoverUser(userCover, user);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="me/cover", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER')")
	public FileSystemResource getMeCover(@AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException{
		return new FileSystemResource(fileManagerService.getUserCover(user.getId()));
	}

}
