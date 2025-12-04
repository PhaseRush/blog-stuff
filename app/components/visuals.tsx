import Link from 'next/link'
import { formatDate, getAllVisuals } from 'app/visuals/utils'

export function VisualsList() {
  let allVisuals = getAllVisuals()

  return (
    <div>
      {allVisuals
        .sort((a, b) => {
          if (
            new Date(a.createdAt) > new Date(b.createdAt)
          ) {
            return -1
          }
          return 1
        })
        .map((visual) => (
          <Link
            key={visual.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/visuals/${visual.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[160px] tabular-nums">
                {formatDate(visual.createdAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {visual.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
