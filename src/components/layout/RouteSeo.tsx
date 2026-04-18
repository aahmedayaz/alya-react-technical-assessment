import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { resolvePageSeo } from '../../config/seo'

function upsertHeadMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description } = resolvePageSeo(pathname)
    document.title = title

    upsertHeadMeta('name', 'description', description)
    upsertHeadMeta('property', 'og:title', title)
    upsertHeadMeta('property', 'og:description', description)
    upsertHeadMeta('property', 'og:type', 'website')
    upsertHeadMeta('property', 'og:url', `${window.location.origin}${pathname}`)

    upsertHeadMeta('name', 'twitter:card', 'summary_large_image')
    upsertHeadMeta('name', 'twitter:title', title)
    upsertHeadMeta('name', 'twitter:description', description)
  }, [pathname])

  return null
}
