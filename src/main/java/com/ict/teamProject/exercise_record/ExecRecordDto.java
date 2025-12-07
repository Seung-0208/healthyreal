package com.ict.teamProject.exercise_record;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Alias("ExecRecordDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecRecordDto {
	private String id;
	private String eName;
	private Date erDate;
}


