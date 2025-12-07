package com.ict.teamProject.exercise_record;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ict.teamProject.exercise_record.impl.ERMapper;
import com.ict.teamProject.exercise_record.impl.ERServiceImpl;

@ExtendWith(MockitoExtension.class)
@DisplayName("운동 기록 서비스 테스트")
class ERServiceTest {

    @Mock
    private ERMapper erMapper;

    @InjectMocks
    private ERServiceImpl erService;

    private List<ExecRecordDto> mockExecRecordList;
    private ExecRecordDto mockExecRecord1;
    private ExecRecordDto mockExecRecord2;

    @BeforeEach
    void setUp() {
        mockExecRecordList = new ArrayList<>();
        
        mockExecRecord1 = ExecRecordDto.builder()
                .id("testUser1")
                .eName("Push-up")
                .erDate(new Date())
                .build();
        
        mockExecRecord2 = ExecRecordDto.builder()
                .id("testUser1")
                .eName("Squat")
                .erDate(new Date())
                .build();
        
        mockExecRecordList.add(mockExecRecord1);
        mockExecRecordList.add(mockExecRecord2);
    }

    @Test
    @DisplayName("오늘 운동 기록 조회 - 성공")
    void testGetTodayData_Success() {
        // Given
        String userId = "testUser1";
        when(erMapper.getTodayData(userId)).thenReturn(mockExecRecordList);

        // When
        List<ExecRecordDto> result = erService.getTodayData(userId);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("testUser1", result.get(0).getId());
        assertEquals("Push-up", result.get(0).getEName());
        assertEquals("Squat", result.get(1).getEName());
        verify(erMapper).getTodayData(userId);
    }

    @Test
    @DisplayName("오늘 운동 기록 조회 - 빈 결과")
    void testGetTodayData_EmptyResult() {
        // Given
        String userId = "testUser2";
        when(erMapper.getTodayData(userId)).thenReturn(new ArrayList<>());

        // When
        List<ExecRecordDto> result = erService.getTodayData(userId);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(erMapper).getTodayData(userId);
    }

    @Test
    @DisplayName("오늘 운동 기록 조회 - 단일 결과")
    void testGetTodayData_SingleResult() {
        // Given
        String userId = "testUser3";
        List<ExecRecordDto> singleList = new ArrayList<>();
        singleList.add(mockExecRecord1);
        when(erMapper.getTodayData(userId)).thenReturn(singleList);

        // When
        List<ExecRecordDto> result = erService.getTodayData(userId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("testUser1", result.get(0).getId());
        assertEquals("Push-up", result.get(0).getEName());
        verify(erMapper).getTodayData(userId);
    }

    @Test
    @DisplayName("오늘 운동 기록 조회 - null id 처리")
    void testGetTodayData_NullId() {
        // Given
        when(erMapper.getTodayData(null)).thenReturn(new ArrayList<>());

        // When
        List<ExecRecordDto> result = erService.getTodayData(null);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(erMapper).getTodayData(null);
    }
}

