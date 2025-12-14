package com.ict.teamProject.security.jwt;

import com.ict.teamProject.member.service.MemberDto;
import com.ict.teamProject.member.service.impl.MemberMapper;
import com.ict.teamProject.security.util.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
// 유효한 토큰인지 증명
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final MemberMapper memberMapper;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        log.info("path 값: {}", path);
        log.info("AuthManager.authenticate() 호출됨 — {}", new Throwable().getStackTrace()[1]);


        // ✅ 인증 제외할 엔드포인트
        if (path.startsWith("/api/login") ||
                path.startsWith("/api/signup") ||
                path.startsWith("/api/public") ||
                path.startsWith("/error") ||
                path.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = jwtUtils.parseBearerToken(request);
            if (token != null) {
                String memberId = jwtUtils.validate(token);
                if (memberId != null) {
                    MemberDto member = memberMapper.findByMemberId(memberId);
                    if (member != null) {
                        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                        AbstractAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(memberId, null, authorities);
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        if (SecurityContextHolder.getContext().getAuthentication() == null) {
                            // 새로 세팅
                            SecurityContext context = SecurityContextHolder.createEmptyContext();
                            context.setAuthentication(authenticationToken);
                            SecurityContextHolder.setContext(context);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("JWT 필터 오류: {}", e.getMessage());
        }

        // ✅ 반드시 한 번만 호출
        filterChain.doFilter(request, response);
    }

}
