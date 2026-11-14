
package com.netscope.backend.service;

import com.netscope.backend.dto.NetworkFlowResponse;
import com.netscope.backend.model.NetworkFlow;
import com.netscope.backend.repository.NetworkFlowRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FlowService {

    private final NetworkFlowRepository networkFlowRepository;

    public FlowService(NetworkFlowRepository networkFlowRepository) {
        this.networkFlowRepository = networkFlowRepository;
    }

    @Transactional(readOnly = true)
    public List<NetworkFlowResponse> getFlowsByCaptureId(Long captureId) {

        return networkFlowRepository.findByCaptureId(captureId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public NetworkFlowResponse getFlowById(Long captureId, Long flowId) {

        NetworkFlow flow = networkFlowRepository.findById(flowId)
                .filter(f -> f.getCapture().getId().equals(captureId))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Flow not found"
                ));

        return toResponse(flow);
    }

    private NetworkFlowResponse toResponse(NetworkFlow flow) {

        return new NetworkFlowResponse(
                flow.getId(),
                flow.getCapture().getId(),
                flow.getSourceIp(),
                flow.getDestinationIp(),
                flow.getSourcePort(),
                flow.getDestinationPort(),
                flow.getProtocol(),
                flow.getPacketCount(),
                flow.getTotalBytes(),
                flow.getFirstSeen(),
                flow.getLastSeen()
        );
    }
}
