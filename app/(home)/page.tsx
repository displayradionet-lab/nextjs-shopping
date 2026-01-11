import { HomeCarousel } from "@/components/shared/home/home-carousel";
import data from "@/lib/data";


export default function Page() {
  return (
   <HomeCarousel items={data.carousels} />
  );
}
