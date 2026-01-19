'use server'
import { OrderItem, ShippingAddress } from "@/types";
import { AVAILABLE_DELIVERY_DATES, PAGE_SIZE } from "../constants";
import { formatError, round2 } from "../utils";
import { connectToDatabase } from "../db";
import { auth } from "@/auth";
import { OrderInputSchema } from "../validator";
import Order, { IOrder } from "../db/models/order.model";
import { Cart } from "@/types";
import { paypal } from "../paypal";
import { sendPurchaseReceipt } from "@/emails";
import { revalidatePath } from "next/cache";


// CREATE
export const createOrder = async (clientSideCart: Cart) => {
  try {
    console.log('Creating order with cart:', clientSideCart);
    await connectToDatabase();
    const session = await auth();
    if (!session) {
      console.log('No session found');
      throw new Error('No session');
    }
    // recalculate price an delivery on the server
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    );
    console.log('Order created successfully:', createdOrder);
    return {
      success: true,
      message: 'Order created successfully',
      data: { orderId: createdOrder._id.toString() },
    };
  } catch (error) {
    console.error('Order creation error:', error);
    return { success: false, error: formatError(error) };
  }
};

export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  console.log('Input cart:', JSON.stringify(clientSideCart, null, 2));
  console.log('UserId:', userId);
  
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  };

  console.log('Cart after calculation:', JSON.stringify(cart, null, 2));

  // Temporarily bypass validation to debug
  console.log('Bypassing validation for debugging');
  const order = {
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    taxPrice: cart.taxPrice,
    shippingPrice: cart.shippingPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  };
  console.log('Order data without validation:', order);
  
  try {
    console.log('Attempting to validate order data:', JSON.stringify(order, null, 2));
    const validatedOrder = OrderInputSchema.parse(order);
    console.log('Order validation successful:', validatedOrder);
    console.log('Attempting to create order in MongoDB...');
    const createdOrder = await Order.create(validatedOrder);
    console.log('Order created successfully:', createdOrder);
    return createdOrder;
  } catch (error) {
    console.error('Order creation failed:', error);
    throw error; // Re-throw to maintain error flow
  }
};

export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectToDatabase();
  const order = await Order.findById(orderId);
  return JSON.parse(JSON.stringify(order));
}

export async function createPayPalOrder(orderId: string) {
  console.log('createPayPalOrder called with orderId:', orderId);
  await connectToDatabase();
  try {
    const order = await Order.findById(orderId);
    console.log('Found order:', order ? 'YES' : 'NO');
    if (order) {
      console.log('Order total price:', order.totalPrice);
      const paypalOrder = await paypal.createOrder(order.totalPrice);
      console.log('PayPal order response:', paypalOrder);
      if (!paypalOrder || !paypalOrder.id) {
        throw new Error('Failed to create PayPal order');
      }
      order.paymentResult = {
        id: paypalOrder.id,
        email_address: paypalOrder.payer?.email_address || '',
        status: paypalOrder.status || '',
        pricePaid: 0,
      };
      await order.save();
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  await connectToDatabase();
  try {
    const order = await Order.findById(orderId).populate('user', 'email');
    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Payment not approved');
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    };
    await order.save();
    await sendPurchaseReceipt({ order });
    revalidatePath(`/account/orders/${orderId}`);
    return {
      success: true,
      message: 'Payment approved successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  console.log('Calc inputs - itemsPrice:', itemsPrice, 'shippingAddress:', shippingAddress, 'deliveryDateIndex:', deliveryDateIndex);

  const deliveryDate = 
  AVAILABLE_DELIVERY_DATES[deliveryDateIndex === undefined 
    ? AVAILABLE_DELIVERY_DATES.length - 1
    : deliveryDateIndex];

  console.log('Selected delivery date:', deliveryDate);

  const shippingPrice = 
  !shippingAddress || !deliveryDate
    ? 0
    : deliveryDate.freeShippingMinPrice > 0 &&
    itemsPrice >= deliveryDate.freeShippingMinPrice
      ? 0
      : deliveryDate.shippingPrice;

  console.log('Calculated shippingPrice:', shippingPrice);

  const taxPrice = round2(itemsPrice * 0.2);
  const totalPrice = round2(
    itemsPrice +
     shippingPrice +
      taxPrice
  );

  return {  
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,    
    shippingPrice,
    taxPrice,
    totalPrice,
    
  
  };
};

// GET
export async function getMyOrders({
  limit,
  page,
}: {
  limit?: number;
  page: number;
}) {
  limit = limit || PAGE_SIZE;
  await connectToDatabase();
  const session = await auth();
  if (!session) {
    throw new Error('No session');
  }
  const skipAmount = (Number(page) - 1) * limit;
  const orders = await Order.find({
    user: session?.user?.id,
  })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit);
  const ordersCount = await Order.countDocuments({ user: session?.user?.id });

  return {
    data: JSON.parse(JSON.stringify(orders)) as IOrder[],
    totalPages: Math.ceil(ordersCount / limit),
  };
}