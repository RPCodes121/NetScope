
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

const trafficData = [
  { time: "09:00", incoming: 120, outgoing: 80 },
  { time: "09:30", incoming: 190, outgoing: 110 },
  { time: "10:00", incoming: 150, outgoing: 130 },
  { time: "10:30", incoming: 280, outgoing: 160 },
  { time: "11:00", incoming: 220, outgoing: 140 },
  { time: "11:30", incoming: 350, outgoing: 210 },
  { time: "12:00", incoming: 290, outgoing: 180 },
  { time: "12:30", incoming: 410, outgoing: 260 },
  { time: "13:00", incoming: 330, outgoing: 200 },
];

const protocols = [
  { name: "TCP", value: 62, color: "#38bdf8" },
  { name: "UDP", value: 24, color: "#818cf8" },
  { name: "ICMP", value: 9, color: "#34d399" },
  { name: "Other", value: 5, color: "#64748b" },
];

const hosts = [
  { ip: "192.168.1.105", packets: "24,891", traffic: "18.4 MB" },
  { ip: "192.168.1.102", packets: "18,402", traffic: "12.8 MB" },
  { ip: "10.0.0.24", packets: "12,391", traffic: "9.2 MB" },
  { ip: "192.168.1.110", packets: "8,201", traffic: "6.1 MB" },
];

const captures = [
  { name: "office_network.pcap", date: "Nov 14, 2026", packets: "48,291", status: "Completed" },
  { name: "lab_traffic.pcap", date: "Nov 13, 2026", packets: "32,104", status: "Completed" },
  { name: "test_capture.pcap", date: "Nov 12, 2026", packets: "12,892", status: "Completed" },
];

function Sidebar() {
  const nav = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: FileSearch, label: "Captures" },
    { icon: Network, label: "Network Flows" },
    { icon: ShieldAlert, label: "Anomalies" },
    { icon: BarChart3, label: "Analytics" },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0c1422] min-h-screen flex flex-col shrink-0">
      <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="h-10 w-10 rounded-xl bg-sky-500/15 flex items-center justify-center">
          <Activity className="text-sky-400" size={23} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide text-white">NetScope</h1>
          <p className="text-[10px] tracking-[2px] text-slate-500">NETWORK INTELLIGENCE</p>
        </div>
      </div>

      <div className="px-4 pt-8">
        <p className="text-[10px] uppercase tracking-[2px] text-slate-500 px-3 mb-3">
          Workspace
        </p>

        {nav.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 text-sm transition ${
              active
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
          <p className="text-[11px] text-slate-500 mt-2">Offline analysis mode</p>
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white font-semibold">Traffic Volume</h3>
          <p className="text-xs text-slate-500 mt-1">Incoming vs outgoing traffic</p>
        </div>
        <span className="text-xs text-slate-400 border border-slate-700 px-3 py-2 rounded-lg">
          Sample data
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="incoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="outgoing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#243247" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#0c1422", border: "1px solid #334155", borderRadius: 8 }} />
            <Area type="monotone" dataKey="incoming" stroke="#38bdf8" fill="url(#incoming)" strokeWidth={2} />
            <Area type="monotone" dataKey="outgoing" stroke="#818cf8" fill="url(#outgoing)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6 justify-center text-xs text-slate-400 mt-2">
        <span><span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-2" />Incoming</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2" />Outgoing</span>
      </div>
    </section>
  );
}

function ProtocolChart() {
  return (
    <section className="bg-[#101b2b] border border-slate-800 rounded-xl p-5">
      <h3 className="text-white font-semibold">Protocol Distribution</h3>
      <p className="text-xs text-slate-500 mt-1">Packet breakdown by protocol</p>

      <div className="h-52 relative mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={protocols} dataKey="value" nameKey="name" innerRadius={57} outerRadius={82} paddingAngle={4}>
              {protocols.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0c1422", border: "1px solid #334155" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-white">100%</span>
          <span className="text-[10px] text-slate-500">Traffic</span>
        </div>
      </div>

      <div className="space-y-3">
        {protocols.map((protocol) => (
          <div key={protocol.name} className="flex justify-between text-xs">
            <span className="text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: protocol.color }} />
              {protocol.name}
            </span>
            <span className="text-white">{protocol.value}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TopTalkers() {
  return (
    <section className="bg-[#101b2b] border border-slate-800 rounded-xl p-5">
      <h3 className="text-white font-semibold">Top Talkers</h3>
      <p className="text-xs text-slate-500 mt-1">Most active source hosts</p>

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
                <td className="py-4 text-sky-400 font-mono text-xs">{host.ip}</td>
                <td className="py-4 text-slate-300 text-right text-xs">{host.packets}</td>
                <td className="py-4 text-white text-right text-xs">{host.traffic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RecentCaptures() {
  return (
    <section className="bg-[#101b2b] border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-white font-semibold">Recent Captures</h3>
          <p className="text-xs text-slate-500 mt-1">Previously analysed files</p>
        </div>
        <button className="text-xs text-sky-400 hover:text-sky-300">View all</button>
      </div>

      <div className="space-y-4">
        {captures.map((capture) => (
          <div key={capture.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-slate-800 rounded-lg text-sky-400">
                <Database size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white truncate">{capture.name}</p>
                <p className="text-xs text-slate-500 mt-1">{capture.date} · {capture.packets} packets</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full shrink-0">
              {capture.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Dashboard() {
  return (
    <main className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Your network traffic at a glance</p>
        </div>

        <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm px-4 py-3 rounded-lg transition">
          <Upload size={17} />
          Upload PCAP
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Packets" value="48,291" subtitle="Across selected capture" icon={Activity} color="bg-sky-500/10 text-sky-400" />
        <StatCard title="Total Traffic" value="156.8 MB" subtitle="Total processed data" icon={Database} color="bg-indigo-500/10 text-indigo-400" />
        <StatCard title="Unique Hosts" value="24" subtitle="Source and destination IPs" icon={Globe} color="bg-emerald-500/10 text-emerald-400" />
        <StatCard title="Active Flows" value="1,284" subtitle="Unique conversations" icon={Network} color="bg-amber-500/10 text-amber-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <TrafficChart />
        </div>
        <ProtocolChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TopTalkers />
        <RecentCaptures />
      </div>

      <footer className="text-center text-[11px] text-slate-600 pt-4 pb-2">
        NetScope · Network Traffic Analytics Platform · Offline Analysis Mode
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#090e18] flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 min-w-0">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}
