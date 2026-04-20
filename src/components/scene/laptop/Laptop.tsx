"use client";

import React from "react";

export default function Laptop() {
  return (
    <div className="relative w-full h-full">
      {/* @ts-expect-error custom element */}
      <model-viewer
        src="/models/hacker_laptop.glb"
        alt="3D laptop"
        autoplay
        disable-zoom
        interaction-prompt="none"
        camera-controls="false"
        touch-action="none"
        interaction-policy="none"
        style={{ width: "100%", height: "100%", background: "transparent" }}
        environment-image="neutral"
      />
    </div>
  );
}