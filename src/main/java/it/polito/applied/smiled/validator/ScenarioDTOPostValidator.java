package it.polito.applied.smiled.validator;

import it.polito.applied.smiled.dto.ScenarioDTO;
import it.polito.applied.smiled.repository.ScenarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Service
public class ScenarioDTOPostValidator implements Validator {
	
	@Autowired
	private ScenarioRepository scenarioRepository;

	@Override
	public boolean supports(Class<?> clazz) {
		// TODO Auto-generated method stub
		return false;
	}

	/*(POST) - lo scenario inviato dal teacher non presenta id, si tratta di un nuovo scenario
	 * In questo caso alcune validazioni (name, startDate, historyDate) sono già state effettuate (@valid su @requestBody)*/
	@Override
	public void validate(Object target, Errors errors) {
		// TODO Controllare eventuali vincoli per la validazione custom dello scenario
		ScenarioDTO scenario = (ScenarioDTO) target;
		
		//TODO validazioni su coerenza date history
	
		
	}
	
	private void validateStartDate(ScenarioDTO scenario, Errors errors) {
		// TODO Auto-generated method stub
		
	}

	
}
