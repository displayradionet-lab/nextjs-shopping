import { CartSchema, OrderItemSchema, ProductInputSchema, ShippingAddressSchema } from "@/lib/validator";
import z from "zod";



export type IProductInput = z.infer<typeof ProductInputSchema>;

export type IProductData = IProductInput & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};


export  type Data = {
    products: IProductInput[];
    headerMenus: {
        name: string;
        href: string;
    }[];
    carousel: {
        image: string;
        url: string;
        title: string;
        buttonCaption: string;
        isPublished: boolean;
    }[];
}

export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>