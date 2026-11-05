"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  RotateCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Home,
  BookOpen,
  Info,
  LogIn,
  Shield,
  Wifi,
  Battery,
  Signal,
  Share2,
} from "lucide-react";

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  label: string;
}

const SAMSUNG_DEVICES: DevicePreset[] = [
  { name: "Galaxy S24 / S23", width: 384, height: 854, label: "384 × 854 (Standard)" },
  { name: "Galaxy S24 Ultra", width: 412, height: 915, label: "412 × 915 (Large)" },
  { name: "Galaxy S20 / S21", width: 360, height: 800, label: "360 × 800 (Compact)" },
  { name: "Galaxy Z Fold (Cover)", width: 344, height: 882, label: "344 × 882 (Narrow)" },
];

export default function SamsungPreviewPage() {
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(SAMSUNG_DEVICES[0]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [iframeKey, setIframeKey] = useState(0);

  const activeWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const activeHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  const quickLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Notes Library", path: "/library", icon: BookOpen },
    { name: "About DCC", path: "/about", icon: Info },
    { name: "Student Login", path: "/login", icon: LogIn },
    { name: "Admin Portal", path: "/admin/login", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col py-6 px-4">
      {/* Top Controller Bar */}
      <div className="max-w-6xl mx-auto w-full mb-6 bg-slate-800/90 border border-slate-700 p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-amber-400 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Samsung Galaxy Responsive Simulator
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                One UI
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive test viewport for Samsung Galaxy devices & One UI browser
            </p>
          </div>
        </div>

        {/* Device & Orientation Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
            {SAMSUNG_DEVICES.map((d) => (
              <button
                key={d.name}
                onClick={() => setSelectedDevice(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDevice.name === d.name
                    ? "bg-emerald-700 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white transition-colors"
            title="Toggle orientation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            {isLandscape ? "Landscape" : "Portrait"}
          </button>

          <button
            onClick={() => setIframeKey((prev) => prev + 1)}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors"
            title="Reload frame"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href="https://sanction-mummy-paragraph.ngrok-free.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all"
          >
            <span>Open on Real Phone</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Quick Nav Bar */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-400 mr-2 font-medium">Quick Pages:</span>
        {quickLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.path;
          return (
            <button
              key={link.path}
              onClick={() => setCurrentPath(link.path)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {link.name}
            </button>
          );
        })}
      </div>

      {/* Samsung Galaxy Device Mockup Container */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4">
        <div
          className="relative transition-all duration-300 flex flex-col shadow-2xl"
          style={{
            width: `${activeWidth + 24}px`,
            maxWidth: "100%",
          }}
        >
          {/* Samsung Galaxy Outer Chassis (Polished Aluminum Frame) */}
          <div className="relative bg-[#1c1d21] p-3 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_2px_#3a3c42,0_0_0_5px_#101114]">
            {/* Side Volume and Power Buttons */}
            <div className="absolute -right-1.5 top-24 w-1.5 h-16 bg-[#3a3c42] rounded-r-md"></div>
            <div className="absolute -right-1.5 top-44 w-1.5 h-10 bg-[#3a3c42] rounded-r-md"></div>

            {/* Inner Screen Bezel */}
            <div className="relative bg-black rounded-[36px] overflow-hidden border border-slate-800 flex flex-col">
              {/* Samsung Status Bar with Infinity-O Punch Hole */}
              <div className="h-8 bg-[#06180e] text-white px-5 flex items-center justify-between text-[11px] font-semibold select-none z-20 shrink-0">
                {/* Time */}
                <span className="font-mono">09:41</span>

                {/* Centered Samsung Punch-Hole Camera */}
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a1f14]"></div>
                </div>

                {/* System Icons (5G, WiFi, Battery) */}
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Signal className="w-3 h-3" />
                  <span className="text-[10px] font-bold">5G</span>
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5 fill-current text-emerald-400" />
                </div>
              </div>

              {/* Samsung Internet Browser URL bar */}
              <div className="bg-[#0b291a] border-b border-[#144229] px-3 py-1.5 flex items-center gap-2 z-20 shrink-0">
                <div className="flex-1 bg-[#06180e] rounded-full px-3 py-1 flex items-center justify-between text-xs text-slate-300 border border-[#144229]">
                  <span className="text-[11px] font-mono text-emerald-300 truncate">
                    https://dcc-tinsukia.gov.in{currentPath}
                  </span>
                  <RefreshCw
                    className="w-3 h-3 text-slate-400 cursor-pointer hover:text-white"
                    onClick={() => setIframeKey((k) => k + 1)}
                  />
                </div>
              </div>

              {/* Live Web View Iframe */}
              <div
                style={{
                  width: `${activeWidth}px`,
                  height: `${activeHeight}px`,
                }}
                className="bg-white relative overflow-hidden"
              >
                <iframe
                  key={`${iframeKey}-${currentPath}`}
                  src={currentPath}
                  className="w-full h-full border-none"
                  title="Samsung Mobile Viewport"
                />
              </div>

              {/* Samsung One UI Bottom Gesture Navigation Bar */}
              <div className="h-5 bg-black flex items-center justify-center shrink-0">
                <div className="w-28 h-1 rounded-full bg-slate-600"></div>
              </div>
            </div>
          </div>

          {/* Dimension Details Badge */}
          <div className="text-center mt-3 text-xs text-slate-400 font-mono">
            {selectedDevice.name} · {activeWidth}px × {activeHeight}px ({isLandscape ? "Landscape" : "Portrait"})
          </div>
        </div>
      </div>
    </div>
  );
}

