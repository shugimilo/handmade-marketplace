import { basicUserInfo, basicItemInfo } from "./basic.select.js"

export const orderInfo = {
    id: true,
    placedAt: true,
    items: {
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
    total: true,
    payments: {
        select: {
            id: true,
            status: true
        }
    },
    addressId: true,
    shipTo: {
        select: {
            id: true,
            street: true,
            houseNo: true,
            neighborhood: true,
            city: true
        }
    }
}

export const userAsSellerOrderInfo = {
    ...orderInfo,
    buyerId: true,
    buyer: {
        select: basicUserInfo
    }
}

export const userAsBuyerOrderInfo = {
    ...orderInfo,
    sellerId: true,
    seller: {
        select: basicUserInfo
    }
}