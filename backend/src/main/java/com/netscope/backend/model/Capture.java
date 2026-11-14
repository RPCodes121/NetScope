
package com.netscope.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "captures")
public class Capture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false)
    private Long totalPackets;

    @Column(nullable = false)
    private Long totalBytes;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Instant uploadedAt;

    @OneToMany(
        mappedBy = "capture",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<ProtocolStatistic> protocolStatistics =
            new ArrayList<>();

    protected Capture() {}

    public Capture(
            String filename,
            Long fileSize,
            Long totalPackets,
            Long totalBytes,
            String status
    ) {
        this.filename = filename;
        this.fileSize = fileSize;
        this.totalPackets = totalPackets;
        this.totalBytes = totalBytes;
        this.status = status;
        this.uploadedAt = Instant.now();
    }

    public void addProtocolStatistic(ProtocolStatistic statistic) {
        protocolStatistics.add(statistic);
        statistic.setCapture(this);
    }

    public Long getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public Long getTotalPackets() {
        return totalPackets;
    }

    public Long getTotalBytes() {
        return totalBytes;
    }

    public String getStatus() {
        return status;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public List<ProtocolStatistic> getProtocolStatistics() {
        return protocolStatistics;
    }
}
