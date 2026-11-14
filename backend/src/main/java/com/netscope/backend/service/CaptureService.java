
package com.netscope.backend.service;

import com.netscope.backend.dto.CaptureResponse;

import org.pcap4j.core.NotOpenException;
import org.pcap4j.core.PcapNativeException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;

@Service
public class CaptureService {

    private final PcapReaderService pcapReaderService;

    private static final long MAX_FILE_SIZE =
            100L * 1024 * 1024;

    public CaptureService(PcapReaderService pcapReaderService) {
        this.pcapReaderService = pcapReaderService;
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

        String extension = lowerName.endsWith(".pcapng")
                ? ".pcapng"
                : ".pcap";

        Path tempFile = Files.createTempFile(
                "netscope-",
                extension
        );

        try {

            try (InputStream input = file.getInputStream()) {
                Files.copy(
                        input,
                        tempFile,
                        StandardCopyOption.REPLACE_EXISTING
                );
            }

            return pcapReaderService.analyze(
                    tempFile,
                    filename
            );

        } catch (PcapNativeException | NotOpenException e) {

            throw new IllegalArgumentException(
                    "Unable to parse the capture. Verify that it is a valid PCAP file.",
                    e
            );

        } catch (IOException e) {

            throw new IOException(
                    "Failed to process the uploaded capture.",
                    e
            );

        } catch (Exception e) {

            throw new IOException(
                    "Unexpected error while analysing the capture.",
                    e
            );

        } finally {

            Files.deleteIfExists(tempFile);

        }
    }
}
