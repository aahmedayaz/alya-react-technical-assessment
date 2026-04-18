import type { Product, ProductsResponse } from '../types'

const apiRoot = import.meta.env.DEV
  ? '/api/dummyjson'
  : 'https://dummyjson.com'

function normalizeProduct(raw: Product & Record<string, unknown>): Product {
  const thumb =
    (typeof raw.thumbnail === 'string' && raw.thumbnail) ||
    (Array.isArray(raw.images) && typeof raw.images[0] === 'string'
      ? raw.images[0]
      : '')
  const image =
    (typeof raw.image === 'string' && raw.image) || thumb || ''

  let rating = raw.rating
  if (typeof rating === 'number') {
    rating = { rate: rating, count: 0 }
  } else if (
    !rating ||
    typeof rating !== 'object' ||
    typeof (rating as { rate?: unknown }).rate !== 'number'
  ) {
    rating = { rate: 0, count: 0 }
  }

  return {
    ...raw,
    image,
    rating: rating as Product['rating'],
  }
}

function normalizeResponse(data: ProductsResponse): ProductsResponse {
  return {
    ...data,
    products: data.products.map((product) =>
      normalizeProduct(product as Product & Record<string, unknown>),
    ),
  }
}

function parseCategorySlugs(data: unknown): string[] {
  if (!Array.isArray(data)) return []
  const slugs: string[] = []
  for (const item of data) {
    if (typeof item === 'string' && item) {
      slugs.push(item)
      continue
    }
    if (item && typeof item === 'object' && 'slug' in item) {
      const slug = (item as { slug: unknown }).slug
      if (typeof slug === 'string' && slug) slugs.push(slug)
    }
  }
  return slugs
}

export async function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(`${apiRoot}/products/categories`, { signal })
  if (!res.ok) throw new Error('Failed to load categories')
  return parseCategorySlugs(await res.json())
}

export async function fetchProductsPage(params: {
  page: number
  pageSize: number
  category: string | null
  query: string
  signal?: AbortSignal
}): Promise<ProductsResponse> {
  const { page, pageSize, category, query, signal } = params
  const skip = (page - 1) * pageSize

  if (query.trim()) {
    const q = encodeURIComponent(query.trim())
    const res = await fetch(
      `${apiRoot}/products/search?q=${q}&limit=${pageSize}&skip=${skip}`,
      { signal },
    )
    if (!res.ok) throw new Error('Search failed')
    const data = normalizeResponse((await res.json()) as ProductsResponse)
    if (!category) return data
    return {
      ...data,
      products: data.products.filter(
        (product) => product.category === category,
      ),
      total: data.total,
    }
  }

  if (category) {
    const res = await fetch(
      `${apiRoot}/products/category/${encodeURIComponent(category)}?limit=${pageSize}&skip=${skip}`,
      { signal },
    )
    if (!res.ok) throw new Error('Failed to load category')
    return normalizeResponse((await res.json()) as ProductsResponse)
  }

  const res = await fetch(
    `${apiRoot}/products?limit=${pageSize}&skip=${skip}`,
    { signal },
  )
  if (!res.ok) throw new Error('Failed to load products')
  return normalizeResponse((await res.json()) as ProductsResponse)
}
