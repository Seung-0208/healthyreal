package com.ict.teamProject.diary;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ict.teamProject.diary.dto.DiaryDto;
import com.ict.teamProject.diary.dto.DiaryImagesDto;

@Service
public class ManageService {
	
	private ManageMapper mapper;
	public ManageService(ManageMapper mapper) {
		this.mapper = mapper;
	}
	
	public DiaryDto findDiaryById(String UserNDate) {
		DiaryDto dto = new DiaryDto();
		dto = mapper.findDiaryById(UserNDate);
		if(dto!=null) dto.setImgUrls(mapper.findDiaryImgUrlsByDiaryId(UserNDate));
		return dto;
	}
	
	public int uploadDiaryContentsById(DiaryDto diaryDto, List<DiaryImagesDto> imgs) {
		System.out.println("=== 서비스단 다이어리 저장 시작 ===");
		System.out.println("서비스단의 다이어리 아이디: "+diaryDto.getDiaryId());
		System.out.println("서비스단의 사용자 아이디: "+diaryDto.getId());
		System.out.println("서비스단의 다이어리 내용: "+diaryDto.getDiary_content());
		System.out.println("서비스단의 스트레스: "+diaryDto.getStress());
		System.out.println("서비스단의 감정: "+diaryDto.getEmotion());
		
		int isTextUploadSuccess = 0;
		int isImageUploadSuccess = 0;
		try {
			System.out.println("매퍼 호출 전...");
			isTextUploadSuccess = mapper.uploadDiaryById(diaryDto); //다이어리 내용 저장
			System.out.println("매퍼 호출 후 결과:"+isTextUploadSuccess);
			if(imgs.size()!=0) {
				isImageUploadSuccess = mapper.uploadDiaryImageById(imgs); //다이어리 이미지 저장
				if((isTextUploadSuccess+isImageUploadSuccess)==1) return 1;
				else return 0;
			}
			else {
				System.out.println("텍스트만 저장, 결과: " + isTextUploadSuccess);
				return isTextUploadSuccess;
			}
		} catch(Exception e) {
			System.out.println("서비스단 에러 발생: " + e.getMessage());
			e.printStackTrace();
			return 0;
		}
	}

	public DiaryDto findAllusertext(String id) {
		return mapper.findAllusertext(id);
	}
}
