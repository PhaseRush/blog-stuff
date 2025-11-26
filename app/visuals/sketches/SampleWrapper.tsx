"use client";

import dynamic from 'next/dynamic';

// const Sample = dynamic(() => import("../p5/sample"), {
//   ssr: false,
//   loading: () => <p>Loading canvas...</p>
// });

const Halo = dynamic(() => import("../p5/halo/sketch"), {
  ssr: false,
  loading: () => <p>Loading canvas...</p>
});


export default function SampleWrapper() {
  return <Halo />;
  // return <Sample />;
}
