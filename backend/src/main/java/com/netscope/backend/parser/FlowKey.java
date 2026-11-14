
package com.netscope.backend.parser;

public record FlowKey(
        String sourceIp,
        String destinationIp,
        Integer sourcePort,
        Integer destinationPort,
        String protocol
) {}
