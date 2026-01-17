import { OrderItem, ShippingAddress } from "@/types";
import { AVAILABLE_DELIVERY_DATES, FREE_SHIPPING_MIN_PRICE } from "../constants";
import { round2 } from "../utils";

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

  const deliveryDate = 
  AVAILABLE_DELIVERY_DATES[deliveryDateIndex === undefined 
    ? AVAILABLE_DELIVERY_DATES.length - 1
    : deliveryDateIndex];

  const shippingPrice = 
  !shippingAddress || !deliveryDate
    ? undefined
    : deliveryDate.freeShippingMinPrice > 0 &&
    itemsPrice >= deliveryDate.freeShippingMinPrice
      ? 0
      : deliveryDate.shippingPrice;

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

// CREATE
// export const createOrder = async (clientSideCart: Cart) => {
//   try {
//     await connectToDatabase();
//     const session = await auth();
//     if (!session) throw new Error('No session');
//     // recalculate price an delivery on the server
//     const createdOrder = await createOrderFromCart(
//       clientSideCart,
//       session.user.id!
//     );
//     return {
//       success: true,
//       message: 'Order created successfully',
//       data: { orderId: createdOrder._id.toString() },
//     };
//   } catch (error) {
//     return { success: false, error: formatError(error) };
//   }
// };