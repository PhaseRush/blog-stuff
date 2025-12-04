"use client";

import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamic imports for all sketches
const Eye = dynamic(() => import('../p5/eye/sketch'), { ssr: false })
const Halo = dynamic(() => import('../p5/halo/sketch'), { ssr: false })
const PurityRing = dynamic(() => import('../p5/purity_ring/sketch'), { ssr: false })
const Topography = dynamic(() => import('../p5/topography/sketch'), { ssr: false })
const VertexPlane = dynamic(() => import('../p5/vertexplane/sketch'), { ssr: false })

// Map slugs to components
const visualComponents = {
  eye: Eye,
  halo: Halo,
  purity_ring: PurityRing,
  topography: Topography,
  vertexplane: VertexPlane,
}

export function VisualRenderer({ slug }: { slug: string }) {
  const VisualComponent = visualComponents[slug]

  if (!VisualComponent) {
    notFound()
  }

  return <VisualComponent />
}
