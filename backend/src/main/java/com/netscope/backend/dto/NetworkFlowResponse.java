
package com.netscope.backend.dto;

import java.time.Instant;

public record NetworkFlowResponse(
        Long id,
        Long captureId,
        String sourceIp,
        String destinationIp,
        Integer sourcePort,
        Integer destinationPort,
        String protocol,
        Long packetCount,
        Long totalBytes,
        Instant firstSeen,
        Instant lastSeen
) {}
