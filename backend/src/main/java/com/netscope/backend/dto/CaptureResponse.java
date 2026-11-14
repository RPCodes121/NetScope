
package com.netscope.backend.dto;

import java.time.Instant;
import java.util.Map;

public record CaptureResponse(
        Long captureId,
        String filename,
        long fileSize,
        long totalPackets,
        long totalBytes,
        Map<String, Long> protocols,
        String status,
        Instant uploadedAt
) {}
