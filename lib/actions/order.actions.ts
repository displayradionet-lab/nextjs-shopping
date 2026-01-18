'use server'
import { OrderItem, ShippingAddress } from "@/types";
import { AVAILABLE_DELIVERY_DATES } from "../constants";
import { formatError, round2 } from "../utils";
import { connectToDatabase } from "../db";
import { auth } from "@/auth";
import { OrderInputSchema } from "../validator";
import Order from "../db/models/order.model";
import { Cart } from "@/types";


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
    ? undefined
    : deliveryDate.freeShippingMinPrice > 0 &&
    itemsPrice >= deliveryDate.freeShippingMinPrice
      ? 0
      : deliveryDate.shippingPrice;

  console.log('Calculated shippingPrice:', shippingPrice);

  const taxPrice = round2(itemsPrice * 0.2);
  const totalPrice = round2(
    itemsPrice +
     (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
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

