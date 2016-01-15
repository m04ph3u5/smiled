package it.polito.applied.smiled.validator;

import it.polito.applied.smiled.dto.ScenarioDTO;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.ScenarioStatus;
import it.polito.applied.smiled.repository.ScenarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Service
public class ScenarioDTOPutValidator implements Validator {
	
	@Autowired
	private ScenarioRepository scenarioRepository;

	@Override
	public boolean supports(Class<?> clazz) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void validate(Object target, Errors errors) {
//		ScenarioDTO scenario = (ScenarioDTO) target;
//		if( 	scenario.getHistory() == null &&
//				scenario.getName() == null && scenario.getStatus() == null){
//			errors.rejectValue("", "All fields are empty!!!");
//			return;
//		}
//		else{
//			Scenario oldScenario = scenarioRepository.findById(scenario.getId());
//			if (oldScenario == null){
//				errors.rejectValue("", "Scenario not found!!!");
//				return;
//			}
//			
//			if((scenario.getName()!=null)&&(scenario.getName().length()< 2)){
//				errors.rejectValue("name", "Name too short");
//				return;
//			}
//			
//			//TODO validazioni su coerenza date history
//			
//			if(scenario.getStatus() != null){
//				ScenarioStatus oldS = oldScenario.getStatus();
//				ScenarioStatus newS = scenario.getStatus();
//				//posso fare modifiche di stato solo se quello vecchio era ACTIVE o CREATED_V3 (in questo caso devo controllare le liste di attendees e characters)
//				if(newS.equals(ScenarioStatus.ACTIVE)){
//					if(oldS.equals(ScenarioStatus.CREATED_V1) || oldS.equals(ScenarioStatus.CREATED_V2) || oldS.equals(ScenarioStatus.CLOSED))
//						errors.rejectValue("status", "Invalid transaction Status");
//					else if (oldS.equals(ScenarioStatus.CREATED_V3)){
//						if(oldScenario.getCharacters() == null || oldScenario.getAttendees() == null)
//							errors.rejectValue("status", "Invalid transaction: missing attendeesList or charactersList");
//					}else{
//						errors.rejectValue("status", "Invalid transaction Status");
//					}
//				}
//				else if(newS.equals(ScenarioStatus.CLOSED) && !oldS.equals(ScenarioStatus.ACTIVE))
//					errors.rejectValue("status", "Invalid transaction: can't close this scenario");
//				else{
//					errors.rejectValue("status", "Invalid transaction status: can't assign to created v1, v2 or v3");
//				}
//			}
//			
//			
//			//TODO - Validazioni su passaggi di stato dello scenario e su tutto il resto che � stato passato per l'UPDATE
//		}
		
		
	}
	
	private void validateStartDate(ScenarioDTO scenario, Errors errors) {
		// TODO Auto-generated method stub
		
	}

	
}
