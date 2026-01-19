import Order from '@/lib/db/models/order.model';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendPurchaseReceipt } from '@/emails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    console.log('Webhook received');
    console.log('Signature exists:', !!signature);
    console.log('Body length:', body.length);
    console.log('Webhook secret configured:', !!process.env.STRIPE_WEBHOOK_SECRET);
    
    // Temporarily skip signature verification for debugging
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature || '',
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (sigError) {
      console.error('Signature verification failed:', sigError);
      console.log('Attempting to parse event without verification...');
      
      // For debugging - parse the event directly
      event = JSON.parse(body) as Stripe.Event;
    }

    console.log('Event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session?.metadata?.orderId;
      
      console.log('Checkout session completed');
      console.log('Order ID from metadata:', orderId);
      console.log('Session ID:', session.id);
      
      if (!orderId) {
        console.error('No order ID in metadata');
        return new NextResponse('No order ID', { status: 400 });
      }
      
      const order = await Order.findById(orderId).populate('user', 'email');
      if (order == null) {
        console.error('Order not found:', orderId);
        return new NextResponse('Order not found', { status: 400 });
      }

      console.log('Order found:', order._id);
      console.log('Current paid status:', order.isPaid);

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: session.id,
        status: 'COMPLETED',
        email_address: session.customer_details?.email || '',
        pricePaid: session.amount_total ? parseFloat((session.amount_total / 100).toFixed(2)) : 0,
      };
      await order.save();
      
      console.log('Order updated to paid');
      
      // Clear cart after successful payment (for Stripe payments)
      // This is handled on the client side when user returns from Stripe
      // but we can also add server-side cart clearing if needed
      
      try {
        console.log('Attempting to send email to order user...');
        const userEmail = (order.user as { email: string }).email;
        console.log('User email:', userEmail);
        
        await sendPurchaseReceipt({ order });
        console.log('✅ Email sent successfully to:', userEmail);
      } catch (error) {
        console.log('❌ Email error:', error instanceof Error ? error.message : String(error));
        // Don't fail the webhook if email fails
      }
      
      return NextResponse.json({ message: 'Order updated to paid successfully' });
    }
    
    console.log('Unhandled event type:', event.type);
    return new NextResponse();
  } catch (error) {
    console.error('Webhook error:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Webhook Error', { status: 400 });
  }
}
