import React, { useState, createContext, useContext } from "react";
import { CartItem} from '@/types/types';
type CartItems = {
    [key: string]: CartItem;
}

type CartContextType = {
    cartItems: CartItems;
    addToCart: (name: string, quantity: number, size?: string, flavors?: string, category?: string) => void;
    setQuantityCart: (itemKey: string, quantity: number) => void;
    emptyCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: {children: React.ReactNode}) => {
    const [cartItems, setCartItems] = useState<CartItems>({});

    const addToCart = (name: string, quantity: number, size?: string, flavors?: string, category?: string) => {
        const parts = [name, size, flavors, category].filter(Boolean);
        const itemKey = parts.join('-');
        setCartItems((prevItems) => {
            const existing = prevItems[itemKey];
            if (existing) {
                return {
                    ...prevItems,
                    [itemKey]: {
                        ...existing,
                        qty: Math.max(0, existing.qty + quantity),
                    },
                };
            }
            return {
                ...prevItems,
                [itemKey]: { name, qty: Math.max(0, quantity), size, syrups: flavors , category: category} as CartItem
            };
        });
    };
    const setQuantityCart = (itemKey: string, quantity: number) => {
        setCartItems((prevItems) => {
            const existing = prevItems[itemKey];
            const newQty = Math.max((existing?.qty || 0) + quantity, 0);
            if (newQty === 0) {
                const { [itemKey]: _, ...rest } = prevItems;
                return rest;
            }
            return {
                ...prevItems,
                [itemKey]: { ...existing, qty: newQty }
            };
        });
    }

    const emptyCart = () => {
        setCartItems({});
    };

    return (
        <CartContext.Provider value={{cartItems, addToCart, setQuantityCart, emptyCart}}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context){
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}