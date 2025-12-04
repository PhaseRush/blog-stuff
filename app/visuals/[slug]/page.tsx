import { notFound } from 'next/navigation'
import { getAllVisuals, getVisualBySlug } from 'app/visuals/utils'
import { VisualRenderer } from './visual-renderer'

export async function generateStaticParams() {
  let visuals = getAllVisuals()

  return visuals.map((visual) => ({
    slug: visual.slug,
  }))
}

export default async function VisualPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const visual = getVisualBySlug(slug)

  if (!visual) {
    notFound()
  }

  return (
    <section>
      <h1 className="title font-semibold text-2xl tracking-tighter mb-2">
        {visual.title}
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
        {visual.description}
      </p>
      <div className="w-full">
        <VisualRenderer slug={slug} />
      </div>
    </section>
  )
}
