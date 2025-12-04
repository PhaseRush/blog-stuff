import { VisualsList } from 'app/components/visuals'

export const metadata = {
  title: 'Visuals',
  description: 'Visual experiments and interactive sketches.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">visuals</h1>
      <VisualsList />
    </section>
  )
}
