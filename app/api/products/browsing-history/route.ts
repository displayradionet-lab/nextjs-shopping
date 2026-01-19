import { NextRequest, NextResponse } from 'next/server';

import Product from '@/lib/db/models/product.models';
import { connectToDatabase } from '@/lib/db';

export const GET = async (request: NextRequest) => {
    const listType = request.nextUrl.searchParams.get('type') || 'history';
    const productIdsParam = request.nextUrl.searchParams.get('ids');
    const categoriesParam = request.nextUrl.searchParams.get('categories');

    if (!productIdsParam || !categoriesParam) {
        return NextResponse.json([])
    }

    const productIds = productIdsParam.split(',');
    const categories = categoriesParam.split(',');
    const filter = 
    listType === 'history'
     ? {
        _id: { $in: productIds },
     }
     : {
        category: { $in: categories }, _id: { $nin: productIds },
     }

    await connectToDatabase();
    const products = await Product.find(filter).lean();
    if(listType === 'history') {
        products.sort((a, b) => 
          productIds.indexOf(a._id.toString()) - productIds.indexOf(b._id.toString())  
        )
    }

    // Convert ObjectId to string and serialize ratingDistribution
    const serializedProducts = products.map(product => ({
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
    }));

    return NextResponse.json(serializedProducts);
}