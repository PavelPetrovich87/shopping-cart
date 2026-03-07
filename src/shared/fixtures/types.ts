export interface ProductRecord {
    product_id: string;
    name: string;
    description: string;
    category: string;
    collection: string;
    created_at: string;
}

export interface InventoryRecord {
    product_id: string;
    sku: string;
    color: string;
    size: string | null;
    list_price: number;
    discount: number | null;
    discount_percentage: number | null;
    sale_price: number;
    sold: number;
    stock: number;
}

export interface CouponRecord {
    coupon_code: string;
    discount_amount: number | null;
    discount_percentage: number | null;
}

export interface CategoryRecord {
    category_id: string;
    name: string;
    created_at: string;
}

export interface CollectionRecord {
    collection_id: string;
    name: string;
    description: string;
    image_url: string;
    created_at: string;
}

export interface ProductImageRecord {
    product_id: string;
    color: string;
    image_url: string;
}

export interface CartItemRecord {
    product: {
        product_id: string;
        name: string;
    };
    unit: {
        sku: string;
        list_price: number;
        sale_price: number;
        size: string | null;
        color: string;
        image_url: string;
    };
    quantity: number;
    total_list_price: number;
    total_sale_price: number;
    created_at: string;
}

export interface CartRecord {
    cart_id: string;
    items: CartItemRecord[];
    summary: {
        subtotal: number;
        discount: number;
        discount_code: string | null;
        shipping: number;
        total: number;
    };
}
