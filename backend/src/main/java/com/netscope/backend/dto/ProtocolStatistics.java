package com.netscope.backend.dto;

public record ProtocolStatistics(
        String protocol,
        Long packetCount
) {
}