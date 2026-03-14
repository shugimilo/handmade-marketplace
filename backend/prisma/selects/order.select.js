import { basicUserInfo, basicItemInfo, basicOrderInfo } from "./basic.select.js"

export const userAsSellerOrderInfo = {
    ...basicOrderInfo,
    status: true,
    orderItems: {
        select: {
            id: true,
            itemId: true,
            item: {
                select: basicItemInfo
            },
            priceAtPurchase: true,
            currencyAtPurchase: true,
            quantity: true
        }
    },
    buyerId: true,
    buyer: {
        select: basicUserInfo
    }
}

export const userAsBuyerOrderInfo = {
    ...basicOrderInfo,
    status: true,
    orderItems: {
        select: {
            id: true,
            itemId: true,
            item: {
                select: {
                    ...basicItemInfo,
                    author: {
                        select: basicUserInfo
                    }
                }
            },
            priceAtPurchase: true,
            currencyAtPurchase: true,
            quantity: true
        }
    }
}