"use client";

type Props = {
  src?: string;
  poster?: string;
};

export default function ModelViewerLaptop({ src = "/models/hacker_laptop.glb", poster }: Props) {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh]">
      {/* @ts-expect-error model-viewer is a custom element */}
      <model-viewer
        src={src}
        poster={poster}
        alt="3D laptop"
        autoplay
        disable-zoom
        interaction-prompt="none"
        camera-controls="false"
        touch-action="none"
        interaction-policy="none"
        exposure="1.0"
        shadow-intensity="0.2"
        shadow-softness="0.6"
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        environment-image="neutral"
      />
    </div>
  );
}


