import { basicOrderInfo, basicUserInfo } from "./basic.select.js";

export const fullShippingAddressInfo = {
    id: true,
    userId: true,
    user: {
        select: basicUserInfo
    },
    street: true,
    houseNo: true,
    neighborhood: true,
    city: true,
    ordersShipped: {
        select: {
            ...basicOrderInfo,
            status: true
        }
    }
}