export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Nextjs-Shopping'
// export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const APP_SLOGAN= process.env.NEXT_PUBLIC_APP_SLOGAN ||' Spend less, enjoy more.'
export const APP_DESCRIPTION =
process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A Shop clone built with Next.js, and MongoDB'

export const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_APP_SIZE || 9);

export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
)

export const AVAILABLE_DELIVERY_DATES = [
  {
    name: 'Tomorrow',
    daysToDelivery: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 3 days',
    daysToDelivery: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 5 days',
    daysToDelivery: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 35,
  }
]