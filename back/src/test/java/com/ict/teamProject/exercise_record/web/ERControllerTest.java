package com.ict.teamProject.exercise_record.web;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.ict.teamProject.exercise_record.ERService;
import com.ict.teamProject.exercise_record.ERDto;
import com.ict.teamProject.exercise_record.ExecRecordDto;

@WebMvcTest(ERController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("운동 기록 컨트롤러 테스트")
class ERControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ERService<ERDto> erService;

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
    void testGetTodayData_Success() throws Exception {
        // Given
        String userId = "testUser1";
        when(erService.getTodayData(userId)).thenReturn(mockExecRecordList);

        // When & Then
        mockMvc.perform(get("/exer/get-today-data")
                .param("id", userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("testUser1"))
                .andExpect(jsonPath("$[0].ename").value("Push-up"))
                .andExpect(jsonPath("$[1].id").value("testUser1"))
                .andExpect(jsonPath("$[1].ename").value("Squat"));
    }

    @Test
    @DisplayName("오늘 운동 기록 조회 - 빈 결과")
    void testGetTodayData_EmptyResult() throws Exception {
        // Given
        String userId = "testUser2";
        when(erService.getTodayData(userId)).thenReturn(new ArrayList<>());

        // When & Then
        mockMvc.perform(get("/exer/get-today-data")
                .param("id", userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("오늘 운동 기록 조회 - id 파라미터 누락")
    void testGetTodayData_MissingIdParameter() throws Exception {
        // When & Then
        mockMvc.perform(get("/exer/get-today-data")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("오늘 운동 기록 조회 - null id 파라미터")
    void testGetTodayData_NullIdParameter() throws Exception {
        // Given
        when(erService.getTodayData(null)).thenReturn(new ArrayList<>());

        // When & Then
        mockMvc.perform(get("/exer/get-today-data")
                .param("id", "")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}

