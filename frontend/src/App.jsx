
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Bell,
  ChevronDown,
  CircleDot,
  Clock3,
  Database,
  FileSearch,
  Gauge,
  Globe,
  LayoutDashboard,
  Network,
  Search,
  Settings,
  ShieldAlert,
  Upload,
  Wifi
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCaptures,
  getFlows,
  uploadCapture,
} from "./services/api";

const COLORS = {
  TCP: "#38bdf8",
  UDP: "#818cf8",
  ICMP: "#34d399",
  ICMPv6: "#fbbf24",
  ARP: "#fb923c",
  OTHER: "#64748b",
};

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function formatNumber(value = 0) {
  return Number(value).toLocaleString("en-IN");
}

function formatDate(date) {
  return date
    ? new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Unknown date";
}

function Sidebar({ activePage, onNavigate }) {
  const nav = [
    { icon: LayoutDashboard, label: "Overview", id: "overview" },
    { icon: FileSearch, label: "Captures", id: "captures" },
    { icon: Network, label: "Network Flows", id: "flows" },
    { icon: ShieldAlert, label: "Anomalies", id: "anomalies" },
    { icon: BarChart3, label: "Analytics", id: "analytics" },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0c1422] min-h-screen flex flex-col shrink-0">
      <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="h-10 w-10 rounded-xl bg-sky-500/15 flex items-center justify-center">
          <Activity className="text-sky-400" size={23} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide text-white">NetScope</h1>
          <p className="text-[10px] tracking-[2px] text-slate-500">
            NETWORK INTELLIGENCE
          </p>
        </div>
      </div>

      <div className="px-4 pt-8">
        <p className="text-[10px] uppercase tracking-[2px] text-slate-500 px-3 mb-3">
          Workspace
        </p>

        {nav.map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 text-sm transition ${
              activePage === id
                ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-3 py-3 text-sm text-slate-400 hover:text-white">
          <Settings size={18} />
          Settings
        </button>

        <div className="mt-3 p-3 rounded-xl bg-slate-800/60">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CircleDot size={10} />
            System ready
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Offline analysis mode
          </p>
        </div>
      </div>
    </aside>
  );
}
function Header() {
  return (
    <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-white font-semibold text-lg">Network Overview</h2>
        <p className="text-xs text-slate-500 mt-1">Monitor and analyse network traffic</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Offline mode
        </div>

        <button className="text-slate-400 hover:text-white relative">
          <Bell size={19} />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-5">
          <div className="w-9 h-9 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-semibold text-sm">
            NS
          </div>
          <ChevronDown size={15} className="text-slate-500" />
        </div>
      </div>
    </header>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-[#101b2b] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
      <div className="flex justify-between items-start">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-white mt-4">{value}</h3>
      <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
}

function TrafficChart() {
  return (
    <section className="bg-[#101b2b] border border-slate-800 rounded-xl p-5">
      <div className="mb-6">
        <h3 className="text-white font-semibold">Traffic Volume</h3>
        <p className="text-xs text-slate-500 mt-1">
          Incoming vs outgoing traffic
        </p>
      </div>

      <div className="h-64 flex flex-col items-center justify-center text-center">
        <Gauge size={32} className="text-slate-600 mb-3" />
        <p className="text-sm text-slate-400">
          Time-series analysis coming next
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Packet timestamps need to be aggregated into time intervals.
        </p>
      </div>
    </section>
  );
}

function ProtocolChart({ protocols = {} }) {
  const total = Object.values(protocols).reduce(
    (sum, count) => sum + count,
    0
  );

  const data = Object.entries(protocols).map(([name, value]) => ({
    name,
    value,
    color: COLORS[name] || COLORS.OTHER,
  }));

  return (
    <section className="bg-[#101b2b] border border-slate-800 rounded-xl p-5">
      <h3 className="text-white font-semibold">Protocol Distribution</h3>
      <p className="text-xs text-slate-500 mt-1">
        Packet breakdown by protocol
      </p>

      {total === 0 ? (
        <p className="text-sm text-slate-500 py-16 text-center">
          No protocol data available
        </p>
      ) : (
        <>
          <div className="h-52 relative mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={57}
                  outerRadius={82}
                  paddingAngle={4}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">
                100%
              </span>
              <span className="text-[10px] text-slate-500">Packets</span>
            </div>
          </div>

          <div className="space-y-3">
            {data.map((protocol) => (
              <div key={protocol.name} className="flex justify-between text-xs">
                <span className="text-slate-400">
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ background: protocol.color }}
                  />
                  {protocol.name}
                </span>
                <span className="text-white">
                  {formatNumber(protocol.value)} (
                  {((protocol.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function TopTalkers({ flows = [] }) {
  const hosts = useMemo(() => {
    const grouped = {};

    flows.forEach((flow) => {
      const ip = flow.sourceIp;

      if (!ip) return;

      if (!grouped[ip]) {
        grouped[ip] = {
          ip,
          packets: 0,
          traffic: 0,
        };
      }

      grouped[ip].packets += flow.packetCount || 0;
      grouped[ip].traffic += flow.totalBytes || 0;
    });

    return Object.values(grouped)
      .sort((a, b) => b.traffic - a.traffic)
      .slice(0, 5);
  }, [flows]);

  return (
    <section className="bg-[#101b2b] border border-slate-800 rounded-xl p-5">
      <h3 className="text-white font-semibold">Top Talkers</h3>
      <p className="text-xs text-slate-500 mt-1">
        Most active source hosts
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-[11px] text-slate-500 border-b border-slate-800">
              <th className="pb-3 font-medium">IP Address</th>
              <th className="pb-3 font-medium text-right">Packets</th>
              <th className="pb-3 font-medium text-right">Traffic</th>
            </tr>
          </thead>

          <tbody>
            {hosts.map((host) => (
              <tr key={host.ip} className="border-b border-slate-800/60 last:border-0">
                <td className="py-4 text-sky-400 font-mono text-xs">
                  {host.ip}
                </td>
                <td className="py-4 text-slate-300 text-right text-xs">
                  {formatNumber(host.packets)}
                </td>
                <td className="py-4 text-white text-right text-xs">
                  {formatBytes(host.traffic)}
                </td>
              </tr>
            ))}

            {hosts.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-slate-500 py-8">
                  No flow data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function RecentCaptures({ captures = [], selectedId, onSelect }) {
  return (
    <section className="bg-[#101b2b] border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-white font-semibold">Recent Captures</h3>
          <p className="text-xs text-slate-500 mt-1">
            Previously analysed files
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {captures.slice(0, 5).map((capture) => (
          <button
            key={capture.captureId}
            onClick={() => onSelect(capture.captureId)}
            className={`w-full flex items-center justify-between gap-3 text-left rounded-lg p-2 transition ${
              selectedId === capture.captureId
                ? "bg-sky-500/10"
                : "hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-slate-800 rounded-lg text-sky-400">
                <Database size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-white truncate">
                  {capture.filename}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatDate(capture.uploadedAt)} ·{" "}
                  {formatNumber(capture.totalPackets)} packets
                </p>
              </div>
            </div>

            <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full shrink-0">
              {capture.status}
            </span>
          </button>
        ))}

        {captures.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">
            No captures uploaded yet
          </p>
        )}
      </div>
    </section>
  );
}

function Dashboard({
  captures,
  selectedCapture,
  flows,
  onSelectCapture,
  onUpload,
  uploading,
  error,
}) {
  const uniqueHosts = useMemo(() => {
    const hosts = new Set();

    flows.forEach((flow) => {
      if (flow.sourceIp) hosts.add(flow.sourceIp);
      if (flow.destinationIp) hosts.add(flow.destinationIp);
    });

    return hosts.size;
  }, [flows]);

  return (
    <main className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Overview</h2>
          <p className="text-sm text-slate-500 mt-1">
            Your network traffic at a glance
          </p>
        </div>

        <label className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm px-4 py-3 rounded-lg transition cursor-pointer">
          <Upload size={17} />
          {uploading ? "Uploading..." : "Upload PCAP"}
          <input
            type="file"
            accept=".pcap,.pcapng"
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-slate-500">Selected capture:</span>
        <select
          value={selectedCapture?.captureId || ""}
          onChange={(event) => onSelectCapture(Number(event.target.value))}
          className="bg-[#101b2b] border border-slate-700 text-white text-sm rounded-lg px-3 py-2"
        >
          {captures.length === 0 && <option value="">No captures</option>}
          {captures.map((capture) => (
            <option key={capture.captureId} value={capture.captureId}>
              {capture.filename}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Packets"
          value={formatNumber(selectedCapture?.totalPackets || 0)}
          subtitle="Across selected capture"
          icon={Activity}
          color="bg-sky-500/10 text-sky-400"
        />

        <StatCard
          title="Total Traffic"
          value={formatBytes(selectedCapture?.totalBytes || 0)}
          subtitle="Total processed data"
          icon={Database}
          color="bg-indigo-500/10 text-indigo-400"
        />

        <StatCard
          title="Unique Hosts"
          value={formatNumber(uniqueHosts)}
          subtitle="Source and destination IPs"
          icon={Globe}
          color="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Active Flows"
          value={formatNumber(flows.length)}
          subtitle="Unique conversations"
          icon={Network}
          color="bg-amber-500/10 text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <TrafficChart />
        </div>
        <ProtocolChart protocols={selectedCapture?.protocols || {}} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TopTalkers flows={flows} />
        <RecentCaptures
          captures={captures}
          selectedId={selectedCapture?.captureId}
          onSelect={onSelectCapture}
        />
      </div>

      <footer className="text-center text-[11px] text-slate-600 pt-4 pb-2">
        NetScope · Network Traffic Analytics Platform · Offline Analysis Mode
      </footer>
    </main>
  );
}

export default function App() {
   const [activePage, setActivePage] = useState("overview");

  const [captures, setCaptures] = useState([]);
  const [selectedCaptureId, setSelectedCaptureId] = useState(null);
  const [flows, setFlows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedCapture = captures.find(
    (capture) => capture.captureId === selectedCaptureId
  );

  // Fetch captures when the dashboard loads.
  useEffect(() => {
    async function loadCaptures() {
      try {
        const data = await getCaptures();
        setCaptures(data);

        if (data.length > 0) {
          setSelectedCaptureId(data[0].captureId);
        }
      } catch (err) {
        setError(
          err.response?.data?.error || "Could not load captures from the backend."
        );
      }
    }

    loadCaptures();
  }, []);

  // Fetch flows whenever the selected capture changes.
  useEffect(() => {
    if (!selectedCaptureId) {
      setFlows([]);
      return;
    }
  

    async function loadFlows() {
      try {
        const data = await getFlows(selectedCaptureId);
        setFlows(data);
      } catch (err) {
        setFlows([]);
        setError(
          err.response?.data?.error || "Could not load network flows."
        );
      }
    }

    loadFlows();
  }, [selectedCaptureId]);

  // Upload a PCAP and refresh the capture list.
  async function handleUpload(file) {
    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadCapture(file);

      const updatedCaptures = await getCaptures();
      setCaptures(updatedCaptures);
      setSelectedCaptureId(uploaded.captureId);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Upload failed. Check the backend logs."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090e18] flex">
      <div className="hidden lg:block">
        <Sidebar
  activePage={activePage}
  onNavigate={setActivePage}
      />
      </div>

      <div className="flex-1 min-w-0">
        <Header />

        {activePage === "overview" && (
  <Dashboard
    captures={captures}
    selectedCapture={selectedCapture}
    flows={flows}
    onSelectCapture={setSelectedCaptureId}
    onUpload={handleUpload}
    uploading={uploading}
    error={error}
  />
)}

{activePage === "captures" && (
  <main className="p-8">
    <h2 className="text-2xl font-semibold text-white mb-6">Captures</h2>
    <RecentCaptures
      captures={captures}
      selectedId={selectedCaptureId}
      onSelect={setSelectedCaptureId}
    />
  </main>
)}

{activePage === "flows" && (
  <main className="p-8">
    <h2 className="text-2xl font-semibold text-white">Network Flows</h2>
    <p className="text-sm text-slate-500 mt-2">
      {flows.length} flows in the selected capture.
    </p>
  </main>
)}

{activePage === "anomalies" && (
  <main className="p-8">
    <h2 className="text-2xl font-semibold text-white">Anomalies</h2>
    <p className="text-sm text-slate-500 mt-2">
      Anomaly detection module is not implemented yet.
    </p>
  </main>
)}

{activePage === "analytics" && (
  <main className="p-8">
    <h2 className="text-2xl font-semibold text-white">Analytics</h2>
    <p className="text-sm text-slate-500 mt-2">
      Advanced traffic analytics coming next.
    </p>
  </main>
)}
      </div>
    </div>
  );
}
