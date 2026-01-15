import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import { HomeCard } from "@/components/shared/home/home-card";
import { HomeCarousel } from "@/components/shared/home/home-carousel";
import ProductSlider from "@/components/shared/product/product-slider";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCategories, getProductsByTag, getProductsForCard } from "@/lib/actions/product.actions";
import data from "@/lib/data";
import { toSlug } from "@/lib/utils";


export default async function Page() {
  try {
    const categories = (await getAllCategories()).slice(0, 4);
    const newArrivals = await getProductsForCard({ tag: 'new-arrival' });
    const featured = await getProductsForCard({ tag: 'featured' })
    const bestSellers = await getProductsForCard({ tag: 'best-seller' });
    const todaysDeals = await getProductsByTag({ tag: 'todays-deal' });
    const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' });
    

      const cards = [
    {
      title: 'Categories to explore',
      link: {
        text: 'See More',
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: 'Explore New Arrivals',
      items: newArrivals,
      link: {
        text: 'View All',
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: 'Discover Best Sellers',
      items: bestSellers,
      link: {
        text: 'View All',
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: 'Featured Products',
      items: featured,
      link: {
        text: 'Shop Now',
        href: '/search?tag=new-arrival',
      },
    },
  ];

  return (
    <>
    <HomeCarousel items={data.carousel} />
    <div className="md:p-4 md:space-y-4 bg-border">
      <HomeCard cards={cards} />

      <Card>
        <CardContent>
          {todaysDeals.length > 0 ? (
            <ProductSlider title="Today's Deals" products={todaysDeals} />
          ) : (
            <div className="p-4">
              <h2 className="h2-bold mb-5">Today's Deals</h2>
              <p>No products found in today's deals ({todaysDeals.length} products)</p>
            </div>
          )}
        </CardContent>
      </Card>

         <Card className='w-full rounded-none'>
        <CardContent className='p-4 items-center gap-3'>
          <ProductSlider
            title="Best Selling Products"
            products={bestSellingProducts}
            hideDetails
          />
        </CardContent>
      </Card>
  </div>
  <div className="p-4 bg-background">
    <BrowsingHistoryList />
  </div>
  </>
)
  } catch (error) {
    console.error('Database connection failed, using static data:', error);
    
    // Fallback to static data when database is not available
    const categories = ['T-Shirts', 'Jeans', 'Wrist Watches', 'Shoes'];
    const staticProducts = data.products;
    
    const cards = [
      {
        title: 'Categories to explore',
        link: {
          text: 'See More',
          href: '/search',
        },
        items: categories.map((category) => ({
          name: category,
          image: `/images/${toSlug(category)}.jpg`,
          href: `/search?category=${category}`,
        })),
      },
      {
        title: 'Explore New Arrivals',
        items: staticProducts.filter(p => p.tags.includes('new-arrival')).slice(0, 4).map(p => ({
          _id: p.slug,
          name: p.name,
          href: `/product/${p.slug}`,
          image: p.images[0]
        })),
        link: {
          text: 'View All',
          href: '/search?tag=new-arrival',
        },
      },
      {
        title: 'Discover Best Sellers',
        items: staticProducts.filter(p => p.tags.includes('best-seller')).slice(0, 4).map(p => ({
          _id: p.slug,
          name: p.name,
          href: `/product/${p.slug}`,
          image: p.images[0]
        })),
        link: {
          text: 'View All',
          href: '/search?tag=best-seller',
        },
      },
      {
        title: 'Featured Products',
        items: staticProducts.filter(p => p.tags.includes('featured')).slice(0, 4).map(p => ({
          _id: p.slug,
          name: p.name,
          href: `/product/${p.slug}`,
          image: p.images[0]
        })),
        link: {
          text: 'Shop Now',
          href: '/search?tag=featured',
        },
      },
    ];

    const todaysDeals = staticProducts.filter(p => p.tags.includes('todays-deal')).map(p => ({
      ...p,
      _id: p.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const bestSellingProducts = staticProducts.filter(p => p.tags.includes('best-seller')).map(p => ({
      ...p,
      _id: p.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return (
      <>
      <HomeCarousel items={data.carousel} />
      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCard cards={cards} />

        <Card>
          <CardContent>
            {todaysDeals.length > 0 ? (
              <ProductSlider title="Today's Deals" products={todaysDeals} />
            ) : (
              <div className="p-4">
                <h2 className="h2-bold mb-5">Today's Deals</h2>
                <p>No products found in today's deals ({todaysDeals.length} products)</p>
              </div>
            )}
          </CardContent>
        </Card>

             <Card className='w-full rounded-none'>
            <CardContent className='p-4 items-center gap-3'>
              <ProductSlider
                title="Best Selling Products"
                products={bestSellingProducts}
                hideDetails
              />
            </CardContent>
          </Card>
      </div>
      <div className="p-4 bg-background">
        <BrowsingHistoryList />
      </div>
      </>
    )
  }
}  


