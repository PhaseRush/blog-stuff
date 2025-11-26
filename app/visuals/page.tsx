"use client";

import Halo from './p5/halo/sketch';
import Eye from './p5/eye/sketch';
// import PurityRing from './p5/purity_ring/sketch';
import Sample from './p5/sample'
import dynamic from 'next/dynamic';

const PurityRing = dynamic(() => import('./p5/purity_ring/sketch'), {
  ssr: false,
});

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">my stuff</h1>
      <PurityRing />
    </section>
  )
}
