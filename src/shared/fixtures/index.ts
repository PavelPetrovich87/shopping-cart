import type {
    ProductRecord,
    InventoryRecord,
    CouponRecord,
    CategoryRecord,
    CollectionRecord,
    ProductImageRecord,
    CartRecord,
} from './types';

import productsJson from '../../../data/products.json';
import inventoryJson from '../../../data/inventory.json';
import couponsJson from '../../../data/coupons.json';
import categoriesJson from '../../../data/categories.json';
import collectionsJson from '../../../data/collections.json';
import productImagesJson from '../../../data/product-images.json';
import sampleCartJson from '../../../data/sample-cart.json';

export const productsData = productsJson as ProductRecord[];
export const inventoryData = inventoryJson as InventoryRecord[];
export const couponsData = couponsJson as CouponRecord[];
export const categoriesData = categoriesJson as CategoryRecord[];
export const collectionsData = collectionsJson as CollectionRecord[];
export const productImagesData = productImagesJson as ProductImageRecord[];
export const sampleCartData = sampleCartJson as CartRecord;
