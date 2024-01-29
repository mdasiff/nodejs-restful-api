export const STATUS = ['Active', 'InActive'];
export const STATUS_ACTIVE = 'Active';
export const ORDER_STATUS = [
    'Pending',
    'Confirmed',
    'Canceled',
    'Shipped',
    'Delivered'
];
export const ORDER_STATUS_DEFAULT = 'Pending';
export const ORDER_SOURCE = [
    'example.com'
];
export const ORDER_SOURCE_DEFAULT = 'example.com';
export const PAYMENT_STATUS = [
    'Pending',
    'Confirmed',
    'Canceled',
    'Declined'
];
export const PAYMENT_STATUS_DEFAULT = 'Pending'
export const PAYMENT_METHOD = [
    'Razorpay',
    'Cash on Delivery'
];
export const PAYMENT_METHOD_DEFAULT = 'Cash on Delivery'
export const DISCOUNT_TYPE = [
    'fixed',
    'percentage'
];
export const DISCOUNT_TYPE_DEFAULT = 'fixed';
export const DELIVERY_PREFERENCES = {
    express_delivery: {
        name:'Express Delivery'
    },
    standard_delivery:{
        name: 'Standard Delivery',
        cost:0
    },
    midnight_delivery:{
        name:'Midnight Delivery'
    },
    morning_delivery:{
        name:'Morning Delivery'
    }
}
export const SUPER_ADMIN_STR = 'Super Admin';