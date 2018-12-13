package com.example.demo.utils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.demo.domains.User;

public class SessionUtils {

	public static final String KH_SESSION = "KH_SESSION";
	
	public static void setSession(HttpSession session,User User) {
		session.setAttribute(KH_SESSION, User);
		session.setMaxInactiveInterval(60*60);
	}
	public static void removeSession(HttpSession session) {
		session.removeAttribute(KH_SESSION);
	}
	public static User getSession(HttpServletRequest request,HttpServletResponse response) throws SessionException {
		HttpSession session = request.getSession(false);
			if (session != null) {
				if (session.getAttribute(KH_SESSION) == null) {
					throw new SessionException("0001","Session removed!");
					
				}else {
					try {
						return (User) session.getAttribute(KH_SESSION);
					}catch(Exception e) {
						throw new SessionException("0001","Session removed!");
					}
				}
			}else {
				throw new SessionException("0001","Session removed!");
			}
		
	}
	public static void getSessionLoanView(HttpServletRequest request) throws SessionException{
		try{
			HttpSession session = request.getSession(false);
			if (session.getAttribute(KH_SESSION) == null){
				throw new SessionException("0001","Session removed!");
			}
		}catch(Exception e){
			e.printStackTrace();
			throw new SessionException("0001","Session removed!");
		}
	}
	
	public static User getSubPermission() {
		
	
		try{
			
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				return  (User) auth.getPrincipal();				
			}else{
				throw new KHRTException("9999", "session closed");
			}

		}catch(Exception e){
			
			throw new KHRTException("9999", "session closed");
		}
		
	}
}
