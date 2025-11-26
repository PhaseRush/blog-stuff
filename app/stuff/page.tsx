import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'Blog',
  description: 'leave immediately.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">my stuff</h1>
      <BlogPosts />
    </section>
  )
}
