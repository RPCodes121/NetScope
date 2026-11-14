
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

    public Long getId() {
        return id;
    }
}
