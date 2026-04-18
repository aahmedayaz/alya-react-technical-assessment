import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button, Input } from '../components/library'
import { useDebounce, useToast } from '../hooks'
import { fetchCategories, fetchProductsPage } from '../services/productsApi'
import type { Product } from '../types'

const PAGE_SIZE = 12
const DEBOUNCE_MS = 400

const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product
  onAddToCart: (title: string) => void
}) {
  const rating = product.rating?.rate ?? 0
  const reviewCount = product.rating?.count ?? 0
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-sm">
      <div className="aspect-square w-full overflow-hidden bg-page p-4">
        <img
          src={product.image}
          alt=""
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 text-sm font-bold leading-snug text-foreground">
            {product.title}
          </h3>
          <span className="shrink-0 text-sm font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted">
          ★ {rating.toFixed(1)} ({reviewCount} reviews)
        </p>
        <div className="mt-auto pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => onAddToCart(product.title)}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  )
})

const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-sm">
      <div className="aspect-square w-full animate-pulse bg-foreground/10" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-[72%] max-w-[240px] animate-pulse rounded bg-foreground/10" />
        <div className="h-3 w-[48%] max-w-[160px] animate-pulse rounded bg-foreground/10" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-foreground/10" />
      </div>
    </div>
  )
})

export function ProductsPage() {
  const { push } = useToast()
  const [categories, setCategories] = useState<string[]>([])
  const [category, setCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [manualReloadCount, setManualReloadCount] = useState(0)

  const lastAppliedListFilters = useRef<{
    category: string | null
    q: string
  } | null>(null)

  useEffect(() => {
    let stillMounted = true
    ;(async () => {
      try {
        const slugList = await fetchCategories()
        if (stillMounted) setCategories(slugList)
      } catch {
        if (stillMounted) setCategories([])
      }
    })()
    return () => {
      stillMounted = false
    }
  }, [])

  useEffect(() => {
    const listRequest = new AbortController()

    const previous = lastAppliedListFilters.current
    const searchOrCategoryChanged =
      previous === null ||
      previous.category !== category ||
      previous.q !== debouncedQuery

    if (searchOrCategoryChanged) {
      lastAppliedListFilters.current = { category, q: debouncedQuery }
      if (page !== 1) {
        setPage(1)
        setLoading(true)
        setError(null)
        return () => listRequest.abort()
      }
    }

    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const data = await fetchProductsPage({
          page,
          pageSize: PAGE_SIZE,
          category,
          query: debouncedQuery,
          signal: listRequest.signal,
        })
        setProducts(data.products)
        setTotal(data.total)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError('Could not load products.')
        setProducts([])
        setTotal(0)
      } finally {
        if (!listRequest.signal.aborted) setLoading(false)
      }
    })()
    return () => listRequest.abort()
  }, [page, category, debouncedQuery, manualReloadCount])

  const maxPage = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total],
  )

  const onRetry = useCallback(() => {
    setPage(1)
    setError(null)
    push({ type: 'info', title: 'Retrying', message: 'Fetching products again.' })
    setManualReloadCount((n) => n + 1)
  }, [push])

  const showEmptyState = !loading && !error && products.length === 0

  const notifyAddedToCart = useCallback(
    (title: string) => {
      push({
        type: 'success',
        title: 'Added',
        message: title,
        durationMs: 3200,
      })
    },
    [push],
  )

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground laptop:text-3xl">
          Product Explorer
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted laptop:text-base">
          Discover curated products. Search updates after you stop typing ({DEBOUNCE_MS}ms debounce).
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 laptop:grid-cols-[1fr_280px] laptop:items-end">
        <Input
          id="product-search"
          label="Search"
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <div className="text-xs text-muted laptop:text-right">
          Page {page} of {maxPage} · {total} results
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
            category === null
              ? 'border-primary bg-primary text-card'
              : 'border-foreground/15 bg-card text-foreground hover:border-primary/40'
          }`}
        >
          All
        </button>
        {categories.slice(0, 8).map((slug) => (
          <button
            key={slug}
            type="button"
            onClick={() => setCategory(slug === category ? null : slug)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold capitalize transition-colors ${
              category === slug
                ? 'border-primary bg-primary text-card'
                : 'border-foreground/15 bg-card text-foreground hover:border-primary/40'
            }`}
          >
            {slug.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-danger-bg bg-danger-bg/40 p-8 text-center">
          <p className="font-semibold text-danger-fg">{error}</p>
          <div className="mt-4 flex justify-center">
            <Button variant="primary" onClick={onRetry}>
              Retry
            </Button>
          </div>
        </div>
      ) : null}

      {showEmptyState ? (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-page p-10 text-center">
          <p className="text-lg font-bold text-foreground">No matches</p>
          <p className="mt-2 text-sm text-muted">
            Try a different search keyword or clear a category filter.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3 laptop:gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={notifyAddedToCart}
              />
            ))}
      </div>

      {!loading && !error && products.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-4">
          <Button
            variant="ghost"
            disabled={page <= 1}
            onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={page >= maxPage}
            onClick={() =>
              setPage((prevPage) => Math.min(maxPage, prevPage + 1))
            }
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  )
}
