package com.example.demo.controllers;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.domains.Message;
import com.example.demo.utils.KHException;
import com.example.demo.utils.KHRTException;

@ControllerAdvice
public class ErrorController {
	
	@ExceptionHandler(KHException.class)
	public @ResponseBody Message messageException(KHException e) {
		return new Message(e.getCode(), e.getMessage());
	}
	
	@ExceptionHandler(KHRTException.class)
	public @ResponseBody Message messageException(KHRTException e) {
		return new Message(e.getCode(), e.getMessage());
	}
	
	@ExceptionHandler(AccessDeniedException.class)
	public @ResponseBody Message messageException(AccessDeniedException e) {
		return new Message("8888", e.getMessage());
	}
	
	
}
