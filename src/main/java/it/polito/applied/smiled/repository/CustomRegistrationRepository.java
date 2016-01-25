package it.polito.applied.smiled.repository;

import org.springframework.data.domain.Page;

import it.polito.applied.smiled.pojo.RegistrationToken;

public interface CustomRegistrationRepository {
	
	public Page<RegistrationToken> getPagedRegistrationRequests(Integer nPag, Integer nItem);
}
