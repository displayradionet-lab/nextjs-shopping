'use server';

import { connectToDatabase } from '@/lib/db';
import Product, { IProduct } from '@/lib/db/models/product.models';
import { PAGE_SIZE } from '@/lib/constants';
import { IProductData } from '@/types';


export async function getAllCategories() {
  await connectToDatabase();
  const categories = await Product.find({ isPublished: true }).distinct(
    'category'
  );
  return categories;
}

export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();

  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      _id: 1,
      name: 1,
      href: { $concat: ['/product/', '$slug'] },
      image: { $arrayElemAt: ['$images', 0] },
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as {
    _id: string;
    name: string;
    href: string;
    image: string;
  }[];
}

export async function getProductsByCategory({
  category,
  limit = 20,
}: {
  category: string;
  limit?: number;
}) {
  await connectToDatabase();

  const products = await Product.find({ category, isPublished: true })
    .sort({ createdAt: 'desc' })
    .limit(limit)
    .lean();

  // Convert ObjectId to string for client-side serialization
  return products.map(product => ({
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    category: product.category,
    images: product.images,
    brand: product.brand,
    description: product.description,
    price: product.price,
    listPrice: product.listPrice,
    countInStock: product.countInStock,
    tags: product.tags,
    colors: product.colors,
    sizes: product.sizes,
    avgRating: product.avgRating,
    numReviews: product.numReviews,
    ratingDistribution: product.ratingDistribution?.map(item => ({
      rating: item.rating,
      count: item.count,
    })) || [],
    numSales: product.numSales,
    isPublished: product.isPublished,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  })) as IProductData[];
}

export async function getProductsForCardByCategory({
  category,
  limit = 10,
}: {
  category: string;
  limit?: number;
}) {
  await connectToDatabase();

  const products = await Product.find(
    { category, isPublished: true },
    {
      _id: 1,
      name: 1,
      href: { $concat: ['/product/', '$slug'] },
      image: { $arrayElemAt: ['$images', 0] },
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as {
    _id: string;
    name: string;
    href: string;
    image: string;
  }[];
}

// GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();

  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: 'desc' })
    .limit(limit)
    .lean();

  // Convert ObjectId to string for client-side serialization
  return products.map(product => ({
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    category: product.category,
    images: product.images,
    brand: product.brand,
    description: product.description,
    price: product.price,
    listPrice: product.listPrice,
    countInStock: product.countInStock,
    tags: product.tags,
    colors: product.colors,
    sizes: product.sizes,
    avgRating: product.avgRating,
    numReviews: product.numReviews,
    ratingDistribution: product.ratingDistribution?.map(item => ({
      rating: item.rating,
      count: item.count,
    })) || [],
    numSales: product.numSales,
    isPublished: product.isPublished,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  })) as IProductData[];
}

// GET PRODUCT BY SLUG
export async function getProductBySlug(slug: string): Promise<IProductData> {
  await connectToDatabase();
  const product = await Product.findOne({ slug, isPublished: true }).lean();
  if (!product) throw new Error('Product not found');
  
  // Convert ObjectId to string for client-side serialization
  return {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    category: product.category,
    images: product.images,
    brand: product.brand,
    description: product.description,
    price: product.price,
    listPrice: product.listPrice,
    countInStock: product.countInStock,
    tags: product.tags,
    colors: product.colors,
    sizes: product.sizes,
    avgRating: product.avgRating,
    numReviews: product.numReviews,
    ratingDistribution: product.ratingDistribution?.map(item => ({
      rating: item.rating,
      count: item.count,
    })) || [],
    numSales: product.numSales,
    isPublished: product.isPublished,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  } as IProductData;
}

// GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY
export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string;
  productId: string;
  limit?: number;
  page: number;
}) {
  await connectToDatabase();
  const skipAmount = (Number(page) - 1) * limit;
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  };

  const products = await Product.find(conditions)
    .sort({ numSales: 'desc' })
    .skip(skipAmount)
    .limit(limit)
    .lean();
  const productsCount = await Product.countDocuments(conditions);
  
  // Convert ObjectId to string for client-side serialization
  return {
    data: products.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      category: product.category,
      images: product.images,
      brand: product.brand,
      description: product.description,
      price: product.price,
      listPrice: product.listPrice,
      countInStock: product.countInStock,
      tags: product.tags,
      colors: product.colors,
      sizes: product.sizes,
      avgRating: product.avgRating,
      numReviews: product.numReviews,
      ratingDistribution: product.ratingDistribution?.map(item => ({
      rating: item.rating,
      count: item.count,
    })) || [],
      numSales: product.numSales,
      isPublished: product.isPublished,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })) as IProductData[],
    totalPages: Math.ceil(productsCount / limit),
  };
}

// GET ALL PRODUCTS
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category: string;
  tag: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  limit = limit || PAGE_SIZE;
  await connectToDatabase();

  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const tagFilter = tag && tag !== 'all' ? { tags: tag } : {};

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {};
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 };
  const isPublished = { isPublished: true };
  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...categoryFilter,
    ...tagFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean();

  const countProducts = await Product.countDocuments({
    ...isPublished,
    ...queryFilter,
    ...categoryFilter,
    ...tagFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  };
}

// GET ALL TAGS
export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ]);
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ) as string[]) || []
  );
}