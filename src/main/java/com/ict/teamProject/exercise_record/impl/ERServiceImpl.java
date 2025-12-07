package com.ict.teamProject.exercise_record.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ict.teamProject.exercise_record.ERDto;
import com.ict.teamProject.exercise_record.ERService;
import com.ict.teamProject.exercise_record.ExecRecordDto;




@Service
public class ERServiceImpl implements ERService<ERDto> {

	//매퍼 인터페이스 주입
	@Autowired
	private ERMapper mapper;

	@Override
	public List getData(String id) {
		return mapper.getData(id);
	}
	
	@Override
	public List<ExecRecordDto> getTodayData(String id) {
		return mapper.getTodayData(id);
	}
	

}
