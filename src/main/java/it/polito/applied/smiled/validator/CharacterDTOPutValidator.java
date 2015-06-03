package it.polito.applied.smiled.validator;

import it.polito.applied.smiled.dto.ScenarioDTO;
import it.polito.applied.smiled.repository.ScenarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Service
public class CharacterDTOPutValidator implements Validator {
	
	@Autowired
	private ScenarioRepository scenarioRepository;

	@Override
	public boolean supports(Class<?> clazz) {
		// TODO Auto-generated method stub
		return false;
	}

	
	@Override
	public void validate(Object target, Errors errors) {
		// TODO Controllare eventuali vincoli per la validazione custom dello scenario
	
		
	}
	
		
}
