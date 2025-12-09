package com.ict.teamProject.exercise_record.impl;

import java.util.List;

import com.ict.teamProject.member.service.MemberDto;
import com.ict.teamProject.member.service.impl.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.ict.teamProject.exercise_record.ERDto;
import com.ict.teamProject.exercise_record.ERService;
import com.ict.teamProject.exercise_record.ExecRecordDto;




@Service
@RequiredArgsConstructor
@Slf4j
public class ERServiceImpl implements ERService<ERDto> {

	//매퍼 인터페이스 주입
	private final ERMapper mapper;
	private final MemberMapper memberMapper;

	@Override
	public List getData(String id) {
		return mapper.getData(id);
	}
	
	@Override
	public List<ExecRecordDto> getTodayData(String id) {
		return mapper.getTodayData(id);
	}
	
	public ResponseEntity<String> createExecRecord(ExecRecordDto dto) {
		log.info("들어온 파라미터: {}", dto.getEName());
		if(dto.getId().isEmpty() || dto.getEName() == null || dto.getEName().isEmpty() ) {
			return new ResponseEntity<>("요청 파라미터가 올바르지 않습니다", HttpStatus.BAD_REQUEST);
		}
		MemberDto member = memberMapper.findByMemberId(dto.getId());
		if(member == null) {
			return new ResponseEntity<>("존재하지 않는 사용자 id입니다", HttpStatus.NOT_FOUND);
		}
		try {
			mapper.createRecord(dto);
			return new ResponseEntity<>("성공적으로 저장되었습니다", HttpStatus.OK);
		} catch (Exception e) {
			log.error("운동 기록 저장 중 에러 발생: {}", e.getMessage());
			return new ResponseEntity<>("저장 중 예상치 못한 에러가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
