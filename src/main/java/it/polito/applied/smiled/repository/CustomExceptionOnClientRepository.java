package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.ExceptionOnClient;

import org.springframework.data.domain.Page;

public interface CustomExceptionOnClientRepository {

	public Page<ExceptionOnClient> getPagingException(Integer nPag, Integer nItem);
}
