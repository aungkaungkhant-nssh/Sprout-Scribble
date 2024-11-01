import checkDate from "./check-date";

export const weeklyChart = (cartItems: { date: Date, revenue: number }[]) => {
    return [
        {
            date: "6d ago",
            revenue: cartItems.filter((order) => checkDate(order.date, 6))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: "5d ago",
            revenue: cartItems.filter((order) => checkDate(order.date, 5))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: "4d ago",
            revenue: cartItems.filter((order) => checkDate(order.date, 4))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: "3d ago",
            revenue: cartItems.filter((order) => checkDate(order.date, 3))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: "2d ago",
            revenue: cartItems.filter((order) => checkDate(order.date, 2))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: "1d ago",
            revenue: cartItems.filter((order) => checkDate(order.date, 1))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: "today",
            revenue: cartItems.filter((order) => checkDate(order.date, 0))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
    ]
}