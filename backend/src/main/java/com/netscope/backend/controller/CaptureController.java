
package com.netscope.backend.controller;

import com.netscope.backend.dto.CaptureResponse;
import com.netscope.backend.service.CaptureService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/captures")
public class CaptureController {

    private final CaptureService captureService;

    public CaptureController(CaptureService captureService) {
        this.captureService = captureService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CaptureResponse> uploadCapture(
            @RequestParam("file") MultipartFile file) throws Exception {

        CaptureResponse response =
                captureService.processCapture(file);

        return ResponseEntity.ok(response);
    }
}
