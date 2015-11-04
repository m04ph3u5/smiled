package it.polito.applied.smiled.serializer;

import it.polito.applied.smiled.pojo.LogSession;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

@Component
public class CustomObjectMapper extends ObjectMapper{
	public CustomObjectMapper(){
		SimpleModule module = new SimpleModule("LogSessionModule");
		module.addSerializer(LogSession.class, new LogSessionSerializer());
		this.registerModule(module);
	}
}	
