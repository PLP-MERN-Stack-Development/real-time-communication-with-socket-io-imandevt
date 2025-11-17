import React from "react";

/* Banner shown when socket reconnecting/ disconnected */
export default function ReconnectBanner({ isConnected }) {
  return (
    <div className={`w-full text-center text-sm py-1 transition-all ${isConnected ? "bg-emerald-50 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
      {isConnected ? "Connected" : "Reconnecting... trying to restore connection"}
    </div>
  );
}
