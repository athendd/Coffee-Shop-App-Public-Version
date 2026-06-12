export interface Product {
    id: string,
    category: string,
    description: string,
    image_url: string,
    name: string,
    price: number,
    rating: number,
    calories: string,
    sizes: SizesMap
}

export type SizesMap = {
    small: SizeInfo,
    medium: SizeInfo,
    large: SizeInfo
};

export type SizeInfo = {
    price: number,
    calories: number
}

export interface ProductCategory{
    id: string,
    select: boolean
}

export type CartItem = {
    name: string;
    qty: number;
    size?: string;
    syrups?: string;
    category?: string;
}

export interface MessageInterface {
    role: string;
    content: string;
    memory?: any;
}