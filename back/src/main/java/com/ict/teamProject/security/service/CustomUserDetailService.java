package com.ict.teamProject.security.service;

import com.ict.teamProject.member.service.MemberDto;
import com.ict.teamProject.member.service.impl.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailService implements UserDetailsService {
    private final MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        log.info("들어온 사용자 아이디: {}", userId);
        MemberDto member = memberMapper.findByMemberId(userId);
        if(member==null) {
            throw new UsernameNotFoundException("아이디가 존재하지 않습니다");
        }

        SimpleGrantedAuthority memberRole = new SimpleGrantedAuthority("ROLE_USER");
        Collection<GrantedAuthority> roles = new HashSet<>();
        roles.add(memberRole);
        log.info("비밀번호: {}", member.getPwd());
        log.info("역할: {}", roles.stream().toList());
        return new User(member.getId(), member.getPwd(), roles);
    }
}
