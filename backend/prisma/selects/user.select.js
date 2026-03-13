import { basicItemInfo, basicUserInfo } from "./basic.select.js"
import { userAsBuyerOrderInfo, userAsSellerOrderInfo } from "./order.select.js"

export const publicUserProfile = {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    createdAt: true,
    bio: true,
    pfpUrl: true,
    items: {
        select: basicItemInfo
    },
    reviews: {
        select: {
            id: true,
            comment: true,
            reviewedOn: true,
            reviewer: {
                select: basicUserInfo
            }
        }
    }
}

export const currentUser = {
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    createdAt: true,
    bio: true,
    pfpUrl: true,
    items: {
        select: basicItemInfo
    },
    buyerOrders: {
        select: userAsBuyerOrderInfo
    },
    sellerOrders: {
        select: userAsSellerOrderInfo
    },
    favorites: {
        select: {
            id: true,
            userId: true,
            itemId: true,
            item: {
                select: basicItemInfo
            },
            favoritedOn: true
        }
    },
    reviews: {
        select: {
            id: true,
            itemId: true,
            item: {
                select: basicItemInfo
            },
            rating: true,
            comment: true,
            reviewedOn: true
        }
    },
    carts: {
        select: {
            id: true,
            items: {
                select: {
                    id: true,
                    quantity: true,
                    item: {
                        select: basicItemInfo
                    }
                }
            }
        }
    },
    shippingAddresses: true
}