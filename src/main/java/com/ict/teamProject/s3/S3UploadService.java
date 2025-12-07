package com.ict.teamProject.s3;

import java.io.IOException;
import java.io.InputStream;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.utils.IoUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3UploadService {

    private final S3AsyncClient amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String saveFile(MultipartFile multipartFile) throws IOException {

        try {
            String key = "image/" + multipartFile.getOriginalFilename();
            String contentType = multipartFile.getContentType();
            InputStream targetIS = multipartFile.getInputStream();
            byte[] bytes = IoUtils.toByteArray(targetIS);
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentDisposition(contentType)
                    .build();
            PutObjectResponse resp = amazonS3.putObject(putObjectRequest, AsyncRequestBody.fromBytes(bytes)).get();
            return getPublicUrl(key);
        } catch (Exception e) {
            log.error("파일등록실패: {}", e.getMessage());
            return null;
        }
    }

    private String getPublicUrl(String filename) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, "ap-northeast-2", filename);
    }
}
