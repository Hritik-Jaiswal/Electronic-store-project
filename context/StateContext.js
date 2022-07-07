import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;    

    // * To add items to cart
    const onAdd =(product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id);
        
        setTotalPrice( prevTotalPrice => prevTotalPrice + product.price * quantity)
        setTotalQuantities( prevTotalQuantities => prevTotalQuantities + quantity)

        if(checkProductInCart){

            const updatedCartItems = cartItems.map( cartProduct => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCartItems)
        } else{
            product.quantity = quantity;
            
            setCartItems([ ...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to cart.`)
    }

    // * To remove items from cart
    const onRemove = product => {
        foundProduct = cartItems.find(cartItem => cartItem._id === product._id);
        const newCartItems = cartItems.filter(item => item._id !== product._id);

        setTotalPrice( prevTotalPrice => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities( prevTotalQuant => prevTotalQuant - foundProduct.quantity)
        setCartItems(newCartItems)
    }


    // * To make changes in cart page

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id)
    
        if(value === 'inc') {
          newCartItems.splice(index, 0, { ...foundProduct, quantity: foundProduct.quantity + 1 });
          setCartItems(newCartItems);
          setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
          setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if(value === 'dec') {
          if (foundProduct.quantity > 1) {
            newCartItems.splice(index, 0, { ...foundProduct, quantity: foundProduct.quantity - 1 });
            setCartItems(newCartItems);
            setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
          }
        }
      }
    
    // * To increase quantity in cart
    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }
    
    // * To decrease quantity in cart
    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;

            return prevQty - 1
        });
    }

    return (
        <Context.Provider value={{ onRemove, showCart, cartItems, setCartItems, totalPrice, setTotalPrice, totalQuantities, setTotalQuantities, qty, incQty, decQty, onAdd, setShowCart, toggleCartItemQuantity }}>
            {children}
        </Context.Provider>
    )
    
}

export const useStateContext = () => useContext(Context);


