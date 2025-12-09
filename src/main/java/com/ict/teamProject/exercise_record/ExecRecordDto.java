package com.ict.teamProject.exercise_record;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.apache.ibatis.type.Alias;


@Data
@Alias("ExecRecordDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecRecordDto {
	private String id;
	@JsonProperty("eName")
	private String eName;
	private Date erDate;
}


