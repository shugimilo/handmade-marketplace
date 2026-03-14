import { basicItemInfo, basicShippingAddressInfo, basicUserInfo } from "./basic.select.js"

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
            itemId: true,
            item: {
                select: basicItemInfo
            },
            rating: true,
            comment: true,
            reviewedOn: true
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
    shippingAddresses: {
        select: basicShippingAddressInfo
    }
}