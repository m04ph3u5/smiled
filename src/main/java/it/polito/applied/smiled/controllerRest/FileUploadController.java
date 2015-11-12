package it.polito.applied.smiled.controllerRest;

import it.polito.applied.smiled.dto.FileMetadataDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ErrorInfo;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.MediaDataAndContentType;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.service.FileManagerService;
import it.polito.applied.smiled.service.LogService;

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
	
	@Autowired
	private LogService logService;

	
	/*----------------------------------------------------COVER-----------------------------------------------------------*/
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="scenarios/{id}/cover", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')")
	public void uploadCoverScenario(@PathVariable String id, @RequestPart("file") MultipartFile scenarioCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		System.out.println("POST COVER");
		fileManagerService.postCoverScenario(id, scenarioCover, user);
		logService.logUpdateScenarioCover(id, user.getId());
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
		logService.logUpdateUserCover(user.getId());
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="me/coverLarge", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER')")
	public void uploadMeCoverLarge(@RequestPart("file") MultipartFile userCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		fileManagerService.postCoverLargeUser(userCover, user);
		logService.logUpdateUserCoverLarge(user.getId());
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
	@PreAuthorize("(principal.getId().equals(#id)) or (hasRole('ROLE_TEACHER')) or (hasRole('ROLE_USER') and hasPermission(#id, 'User', 'READ'))")
	public ByteArrayResource getUserCover(@PathVariable String id) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		return new ByteArrayResource(fileManagerService.getUserCover(id));
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="users/{id}/coverLarge", method=RequestMethod.GET)
	@PreAuthorize("(principal.getId().equals(#id)) or (hasRole('ROLE_TEACHER')) or (hasRole('ROLE_USER') and hasPermission(#id, 'User', 'READ'))")
	public ByteArrayResource getUserCoverLarge(@PathVariable String id) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		return new ByteArrayResource(fileManagerService.getUserCoverLarge(id));
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="scenarios/{id}/characters/{characterId}/cover", method=RequestMethod.POST)
	@PreAuthorize("(hasRole('ROLE_USER') and hasPermission(#id, 'Scenario', 'MODERATOR')) or (hasRole('ROLE_USER') and hasPermission(#characterId, 'Character', 'WRITE'))")
	public void uploadCharacterCover(@PathVariable String id, @PathVariable String characterId, @RequestPart("file") MultipartFile characterCover, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		fileManagerService.postCoverCharacter(characterCover, id, characterId, user);
		logService.logUpdateCharacterCover(id, user.getId(), characterId);
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
	public ResponseEntity<?> getMedia(@PathVariable String id, @RequestParam(value = "thumb", required=false) Boolean getThumb) {
		if(getThumb==null)
			getThumb=false;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		MediaDataAndContentType m;
		try {
			m = fileManagerService.getMedia(id,auth,getThumb);
		} catch(NotFoundException e){
			ErrorInfo error = new ErrorInfo();
			error.setStatusCode("404");
			error.setMessage(e.getMessage());
			return new ResponseEntity<ErrorInfo>(error, HttpStatus.NOT_FOUND);
		} catch(ForbiddenException e){
			ErrorInfo error = new ErrorInfo();
			error.setStatusCode("403");
			error.setMessage(e.getMessage());
			return new ResponseEntity<ErrorInfo>(error, HttpStatus.FORBIDDEN);
		} catch (BadRequestException e) {
			ErrorInfo error = new ErrorInfo();
			error.setStatusCode("400");
			error.setMessage("Il file caricato non è in un formato adatto. "+e.getMessage());
			return new ResponseEntity<ErrorInfo>(error, HttpStatus.BAD_REQUEST);
		} catch (HttpMediaTypeNotAcceptableException e) {
			ErrorInfo error = new ErrorInfo();
			error.setStatusCode("406");
			error.setMessage(e.getMessage());
			return new ResponseEntity<ErrorInfo>(error, HttpStatus.NOT_ACCEPTABLE);
		} catch (IOException e) {
			ErrorInfo error = new ErrorInfo();
			error.setStatusCode("500");
			error.setMessage(e.getMessage());
			return new ResponseEntity<ErrorInfo>(error, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.setContentType(m.getContentType());
		return new ResponseEntity<ByteArrayResource>(new ByteArrayResource(m.getData()),responseHeaders, HttpStatus.OK);
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="scenarios/{idScenario}/media", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'WRITE')")
	public Id postMedia(@PathVariable String idScenario, @RequestPart("file") MultipartFile media, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		return new Id(fileManagerService.postMedia(media, user, idScenario, false));
	}
	
	@ResponseStatus(value = HttpStatus.CREATED)
	@RequestMapping(value="scenarios/{idScenario}/trustedMedia", method=RequestMethod.POST)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'MODERATOR')")
	public Id postTrustedMedia(@PathVariable String idScenario, @RequestPart("file") MultipartFile media, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException{
		Id idMedia = new Id(fileManagerService.postMedia(media, user, idScenario, true));
		logService.logAddTrustedMedia(idScenario, user.getId(), idMedia.getId());
		return idMedia;
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{idScenario}/media/{idMedia}/meta", method=RequestMethod.PUT)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'MODERATOR')")
	public void postMediaMetadata(@PathVariable String idScenario, @PathVariable String idMedia, @RequestBody @Valid FileMetadataDTO mediaMeta, BindingResult result) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException, ForbiddenException, NotFoundException{
		if(result.hasErrors())
			throw new BadRequestException();
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		fileManagerService.postMediaMetadata(idMedia, mediaMeta, auth, true);
		logService.logUpdateTrustedMedia(idScenario, ((CustomUserDetails)auth.getPrincipal()).getId(), idMedia);
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
	@RequestMapping(value="me/media/{idMedia}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER')")
	public void deleteMedia(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String idMedia, @RequestParam(value = "postId", required=false) String postId) throws BadRequestException, IllegalStateException, IOException, NotFoundException, ForbiddenException{
		if(postId=="")
			postId=null;

		fileManagerService.deleteMedia(user,idMedia,postId);
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
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value="scenarios/{idScenario}/trustedMedia/{idMedia}", method=RequestMethod.DELETE)
	@PreAuthorize("hasRole('ROLE_USER') and hasPermission(#idScenario, 'Scenario', 'MODERATOR')")
	public void deleteTrustedMedia(@PathVariable String idScenario, @PathVariable String idMedia, @AuthenticationPrincipal CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, NotFoundException{
		
		fileManagerService.deleteTrustedMedia(idMedia);
		logService.logRemoveTrustedMedia(idScenario, user.getId(), idMedia);
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