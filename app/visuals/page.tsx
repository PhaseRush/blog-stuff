"use client";

import Halo from './p5/halo/sketch';
import Eye from './p5/eye/sketch';
import PurityRing from './p5/purity_ring/sketch'; // Requires DoublePendulum and Util modules
import Sample from './p5/sample'

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">my stuff</h1>
      <Eye />
      {/* <PurityRing /> */}
    </section>
  )
}
