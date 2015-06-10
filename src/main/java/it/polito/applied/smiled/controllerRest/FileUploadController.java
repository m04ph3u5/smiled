package it.polito.applied.smiled.controllerRest;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.security.CustomUserDetails;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
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

@Controller
@RequestMapping(value="/v1/media/")
public class FileUploadController {

	@Value("${webapp.path}")
	private String path;

	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{id}/cover", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void uploadPhotoScenario(@PathVariable String id, @RequestPart("file") MultipartFile scenarioCover) throws BadRequestException, IllegalStateException, IOException{
		System.out.println("uploadPhoto "+id);
		scenarioCover.transferTo(new File(path+"/img/cover/scenarios/"+id));
		//return profilePicture.getOriginalFilename();
	}

	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="users/cover", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER')")
	public void uploadPhotoUser(@RequestPart("file") MultipartFile scenarioCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, ForbiddenException{


		scenarioCover.transferTo(new File(path+"/img/cover/users/"+user.getId()));
		//return profilePicture.getOriginalFilename();
	}

}
