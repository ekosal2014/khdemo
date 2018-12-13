package com.example.demo.configurations;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;

import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;


import com.example.demo.services.CustomAuthenticationProvider;


@Configuration
public class KHSecurityConfiguration extends WebSecurityConfigurerAdapter{

	@Autowired
	private AjaxAuthenticationSuccessHandler ajaxAuthenticationSuccessHandler;
	@Autowired
	private AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler;
	@Autowired
	private CustomAuthenticationProvider customAuthenticationProvider;
	

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		 
	      http.exceptionHandling().authenticationEntryPoint((request, response, authException) -> {
		        String requestType = request.getHeader("x-requested-with");
		        System.out.println("session " + requestType);
		        if (!StringUtils.isEmpty(requestType)) {
		            response.setStatus(HttpServletResponse.SC_OK);
		            response.getWriter().print("{\"status\": \"901\" , \"message\":\" session invalid.\"}");
		            response.getWriter().flush();
		        } else {
		            response.sendRedirect("/demo/login");
		        }
		    });
		 
		http
			.authorizeRequests()
				.antMatchers("/register").permitAll()
			    .antMatchers("/login").permitAll()			  
				.antMatchers("/admin/**").access("hasRole('ROLE_ADMIN')")
				.anyRequest().authenticated()
			.and()
			.formLogin()
				.loginPage("/login")
				.usernameParameter("username")
				.passwordParameter("password")
				.failureUrl("/login?error")
				//.successForwardUrl("/home")
				.successHandler(ajaxAuthenticationSuccessHandler)
				.failureHandler(ajaxAuthenticationFailureHandler)
				.permitAll()
			.and()
				.logout()
				.permitAll()
			.and()
			.exceptionHandling().accessDeniedPage("/error/403");
			
			//.exceptionHandling().accessDeniedHandler(accessDeniedHandler);
	}
	
	@Bean
	public AuthenticationEntryPoint loginUrlauthenticationEntryPoint(){
	    return new LoginUrlAuthenticationEntryPoint("/userLogin");
	}
	         
	@Bean
	public AuthenticationEntryPoint loginUrlauthenticationEntryPointWithWarning(){
	    return new LoginUrlAuthenticationEntryPoint("/userLoginWithWarning");
	}
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		/*auth
			.inMemoryAuthentication()
				.withUser("user").password("123").roles("USER")
				.and()
				.withUser("admin").password("123").roles("ADMIN");	*/	
	
		
		/*auth.userDetailsService(userDetailsService)
			.passwordEncoder(passwordEncoder());*/
		
		auth.authenticationProvider(this.customAuthenticationProvider);
		
	}
	
	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/resources/**");
		web.ignoring().antMatchers("/static/**");
	}
	
	@Bean
	public PasswordEncoder passwordEncoder(){		
		return new BCryptPasswordEncoder();
	}	
}
