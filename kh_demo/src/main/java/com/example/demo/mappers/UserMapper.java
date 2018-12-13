package com.example.demo.mappers;


import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.example.demo.domains.Menu;
import com.example.demo.domains.Permission;
import com.example.demo.domains.Role;
import com.example.demo.domains.User;



public interface UserMapper {
	/*
	 * check user name
	 * */
	public User loadUserByUsername(@Param("username") String username);
	public List<User> loadingAllUser(User user);
	public int loadingCountAllUser(@Param("comId") int comId);
	public int insertNewUser(User user);
	public int loadingUserIdMax();
	public User loadUserByCondition(HashMap<String,String> params);
	public int editUseById(User user);
	
	public User loadUserByConditionByUserId(User user);
	
	
}
