
package com.netscope.backend.parser;

import org.pcap4j.packet.Packet;
import org.pcap4j.packet.TcpPacket;
import org.pcap4j.packet.UdpPacket;
import org.pcap4j.packet.IpV4Packet;
import org.pcap4j.packet.IpV6Packet;
import org.pcap4j.packet.IcmpV4CommonPacket;
import org.pcap4j.packet.IcmpV6CommonPacket;
import org.pcap4j.packet.ArpPacket;

public class PacketParser {

    public String identifyProtocol(Packet packet) {

        if (packet.get(TcpPacket.class) != null) {
            return "TCP";
        }

        if (packet.get(UdpPacket.class) != null) {
            return "UDP";
        }

        if (packet.get(IcmpV4CommonPacket.class) != null) {
            return "ICMP";
        }

        if (packet.get(IcmpV6CommonPacket.class) != null) {
            return "ICMPv6";
        }

        if (packet.get(ArpPacket.class) != null) {
            return "ARP";
        }

        return "OTHER";
    }

    public FlowKey extractFlowKey(Packet packet) {

        String sourceIp = null;
        String destinationIp = null;

        Integer sourcePort = null;
        Integer destinationPort = null;

        String protocol = identifyProtocol(packet);

        IpV4Packet ipv4 = packet.get(IpV4Packet.class);
        IpV6Packet ipv6 = packet.get(IpV6Packet.class);

        if (ipv4 != null) {
            sourceIp = ipv4.getHeader().getSrcAddr().getHostAddress();
            destinationIp = ipv4.getHeader().getDstAddr().getHostAddress();
        } else if (ipv6 != null) {
            sourceIp = ipv6.getHeader().getSrcAddr().getHostAddress();
            destinationIp = ipv6.getHeader().getDstAddr().getHostAddress();
        } else {
            return null;
        }

        TcpPacket tcp = packet.get(TcpPacket.class);

        if (tcp != null) {
            sourcePort = tcp.getHeader().getSrcPort().valueAsInt();
            destinationPort = tcp.getHeader().getDstPort().valueAsInt();
        }

        UdpPacket udp = packet.get(UdpPacket.class);

        if (udp != null) {
            sourcePort = udp.getHeader().getSrcPort().valueAsInt();
            destinationPort = udp.getHeader().getDstPort().valueAsInt();
        }

        return new FlowKey(
                sourceIp,
                destinationIp,
                sourcePort,
                destinationPort,
                protocol
        );
    }
}
