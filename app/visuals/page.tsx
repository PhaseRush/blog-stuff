"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

const Halo = dynamic(() => import('./p5/halo/sketch'), {
  ssr: false,
});

const Eye = dynamic(() => import('./p5/eye/sketch'), {
  ssr: false,
});


const PurityRing = dynamic(() => import('./p5/purity_ring/sketch'), {
  ssr: false,
});

const Topography = dynamic(() => import('./p5/topography/sketch'), {
  ssr: false,
});

const VertexPlane = dynamic(() => import('./p5/vertexplane/sketch'), {
  ssr: false,
});

const visuals = [
  { name: 'Eye', Component: Eye },
  { name: 'Halo', Component: Halo },
  { name: 'PurityRing', Component: PurityRing },
  { name: 'Topography', Component: Topography },
  { name: 'VertexPlane', Component: VertexPlane },
];

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % visuals.length);
  };

  const CurrentVisual = visuals[currentIndex].Component;

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">my stuff</h1>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {visuals[currentIndex].name} ({currentIndex + 1}/{visuals.length}) - Click to see next
        <CurrentVisual />
        <p className="text-sm text-gray-500 mt-4">
        </p>
      </div>
    </section>
  )
}
