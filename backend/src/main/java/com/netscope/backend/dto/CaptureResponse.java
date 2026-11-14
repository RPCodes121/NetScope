
package com.netscope.backend.dto;

import java.util.Map;

public record CaptureResponse(
        String filename,
        long totalPackets,
        long totalBytes,
        Map<String, Long> protocols,
        String status
) {}
