package com.example.demo.configurations;

import java.io.IOException;

import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.demo.domains.Message;
import com.example.demo.domains.Role;
import com.example.demo.domains.User;
import com.example.demo.mappers.UserMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component("ajaxAuthenticationSuccessHandler")
public class AjaxAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		// TODO Auto-generated method stub
		String targetUrl = "/demo";		
		
		
		ObjectMapper mapper = new ObjectMapper();	
		Message msg = new Message("0000",targetUrl);
		String str = mapper.writeValueAsString(msg);
		response.getWriter().print(str);
		response.getWriter().flush();
		
	}
	
	/**
	 * This method extracts the roles of currently logged-in user and return
	 * appropriate URL according to user's role.
	 * @param authentication
	 * @return
	 */
	/*public String determineTargetUrl(Authentication authentication){
		Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
		List<String> roles = new ArrayList<String>();
		for(GrantedAuthority authority: authorities){
			System.out.println("ROLE: "+ authority.getAuthority());
			roles.add(authority.getAuthority());
		}
		
		User user = (User)authentication.getPrincipal();
		List<Role> roleInCom = userMapper.getAllRolesInCompany(user.getCompany().getCom_id());
		System.out.println("ROLE: "+ user.getCompany().getCom_id());
		String urlTarget = "./error/403";

		for ( Role rl : user.getRoles() ) {
			
			for(Role role : roleInCom ) {
				
				if (role.getRole_name().equals(rl.getRole_name())) {
					
					urlTarget = "/demo";
					
				}
				
			}
			
			if (rl.getRole_name().equals("ROLE_ADMIN")) {
				urlTarget = "/khmoney/admin";
				break;
			}
			
		}
		
		return urlTarget;
	}
*/
}
