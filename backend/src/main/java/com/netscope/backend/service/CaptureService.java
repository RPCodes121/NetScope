
package com.netscope.backend.service;

import com.netscope.backend.dto.CaptureResponse;
import com.netscope.backend.dto.PcapAnalysisResult;
import com.netscope.backend.model.Capture;
import com.netscope.backend.model.ProtocolStatistic;
import com.netscope.backend.repository.CaptureRepository;
import com.netscope.backend.model.NetworkFlow;
import com.netscope.backend.parser.FlowAccumulator;
import com.netscope.backend.parser.FlowKey;
import com.netscope.backend.repository.NetworkFlowRepository;

import org.pcap4j.core.NotOpenException;
import org.pcap4j.core.PcapNativeException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CaptureService {

    private final PcapReaderService pcapReaderService;
    private final CaptureRepository captureRepository;
    private final NetworkFlowRepository networkFlowRepository;
    private static final long MAX_FILE_SIZE =
            100L * 1024 * 1024;

    public CaptureService(
            PcapReaderService pcapReaderService,
            CaptureRepository captureRepository
            NetworkFlowRepository networkFlowRepository
    ) {
        this.pcapReaderService = pcapReaderService;
        this.captureRepository = captureRepository;
        this.networkFlowRepository=networkFlowRepository;
    }

    public CaptureResponse processCapture(MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please upload a non-empty PCAP file."
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File exceeds the 100 MB upload limit."
            );
        }

        String originalName = file.getOriginalFilename();

        String filename = originalName == null
                ? "capture.pcap"
                : originalName.replace("\\", "/");

        filename = filename.substring(
                filename.lastIndexOf("/") + 1
        );

        String lowerName = filename.toLowerCase(Locale.ROOT);

        if (!lowerName.endsWith(".pcap")
                && !lowerName.endsWith(".pcapng")) {

            throw new IllegalArgumentException(
                    "Only .pcap and .pcapng files are supported."
            );
        }

        Path tempFile = Files.createTempFile(
                "netscope-",
                lowerName.endsWith(".pcapng") ? ".pcapng" : ".pcap"
        );

        try {

            try (InputStream input = file.getInputStream()) {
                Files.copy(
                        input,
                        tempFile,
                        StandardCopyOption.REPLACE_EXISTING
                );
            }

            // Step 1: Analyse the PCAP file
            PcapAnalysisResult result;

            try {
                result = pcapReaderService.analyze(
                        tempFile,
                        filename
                );

            } catch (PcapNativeException | NotOpenException e) {
                throw new IllegalArgumentException(
                        "Unable to parse the capture. Verify that it is a valid PCAP file.",
                        e
                );

            } catch (Exception e) {
                throw new IOException(
                        "Failed to analyse the uploaded capture.",
                        e
                );
            }

            // Step 2: Create Capture entity
            Capture capture = new Capture(
                    filename,
                    file.getSize(),
                    result.totalPackets(),
                    result.totalBytes(),
                    "COMPLETED"
            );

            // Step 3: Attach protocol statistics
            for (Map.Entry<String, Long> entry
                    : result.protocols().entrySet()) {

                ProtocolStatistic statistic =
                        new ProtocolStatistic(
                                entry.getKey(),
                                entry.getValue()
                        );

                capture.addProtocolStatistic(statistic);
            }

            // Step 4: Save capture and child statistics
            Capture savedCapture =
                    captureRepository.save(capture);
                // Step 5: Persist extracted network flows
List<NetworkFlow> networkFlows = result.flows()
        .stream()
        .map(accumulator -> {

            FlowKey key = accumulator.getKey();

            NetworkFlow flow = new NetworkFlow(
                    key.sourceIp(),
                    key.destinationIp(),
                    key.sourcePort(),
                    key.destinationPort(),
                    key.protocol(),
                    accumulator.getPacketCount(),
                    accumulator.getTotalBytes(),
                    accumulator.getFirstSeen(),
                    accumulator.getLastSeen()
            );

            flow.setCapture(savedCapture);

            return flow;
        })
        .toList();

networkFlowRepository.saveAll(networkFlows);

            // Step 5: Return API response
            return new CaptureResponse(
                    savedCapture.getId(),
                    savedCapture.getFilename(),
                    savedCapture.getFileSize(),
                    savedCapture.getTotalPackets(),
                    savedCapture.getTotalBytes(),
                    result.protocols(),
                    savedCapture.getStatus(),
                    savedCapture.getUploadedAt()
            );

        } finally {
            // Always delete temporary file
            Files.deleteIfExists(tempFile);
        }
    }

    // Retrieve all captures
   @Transactional(readOnly = true)
        public CaptureResponse getCaptureById(Long id) {

        Capture capture = captureRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Capture not found"
            ));

        Map<String, Long> protocols = capture.getProtocolStatistics()
            .stream()
            .collect(Collectors.toMap(
                    ProtocolStatistic::getProtocol,
                    ProtocolStatistic::getPacketCount
            ));

        return new CaptureResponse(
            capture.getId(),
            capture.getFilename(),
            capture.getFileSize(),
            capture.getTotalPackets(),
            capture.getTotalBytes(),
            protocols,
            capture.getStatus(),
            capture.getUploadedAt()
    );
}
}
