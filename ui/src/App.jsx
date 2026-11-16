import { useEffect, useState } from "react";

const SWATCHES = [
  "bg-swatch-1",
  "bg-swatch-2",
  "bg-swatch-3",
  "bg-swatch-4",
  "bg-swatch-5",
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function SiteHeader() {
  return (
    <header className="border-b border-line/80 bg-panel/80 backdrop-blur-md">
      <div className="mx-auto flex w-[min(72rem,calc(100%-2rem))] items-center justify-between gap-4 py-4">
        <a
          href="/products"
          className="font-display text-xl font-extrabold tracking-tight text-ink no-underline sm:text-2xl"
        >
          North Desk
        </a>
        <nav className="flex items-center gap-5 text-sm font-medium text-muted">
          <a className="text-ink no-underline" href="/products">
            Shop
          </a>
          <span className="hidden sm:inline" aria-hidden="true">
            Desk essentials
          </span>
        </nav>
      </div>
    </header>
  );
}

function ProductVisual({ product, className = "" }) {
  const swatch = SWATCHES[(product.id - 1) % SWATCHES.length];
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${swatch} ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.22),transparent_55%)]" />
      <span className="relative font-display text-4xl font-bold tracking-tight text-white/90 sm:text-5xl">
        {initials}
      </span>
    </div>
  );
}

const SORT_OPTIONS = new Set(["price_desc", "price_asc"]);

function getSortFromUrl() {
  const value = new URLSearchParams(window.location.search).get("sort");
  return SORT_OPTIONS.has(value) ? value : "price_desc";
}

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [sort, setSort] = useState(getSortFromUrl);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("sort", sort);
    const nextUrl = `/products?${params.toString()}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [sort]);

  useEffect(() => {
    setStatus("loading");
    fetch(`/api/products?sort=${sort}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setStatus(data.length === 0 ? "empty" : "ready");
      })
      .catch(() => setStatus("error"));
  }, [sort]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-[min(72rem,calc(100%-2rem))] pb-16 pt-10">
        <section className="animate-rise flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              Catalog
            </p>
            <h1 className="font-display m-0 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Tools for a clearer desk
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Everyday supplies with a simple price tag — notebooks, light, and
              the small pieces that keep work moving.
            </p>
          </div>
          <label className="flex shrink-0 flex-col gap-1.5 text-sm font-medium text-ink">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="min-w-[12rem] rounded-xl border border-line bg-panel px-3 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-accent"
            >
              <option value="price_desc">Most expensive</option>
              <option value="price_asc">Cheapest first</option>
            </select>
          </label>
        </section>

        {status === "loading" && (
          <p className="mt-10 text-muted">Loading products…</p>
        )}
        {status === "empty" && (
          <p className="mt-10 text-muted">No products yet.</p>
        )}
        {status === "error" && (
          <p className="mt-10 text-muted">Could not load products.</p>
        )}

        {status === "ready" && (
          <section
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-live="polite"
          >
            {products.map((product, index) => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                className="product-card animate-rise block overflow-hidden rounded-2xl border border-line bg-panel text-inherit no-underline"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <ProductVisual product={product} className="aspect-[4/3]" />
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display m-0 text-xl font-bold leading-snug">
                      {product.name}
                    </h2>
                    <p className="m-0 shrink-0 text-base font-semibold text-accent">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <p className="m-0 line-clamp-2 text-sm leading-relaxed text-muted">
                    {product.description}
                  </p>
                  <span className="product-card-cta mt-1 inline-flex w-fit rounded-lg bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent transition-colors">
                    View product
                  </span>
                </div>
              </a>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function ProductDetailPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((response) => {
        if (response.status === 404) {
          setStatus("notfound");
          return null;
        }
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setProduct(data);
          setStatus("ready");
        }
      })
      .catch(() => setStatus("error"));
  }, [productId]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-[min(72rem,calc(100%-2rem))] pb-16 pt-8">
        <p className="mb-8 text-sm">
          <a
            className="font-medium text-muted no-underline hover:text-ink"
            href="/products"
          >
            ← Back to shop
          </a>
        </p>

        {status === "loading" && (
          <p className="text-muted">Loading product…</p>
        )}
        {status === "notfound" && (
          <p className="text-muted">Product not found.</p>
        )}
        {status === "error" && (
          <p className="text-muted">Could not load product.</p>
        )}

        {status === "ready" && product && (
          <article className="animate-fade grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductVisual
              product={product}
              className="aspect-square rounded-2xl shadow-[0_20px_40px_-28px_rgb(16_24_32_/_45%)]"
            />
            <div className="animate-rise flex flex-col lg:pt-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                In stock
              </p>
              <h1 className="font-display m-0 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-ink">
                {formatPrice(product.price)}
              </p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                {product.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
                >
                  Add to bag
                </button>
                <a
                  href="/products"
                  className="rounded-xl border border-line bg-panel px-5 py-3 text-sm font-semibold text-ink no-underline transition hover:border-ink/30"
                >
                  Keep shopping
                </a>
              </div>
              <dl className="mt-10 grid gap-3 border-t border-line pt-6 text-sm text-muted sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink">SKU</dt>
                  <dd className="m-0 mt-1">ND-{String(product.id).padStart(4, "0")}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Shipping</dt>
                  <dd className="m-0 mt-1">Ships in 2–3 days</dd>
                </div>
              </dl>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-[min(72rem,calc(100%-2rem))] py-16">
        <h1 className="font-display m-0 text-3xl font-extrabold">
          Page not found
        </h1>
        <p className="mt-3 text-muted">
          Try the{" "}
          <a className="font-medium text-accent" href="/products">
            shop
          </a>
          .
        </p>
      </main>
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  useEffect(() => {
    if (path === "/") {
      window.history.replaceState(null, "", "/products");
    }
  }, [path]);

  if (path === "/" || path === "/products") {
    return <ProductsPage />;
  }

  const detailMatch = path.match(/^\/products\/(\d+)$/);
  if (detailMatch) {
    return <ProductDetailPage productId={detailMatch[1]} />;
  }

  return <NotFoundPage />;
}
