
package com.netscope.backend.service;

import com.netscope.backend.dto.PcapAnalysisResult;
import com.netscope.backend.parser.PacketParser;
import com.netscope.backend.parser.FlowKey;
import com.netscope.backend.parser.FlowAccumulator;

import org.pcap4j.core.PcapHandle;
import org.pcap4j.core.Pcaps;
import org.pcap4j.packet.Packet;

import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;

@Service
public class PcapReaderService {

    private final PacketParser packetParser = new PacketParser();

    public PcapAnalysisResult analyze(
            Path filePath,
            String filename
    ) throws Exception {

        long totalPackets = 0;
        long totalBytes = 0;

        Map<String, Long> protocolCounts = new HashMap<>();

        Map<FlowKey, FlowAccumulator> flowMap = new HashMap<>();

        PcapHandle handle = Pcaps.openOffline(filePath.toString());

        try {
            Packet packet;

            while ((packet = handle.getNextPacket()) != null) {

                totalPackets++;
                totalBytes += packet.length();

                String protocol =
                        packetParser.identifyProtocol(packet);

                protocolCounts.merge(protocol, 1L, Long::sum);

                FlowKey key = packetParser.extractFlowKey(packet);

                if (key != null) {

                    FlowAccumulator accumulator =
                            flowMap.computeIfAbsent(
                                    key,
                                    FlowAccumulator::new
                            );

                    Instant timestamp =
                            handle.getTimestamp().toInstant();

                    accumulator.addPacket(
                            packet.length(),
                            timestamp
                    );
                }
            }

        } finally {
            handle.close();
        }

        return new PcapAnalysisResult(
                filename,
                totalPackets,
                totalBytes,
                protocolCounts,
                new ArrayList<>(flowMap.values())
        );
    }
}
