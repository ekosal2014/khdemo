package com.example.demo.configurations;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.example.demo.domains.Message;
import com.fasterxml.jackson.databind.ObjectMapper;



@Component("ajaxAuthenticationFailureHandler")
public class AjaxAuthenticationFailureHandler implements AuthenticationFailureHandler{

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		// TODO Auto-generated method stub
		System.out.println("error 123");
		Message msg = new Message("9999",exception.getMessage());
		ObjectMapper mapper = new ObjectMapper();	
		String result = mapper.writeValueAsString(msg);
		response.getWriter().print(result);
		response.getWriter().flush();
		
		
	}

}
