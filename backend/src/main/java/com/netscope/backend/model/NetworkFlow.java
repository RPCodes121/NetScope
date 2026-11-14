
package com.netscope.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "network_flows")
public class NetworkFlow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capture_id", nullable = false)
    private Capture capture;

    @Column(nullable = false)
    private String sourceIp;

    @Column(nullable = false)
    private String destinationIp;

    private Integer sourcePort;

    private Integer destinationPort;

    @Column(nullable = false)
    private String protocol;

    @Column(nullable = false)
    private Long packetCount;

    @Column(nullable = false)
    private Long totalBytes;

    private Instant firstSeen;

    private Instant lastSeen;

    protected NetworkFlow() {}

    public NetworkFlow(
            String sourceIp,
            String destinationIp,
            Integer sourcePort,
            Integer destinationPort,
            String protocol,
            Long packetCount,
            Long totalBytes,
            Instant firstSeen,
            Instant lastSeen
    ) {
        this.sourceIp = sourceIp;
        this.destinationIp = destinationIp;
        this.sourcePort = sourcePort;
        this.destinationPort = destinationPort;
        this.protocol = protocol;
        this.packetCount = packetCount;
        this.totalBytes = totalBytes;
        this.firstSeen = firstSeen;
        this.lastSeen = lastSeen;
    }

    public void setCapture(Capture capture) {
        this.capture = capture;
    }

    public Capture getCapture(){
        return capture;
    }

    public Long getId() {
        return id;
    }

    public String getSourceIp() {
        return sourceIp;
    }

    public String getDestinationIp() {
        return destinationIp;
    }

    public Integer getSourcePort() {
        return sourcePort;
    }

    public Integer getDestinationPort() {
        return destinationPort;
    }

    public String getProtocol() {
        return protocol;
    }

    public Long getPacketCount() {
        return packetCount;
    }

    public Long getTotalBytes() {
        return totalBytes;
    }

    public Instant getFirstSeen() {
        return firstSeen;
    }

    public Instant getLastSeen() {
        return lastSeen;
    }
}
