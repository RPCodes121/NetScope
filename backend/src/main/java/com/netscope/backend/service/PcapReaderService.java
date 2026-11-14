
package com.netscope.backend.service;

import com.netscope.backend.dto.CaptureResponse;
import com.netscope.backend.parser.PacketParser;

import org.pcap4j.core.PcapHandle;
import org.pcap4j.core.Pcaps;
import org.pcap4j.packet.Packet;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class PcapReaderService {

    private final PacketParser packetParser = new PacketParser();

    public CaptureResponse analyze(Path filePath, String filename)
            throws Exception {

        long totalPackets = 0;
        long totalBytes = 0;

        Map<String, Long> protocolCounts = new HashMap<>();

        PcapHandle handle = Pcaps.openOffline(filePath.toString());

        try {

            Packet packet;

            while ((packet = handle.getNextPacket()) != null) {

                totalPackets++;

                // Captured packet length in bytes
                totalBytes += packet.length();

                String protocol =
                        packetParser.identifyProtocol(packet);

                protocolCounts.merge(protocol, 1L, Long::sum);
            }

        } finally {
            handle.close();
        }

        return new CaptureResponse(
                filename,
                totalPackets,
                totalBytes,
                protocolCounts,
                "COMPLETED"
        );
    }
}
