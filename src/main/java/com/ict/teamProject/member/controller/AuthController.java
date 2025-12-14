package com.ict.teamProject.member.controller;

import com.ict.teamProject.member.dto.LoginDto;
import com.ict.teamProject.security.util.JwtUtils;
import com.ict.teamProject.utils.ResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import kotlinx.serialization.Required;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ict.teamProject.member.service.MemberDto;
import com.ict.teamProject.member.service.RegisterService;


@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

	private final RegisterService service;
	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;

	@PostMapping("/register")
	public ResponseEntity<MemberDto> join(@RequestBody MemberDto dto){
		int affected=service.join(dto);
		System.out.println("affected="+affected);
		return ResponseEntity.ok().header("Content-Type", "application/json").body(dto);
	}

	@PostMapping("/login")
	@Operation(summary = "로그인 api")
	public ResponseEntity<?> login(@RequestBody LoginDto dto, HttpServletResponse response) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(dto.getId(), dto.getPwd())
			);

			String token = jwtUtils.generateToken(authentication);
			jwtUtils.saveTokenInCookie(token, response);

			return new ResponseEntity<>(new ResponseDto<String>(true, dto.getId(), "로그인 성공"), HttpStatus.OK);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			return new ResponseEntity<>(new ResponseDto<>(false, null, "로그인 정보가 일치하지 않습니다"), HttpStatus.UNAUTHORIZED);
		}
	}


}
