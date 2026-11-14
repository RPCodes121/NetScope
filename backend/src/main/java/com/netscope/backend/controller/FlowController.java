
package com.netscope.backend.controller;

import com.netscope.backend.dto.NetworkFlowResponse;
import com.netscope.backend.service.FlowService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/captures/{captureId}/flows")
public class FlowController {

    private final FlowService flowService;

    public FlowController(FlowService flowService) {
        this.flowService = flowService;
    }

    @GetMapping
    public ResponseEntity<List<NetworkFlowResponse>> getFlows(
            @PathVariable Long captureId) {

        return ResponseEntity.ok(
                flowService.getFlowsByCaptureId(captureId)
        );
    }

    @GetMapping("/{flowId}")
    public ResponseEntity<NetworkFlowResponse> getFlow(
            @PathVariable Long captureId,
            @PathVariable Long flowId) {

        return ResponseEntity.ok(
                flowService.getFlowById(captureId, flowId)
        );
    }
}
