import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { IProductData } from '@/types';

import Rating from './rating';
import { formatNumber, generateId } from '@/lib/utils';
import ProductPrice from './product-price';
import ImageHover from './image-hover';
import AddToCart from '@/components/shared/product/add-to-cart';


const ProductCard = ({  
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: {
  
  product: IProductData;
  hideBorder?: boolean;
  hideDetails?: boolean;
  hideAddToCart?: boolean;
}) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className="relative h-52 w-full">
        {product.images && product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={product.images?.[0] || '/images/banner1.jpg'}
              alt={product.name}
              fill
              sizes="70vw"
              className="object-contain"
            />
          </div>
        )}
      </div>
    </Link>
  );

  const ProductDetails = () => (
    <div className="flex-1 space-y-2">
      <p className="font-semibold">{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className="overflow-hidden text-ellipsis"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>
      <div className="flex gap-2 justify-center">
        <Rating rating={product.avgRating} />
        <span>({formatNumber(product.numReviews)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags.includes('todays-deal')}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  );

  const AddButton = () => (
    <div className='w-full text-center'>
      <AddToCart 
        minimal={true}
        item={{
          clientId: generateId(),        
          product: product._id.toString(),
          name: product.name,
          slug: product.slug,
          category: product.category,
          quantity: 1,
          countInStock: product.countInStock,
          image: product.images?.[0] || '/images/banner1.jpg',
          price: product.price,
          size: product.sizes?.[0] || '',
          color: product.colors?.[0] || '',           
        }}
      />
    </div>
  )


  return hideBorder ? (
    <div className="flex flex-col">
      <ProductImage />
      {!hideDetails && (
        <>
          <div className="p-3 flex-1 text-center">
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <Card className="flex flex-col">
      <CardHeader className="p-3">
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className="p-3 flex-1 text-center">
            <ProductDetails />
          </CardContent>
          <CardFooter className='p-3'>
            {!hideAddToCart && <AddButton />}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ProductCard;
