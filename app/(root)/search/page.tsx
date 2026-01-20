// 'use client'

// import { useEffect, useState, Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'
// import ProductCard from '@/components/shared/product/product-card'
// import { IProductData } from '@/types'
// import { getProductsByCategory } from '@/lib/actions/product.actions'

// function SearchContent() {
//   const searchParams = useSearchParams()
//   const category = searchParams.get('category')
//   const [products, setProducts] = useState<IProductData[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const result = await getProductsByCategory({ category: category || '' })
//         setProducts(result)
//       } catch (error) {
//         console.error('Error fetching products:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProducts()
//   }, [category])

//   if (loading) {
//     return <div className="container mx-auto px-4 py-8">Loading...</div>
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">
//         {category ? `Products in ${category}` : 'All Products'}
//       </h1>
      
//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <ProductCard key={product._id.toString()} product={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function SearchPage() {
//   return (
//     <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
//       <SearchContent />
//     </Suspense>
//   )
// }


import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllCategories,
  getAllProducts,
  getAllTags,
} from '@/lib/actions/product.actions';
import { IProductData } from '@/types';
import ProductSortSelector from '@/components/shared/product/product-sort-selector';
import { getFilterUrl, toSlug } from '@/lib/utils';
import Rating from '@/components/shared/product/rating';

import CollapsibleOnMobile from '@/components/shared/collapsible-on-mobile';

const sortOrders = [
  { value: 'price-low-to-high', name: 'Price low to high' },
  { value: 'price-high-to-low', name: 'Price high to low' },
  { value: 'newest-arrivals', name: 'Newest Arrivals' },
  { value: 'avg-customer-review', name: 'Average Customer Review' },
  { value: 'best-selling', name: 'Best Selling' },
];

const prices = [
  {
    name: '$1 to $20',
    value: '1-20',
  },
  {
    name: '$21 to $50',
    value: '21-50',
  },
  {
    name: '$51 to $1000',
    value: '51-1000',
  },
];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    tag: string;
    price: string;
    sort: string;
    rating: string;
    page: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
  } = searchParams;

  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    price !== 'all' ||
    rating !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ''}
              ${category !== 'all' ? ` : Category ${category}` : ''}
              ${tag !== 'all' ? ` : Tag ${tag}` : ''}
              ${price !== 'all' ? ` : Price ${price}` : ''}
              ${rating !== 'all' ? ` : Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    tag: string;
    price: string;
    sort: string;
    rating: string;
    page: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
    page = '1',
    sort = 'best-selling',
  } = searchParams;

  const params = { q, category, tag, price, sort, rating, page };

  const categories = await getAllCategories();
  const tags = await getAllTags();
  const data = await getAllProducts({
    query: q,
    category,
    tag,
    price,
    rating,
    page: Number(page),
    sort,
  });
  return (
    <div>
      <div className="mb-2 py-2 md:border-b flex-between flex-col md:flex-row">
        <div className="flex items-center">
          {data.totalProducts === 0
            ? 'NO'
            : `${data.from}-${data.to} of ${data.totalProducts}`}{' '}
          results
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all'
            ? ` for `
            : null}
          {q !== 'all' && q !== '' && '"' + q + '"'}
          {category !== 'all' && category !== '' && ` Category: ` + category}
          {tag !== 'all' && tag !== '' && ` Tag: ` + tag}
          {price !== 'all' && ` Price: ` + price}
          {rating !== 'all' && ` Rating: ` + rating + ` & up `}
          &nbsp;
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all' ? (
            <Button variant={'link'} asChild>
              <Link href="/search">Clear</Link>
            </Button>
          ) : null}
        </div>
        <div>
          <ProductSortSelector
            sort={sort}
            sortOrders={sortOrders}
            params={params}
          />
        </div>
      </div>
      <div className='bg-card grid md:grid-cols-5 md:gap-4'>
        <CollapsibleOnMobile title="Filters">
          <div className="space-y-4">
            <div>
              <div className="font-bold">Department</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === category || '' === category) && 'text-primary'
                    }`}
                    href={getFilterUrl({ category: 'all', params })}
                  >
                    All
                  </Link>
                </li>
                {categories.map((c: string) => (
                  <li key={c}>
                    <Link
                      className={`${c === category && 'text-primary'}`}
                      href={getFilterUrl({ category: c, params })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold">Price</div>
              <ul>
                <li>
                  <Link
                    className={`${'all' === price && 'text-primary'}`}
                    href={getFilterUrl({ price: 'all', params })}
                  >
                    All
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      href={getFilterUrl({ price: p.value, params })}
                      className={`${p.value === price && 'text-primary'}`}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold">Customer Review</div>
              <ul>
                <li>
                  <Link
                    href={getFilterUrl({ rating: 'all', params })}
                    className={`${'all' === rating && 'text-primary'}`}
                  >
                    All
                  </Link>
                </li>

                <li>
                  <Link
                    href={getFilterUrl({ price: '4', params })}
                    className={`${'4' === price && 'text-primary'}`}
                  >
                    <div className="flex">
                      <Rating size={4} rating={4} /> & Up
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold">Tags</div>
              <ul>
                <li>
                  <Link
                    href={getFilterUrl({ tag: 'all', params })}
                    className={`${
                      ('all' === tag || '' === tag) && 'text-primary'
                    }`}
                  >
                    All
                  </Link>
                </li>
                {tags.map((t: string) => (
                  <li key={t}>
                    <Link
                      className={`${toSlug(t) === tag && 'text-primary'}`}
                      href={getFilterUrl({ tag: t, params })}
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleOnMobile>

        <div className="md:col-span-4 space-y-4">
          <div>
            <div className="font-bold text-xl">Results</div>
            <div>Check each product page for other buying options</div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.products?.length === 0 && <div>No products found</div>}
            {data?.products?.map((product) => (
              <ProductCard key={product._id.toString()} product={{
                ...product,
                _id: product._id.toString(),
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
              } as IProductData} />
            ))}
          </div>
          {data!.totalPages! > 1 && (
            <Pagination page={page} totalPages={data!.totalPages} />
          )}
        </div>
      </div>
    </div>
  );
}
