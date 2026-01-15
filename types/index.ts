import { CartSchema, OrderItemSchema, ProductInputSchema, ShippingAddressSchema, UserInputSchema, UserSignInSchema } from "@/lib/validator";
import z from "zod";



export type IProductInput = z.infer<typeof ProductInputSchema>;

export type IProductData = IProductInput & {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
};


export type Data = {
    users: IUserInput[];
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

// user
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>