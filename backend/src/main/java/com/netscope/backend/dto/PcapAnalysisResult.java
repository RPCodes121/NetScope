
package com.netscope.backend.dto;

import com.netscope.backend.parser.FlowAccumulator;

import java.util.List;
import java.util.Map;

public record PcapAnalysisResult(
        String filename,
        long totalPackets,
        long totalBytes,
        Map<String, Long> protocols,
        List<FlowAccumulator> flows
) {}
