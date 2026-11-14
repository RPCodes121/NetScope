
package com.netscope.backend.parser;

import java.time.Instant;

public class FlowAccumulator {

    private final FlowKey key;

    private long packetCount;
    private long totalBytes;

    private Instant firstSeen;
    private Instant lastSeen;

    public FlowAccumulator(FlowKey key) {
        this.key = key;
    }

    public void addPacket(long packetBytes, Instant timestamp) {

        packetCount++;
        totalBytes += packetBytes;

        if (timestamp != null) {
            if (firstSeen == null || timestamp.isBefore(firstSeen)) {
                firstSeen = timestamp;
            }

            if (lastSeen == null || timestamp.isAfter(lastSeen)) {
                lastSeen = timestamp;
            }
        }
    }

    public FlowKey getKey() {
        return key;
    }

    public long getPacketCount() {
        return packetCount;
    }

    public long getTotalBytes() {
        return totalBytes;
    }

    public Instant getFirstSeen() {
        return firstSeen;
    }

    public Instant getLastSeen() {
        return lastSeen;
    }
}
