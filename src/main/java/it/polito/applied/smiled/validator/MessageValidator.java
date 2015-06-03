package it.polito.applied.smiled.validator;
import it.polito.applied.smiled.pojo.Message;

import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Service
public class MessageValidator implements Validator {

	@Override
	public boolean supports(Class<?> clazz) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void validate(Object target, Errors errors) {
		Message message = (Message) target;
		//TODO Potrei verificare che lo user di destinazione esista nel sistema
		//if(message.getEmailTo())
		
	}

}
