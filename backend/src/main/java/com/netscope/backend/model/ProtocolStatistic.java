
package com.netscope.backend.model;


import jakarta.persistence.*;

@Entity
@Table(
    name = "protocol_statistics",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"capture_id", "protocol"}
        )
    }
)
public class ProtocolStatistic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "capture_id", nullable = false)
    private Capture capture;

    @Column(nullable = false)
    private String protocol;

    @Column(nullable = false)
    private Long packetCount;

    protected ProtocolStatistic() {}

    public ProtocolStatistic(String protocol, Long packetCount) {
        this.protocol = protocol;
        this.packetCount = packetCount;
    }

    public void setCapture(Capture capture) {
        this.capture = capture;
    }

    public Long getId() {
        return id;
    }

    public String getProtocol() {
        return protocol;
    }

    public Long getPacketCount() {
        return packetCount;
    }
}
