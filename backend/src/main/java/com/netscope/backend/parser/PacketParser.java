
package com.netscope.backend.parser;

import org.pcap4j.packet.Packet;
import org.pcap4j.packet.TcpPacket;
import org.pcap4j.packet.UdpPacket;
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
}
