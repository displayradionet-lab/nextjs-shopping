import { HomeCard } from "@/components/shared/home/home-card";
import { HomeCarousel } from "@/components/shared/home/home-carousel";
import { getAllCategories, getProductsForCard } from "@/lib/actions/product.actions";
import data from "@/lib/data";
import { toSlug } from "@/lib/utils";


export default async function Page() {
  
    const categories = (await getAllCategories()).slice(0, 4);
    const newArrivals = await getProductsForCard({ tag: 'new-arrival' });
    const featured = await getProductsForCard({ tag: 'featured' })
    const bestSellers = await getProductsForCard({ tag: 'best-seller' });
    

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
    </div>
    </>
  )
}  


