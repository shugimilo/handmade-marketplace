import { basicUserInfo } from "./basic.select.js"

export const itemOwnerView = {
    id: true,
    name: true,
    description: true,
    price: true,
    currency: true,
    authorId: true,
    author: {
        select: basicUserInfo
    },
    pickupAvailable: true,
    deliveryAvailable: true,
    itemImages: true,
    favoritedBy: {
        select: {
            user: {
                select: basicUserInfo
            }
        }
    },
    reviews: {
        select: {
            reviewer: {
                select: basicUserInfo
            }
        }
    }
}

export const publicItemView = {
    id: true,
    name: true,
    description: true,
    price: true,
    currency: true,
    authorId: true,
    author: {
        select: basicUserInfo
    },
    pickupAvailable: true,
    deliveryAvailable: true,
    itemImages: true,
    reviews: {
        select: {
            reviewer: {
                select: basicUserInfo
            }
        }
    }
}