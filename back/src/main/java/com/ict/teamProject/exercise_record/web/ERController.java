package com.ict.teamProject.exercise_record.web;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ict.teamProject.exercise_record.impl.ERServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.ict.teamProject.exercise_record.ERDto;
import com.ict.teamProject.exercise_record.ERService;
import com.ict.teamProject.exercise_record.ExecRecordDto;





@Controller
@RequestMapping(value = "/exer", produces = "application/json; charset = utf-8")
@RestController
@RequiredArgsConstructor
public class ERController {
	
	//서비스 주입
	private final ERServiceImpl service;
	
	@PostMapping("/getData.do")
	@ResponseBody
	public List getData(@RequestBody Map map) {
		System.out.println("운동 아이디는?"+ map.get("id").toString());
		String id = map.get("id").toString();
		ERDto dto = new ERDto();
		List<ERDto> re = new ArrayList<ERDto>();
		re = service.getData(id);
		for(ERDto p : re) {
			System.out.println("운동 데이터"+p.getEName());
			System.out.println("운동 데이터"+p.getId());
			System.out.println("운동 데이터"+p.getEType());

		}
		System.out.println("운동 데이터"+re);
		return re;
	}
	
	@GetMapping("/get-today-data") //test
	@ResponseBody
	public List<ExecRecordDto> getTodayData(@RequestParam String id) {
		System.out.println("오늘 운동 기록 조회 - 사용자 ID: " + id);
		List<ExecRecordDto> result = service.getTodayData(id);
		System.out.println("조회된 운동 기록 수: " + result.size());
		return result;
	}

	@PostMapping("/create-exec-data")
	@ResponseBody
	public ResponseEntity<String> createExecRecord(@RequestBody ExecRecordDto dto) {
		return service.createExecRecord(dto);
	}
}
