export const basicUserInfo = {
    id: true,
    username: true,
    pfpUrl: true
}

export const basicItemInfo = {
    id: true,
    name: true,
    description: true,
    price: true,
    currency: true,
    categories: {
        select: {
            id: true,
            name: true
        }
    },
    authorId: true,
    itemImages: {
        take: 1,
        select: {
            id: true,
            url: true
        }
    }
}

export const basicOrderInfo = {
    id: true,
    placedAt: true,
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

export const basicShippingAddressInfo = {
    id: true,
    street: true,
    houseNo: true,
    neighborhood: true,
    city: true
}

export const basicCartInfo = {
    id: true,
    cartItems: {
        select: {
            id: true,
            itemId: true,
            quantity: true,
            item: {
                select: basicItemInfo
            }
        }
    }
}