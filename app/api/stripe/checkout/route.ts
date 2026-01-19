import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import Order from '@/lib/db/models/order.model';
import { auth } from '@/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    console.log('Stripe checkout API called');
    
    const session = await auth();
    if (!session) {
      console.error('Unauthorized: No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { orderId } = await req.json();
    console.log('Order ID:', orderId);
    console.log('Order ID type:', typeof orderId);
    
    if (!orderId || typeof orderId !== 'string') {
      console.error('Invalid order ID:', orderId);
      return new NextResponse('Invalid order ID', { status: 400 });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return new NextResponse('Order not found', { status: 404 });
    }

    console.log('Order found:', order._id);
    console.log('Stripe keys configured:', !!process.env.STRIPE_SECRET_KEY);

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    console.log('Base URL:', baseUrl);
    
    const successUrl = `${baseUrl}/account/orders/${orderId}?payment=success`;
    const cancelUrl = `${baseUrl}/cart?payment=cancelled`;
    
    console.log('Success URL:', successUrl);
    console.log('Cancel URL:', cancelUrl);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `${item.color}, ${item.size}`,
            // Convert relative image path to absolute URL
            images: item.image.startsWith('http') 
              ? [item.image] 
              : [`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${item.image}`],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `http://localhost:3000/account/orders/${orderId}?payment=success`,
      cancel_url: `http://localhost:3000/cart?payment=cancelled`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    console.log('Checkout session created:', checkoutSession.id);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500 }
    );
  }
}
