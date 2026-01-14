import { usePathname } from "next/navigation"
import useCartStore from "./use-cart-store"
import UseDeviceType from "./use-device-type"



const isNotInPaths =(s: string) => 
    !/^\/$|^\/cart$|^\/checkout$|^\/sign-in$|^\/sign-up$|\/^order(\/.*)?$|^\/account(\/.*)?$|^\/admin(\/.*)?$/.test(
        s
    )

    function useCartSidebar() {
        const {cart: {items}} = useCartStore()
        const deviceType = UseDeviceType()
        const currentPath = usePathname()

        return (
            items.length > 0 && deviceType === 'desktop' && isNotInPaths(currentPath)
        )
    }

    export default useCartSidebar;