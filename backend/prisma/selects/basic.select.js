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