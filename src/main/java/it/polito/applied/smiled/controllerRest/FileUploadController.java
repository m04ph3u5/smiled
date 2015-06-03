package it.polito.applied.smiled.controllerRest;

import it.polito.applied.smiled.exception.BadRequestException;

import java.io.File;
import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.MongoException;

@RestController
public class FileUploadController {

	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="/v1/upload", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER')")
	public String uploadPhoto(@RequestPart("profilePicture") MultipartFile profilePicture) throws MongoException, BadRequestException, IllegalStateException, IOException{
		profilePicture.transferTo(new File("/tmp/smiled/photo/"+profilePicture.getOriginalFilename()));
		return profilePicture.getOriginalFilename();
	}
	
}
