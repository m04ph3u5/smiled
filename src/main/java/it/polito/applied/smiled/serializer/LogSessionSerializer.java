package it.polito.applied.smiled.serializer;

import java.io.IOException;

import it.polito.applied.smiled.pojo.LogSession;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class LogSessionSerializer extends JsonSerializer<LogSession>{

	@Override
	public void serialize(LogSession value, JsonGenerator jGen,
			SerializerProvider provider) throws IOException,
			JsonProcessingException {
		jGen.writeStartObject();
		if(value.getId()==null){
//			DBObject dbo = new BasicDBObject();
//			dbo.put("id", value.getUserId());
			String s = "id : "+value.getUserId();
			jGen.writeString(s);
		}else{
			jGen.writeStartObject();
			jGen.writeObjectField("", value);
		}
	}
	
}
