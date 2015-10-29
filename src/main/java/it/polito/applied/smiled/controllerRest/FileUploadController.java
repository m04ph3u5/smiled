package it.polito.applied.smiled.controllerRest;

import it.polito.applied.smiled.dto.FileMetadataDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.MediaDataAndContentType;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.FileManagerService;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping(value="/v1/")
public class FileUploadController extends BaseController{
	
	@Autowired
	private FileManagerService fileManagerService;

	
	/*----------------------------------------------------COVER-----------------------------------------------------------*/
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="scenarios/{id}/cover", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void uploadCoverScenario(@PathVariable String id, @RequestPart("file") MultipartFile scenarioCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		System.out.println("POST COVER");
		fileManagerService.postCoverScenario(id, scenarioCover, user);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{id}/cover", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ')")
	public ByteArrayResource getCoverScenario(HttpServletRequest request, HttpServletResponse response, @PathVariable String id) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		  return new ByteArrayResource(fileManagerService.getScenarioCover(id));
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="me/cover", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER')")
	public void uploadMeCover(@RequestPart("file") MultipartFile userCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		fileManagerService.postCoverUser(userCover, user);
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="me/coverLarge", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER')")
	public void uploadMeCoverLarge(@RequestPart("file") MultipartFile userCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		fileManagerService.postCoverLargeUser(userCover, user);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="me/cover", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER')")
	public ByteArrayResource getMeCover(@AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		return new ByteArrayResource(fileManagerService.getUserCover(user.getId()));
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="me/coverLarge", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER')")
	public ByteArrayResource getMeCoverLarge(@AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		return new ByteArrayResource(fileManagerService.getUserCoverLarge(user.getId()));
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="users/{id}/cover", method=RequestMethod.GET)
	@PreAuthorize("(principal.getId().equals(#userId)) or (hasRole('ROLE_TEACHER')) or (hasRole('ROLE_USER') and hasPermission(#userId, 'User', 'READ'))")
	public ByteArrayResource getUserCover(@PathVariable String id) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		return new ByteArrayResource(fileManagerService.getUserCover(id));
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="users/{id}/coverLarge", method=RequestMethod.GET)
	@PreAuthorize("(principal.getId().equals(#userId)) or (hasRole('ROLE_TEACHER')) or (hasRole('ROLE_USER') and hasPermission(#userId, 'User', 'READ'))")
	public ByteArrayResource getUserCoverLarge(@PathVariable String id) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		return new ByteArrayResource(fileManagerService.getUserCoverLarge(id));
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="scenarios/{id}/characters/{characterId}/cover", method=RequestMethod.POST)
	@PreAuthorize("(hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')) or (hasRole('ROLE_USER') and hasPermission(#characterId, 'Character', 'WRITE'))")
	public void uploadCharacterCover(@PathVariable String id, @PathVariable String characterId, @RequestPart("file") MultipartFile characterCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		fileManagerService.postCoverCharacter(characterCover, id, characterId, user);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{id}/characters/{characterId}/cover", method=RequestMethod.GET)
	@PreAuthorize("(hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'READ'))")
	public ByteArrayResource getCharacterCover(@PathVariable String id, @PathVariable String characterId) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		return new ByteArrayResource(fileManagerService.getCharacterCover(characterId));
	}
	
	/*----------------------------------------------------MEDIA-----------------------------------------------------------*/
	
	//@ResponseStatus(value = HttpStatus.OK)  ByteArrayResource
	@RequestMapping(value="media/{id}", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER')")
	public ResponseEntity<ByteArrayResource> getMedia(@PathVariable String id, @RequestParam(value = "thumb", required=false) Boolean getThumb) throws BadRequestException, IllegalStateException, NotFoundException, FileNotFoundException, ForbiddenException, IOException, HttpMediaTypeNotAcceptableException {
		if(getThumb==null)
			getThumb=false;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		MediaDataAndContentType m = fileManagerService.getMedia(id,auth,getThumb);
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.setContentType(m.getContentType());
		return new ResponseEntity<ByteArrayResource>(new ByteArrayResource(m.getData()),responseHeaders, HttpStatus.OK);
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="scenarios/{idScenario}/media", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'WRITE')")
	public Id postMedia(@PathVariable String idScenario, @RequestPart("file") MultipartFile media, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		return new Id(fileManagerService.postMedia(media, user, idScenario));
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{idScenario}/media/{idMedia}/meta", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'MODERATOR')")
	public void postMediaMetadata(@PathVariable String idScenario, @PathVariable String idMedia, @RequestBody @Valid FileMetadataDTO mediaMeta, BindingResult result) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException, ForbiddenException{
		if(result.hasErrors())
			throw new BadRequestException();
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		fileManagerService.postMediaMetadata(idMedia, mediaMeta, auth, true);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="me/media/images/meta", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER')")
	public Page<FileMetadataDTO> getUserImagesMetadata(@AuthenticationPrincipal CustomUserDetails user, @RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		if(nPag==null || nPag<0)
			nPag=0;
		if(nItem==null || nItem<=0)
			nItem=5;
		return fileManagerService.getUserImageMetadata(user,nPag,nItem);
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="me/media/files/meta", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER')")
	public Page<FileMetadataDTO> getUserFilesMetadata(@AuthenticationPrincipal CustomUserDetails user, @RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		if(nPag==null || nPag<0)
			nPag=0;
		if(nItem==null || nItem<=0)
			nItem=5;
		return fileManagerService.getUserFilesMetadata(user,nPag,nItem);
	}
	
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{idScenario}/media/trusted/meta", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
	public List<FileMetadataDTO> getScenarioTrustedMediaMetadata(@PathVariable String idScenario) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		
		return fileManagerService.getTrustedScenarioMediaMetadata(idScenario);
	}
	
//	@ResponseStatus(value = HttpStatus.OK)
//	@RequestMapping(value="scenarios/{idScenario}/media/image/meta", method=RequestMethod.GET)
//	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
//	public Page<FileMetadataDTO> getScenarioImagesMetadata(@PathVariable String idScenario, @RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
//		if(nPag==null || nPag<0)
//			nPag=0;
//		if(nItem==null || nItem<=0)
//			nItem=5;
//		return fileManagerService.getScenarioImageMetadata(idScenario,nPag,nItem);
//	}
//	
//	@ResponseStatus(value = HttpStatus.OK)
//	@RequestMapping(value="scenarios/{idScenario}/media/files/meta", method=RequestMethod.GET)
//	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'READ')")
//	public Page<FileMetadataDTO> getScenarioFilesMetadata(@PathVariable String idScenario, @RequestParam(value = "nPag", required=false) Integer nPag, @RequestParam(value = "nItem", required=false) Integer nItem) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
//		if(nPag==null || nPag<0)
//			nPag=0;
//		if(nItem==null || nItem<=0)
//			nItem=5;
//		return fileManagerService.getScenarioFilesMetadata(idScenario,nPag,nItem);
//	}
	
	/*--------------------------------------------------------MAP TOOL-------------------------------------------------*/
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="toolMap", method=RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_TEACHER')")
	public byte[] getToolMap(@RequestParam(value = "version", required=true) Integer version) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		if(version<1 || version>5)
			throw new BadRequestException();
		return fileManagerService.getToolMap(version);
	}
	
}