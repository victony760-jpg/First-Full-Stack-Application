import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from './ShopContext';

const ShopContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const exchangeRate = 1400;

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  // Default site-wide currency
  const [currency, setCurrency] = useState('usd');
  const [delivery_fee, setDelivery_fee] = useState(15);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Load saved currency on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency')
    if (savedCurrency) {
      setCurrency(savedCurrency)
      setCurrencySymbol(savedCurrency === 'ngn' ? '₦' : '$')
      setDelivery_fee(savedCurrency === 'ngn' ? 2500 : 15)
    }
  }, [])

  // Save currency when it changes
  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  // Explicit global currency switcher - Only run when user explicitly changes currency
  const updateCurrencyByCountry = (country) => {
    const isNigeria = country.toLowerCase().includes('nigeria');
    const newCurrency = isNigeria ? 'ngn' : 'usd';
    setCurrency(newCurrency);
    setCurrencySymbol(isNigeria ? '₦' : '$');
    setDelivery_fee(isNigeria ? 2500 : 15);
    localStorage.setItem('currency', newCurrency);
  };

  const getProductData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    getProductData();
  }, [getProductData]);

  const getUserCart = useCallback(async (token) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
      if (response.data.success) {
        setCart(response.data.cartData);
      }
    } catch (error) {
      console.error('Error fetching user cart:', error);
    }
  }, [backendUrl]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, [getUserCart]);

  useEffect(() => {
    if (token) getUserCart(token);
  }, [token, getUserCart]);

  const addToCart = async (itemId, size) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }

    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cart);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) cartData[itemId][size] += 1;
      else cartData[itemId][size] = 1;
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCart(cartData);
    toast.success('Product added to cart');

    try {
      await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cart) {
      for (const item in cart[items]) {
        if (cart[items][item] > 0) totalCount += cart[items][item];
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (!token) return;
    let cartData = structuredClone(cart);
    cartData[itemId][size] = quantity;
    setCart(cartData);

    try {
      await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
    } catch (error) {
      toast.error('Failed to update cart on server');
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cart) {
      let itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const item in cart[items]) {
        if (cart[items][item] > 0) {
          let price = itemInfo.price;
          if (currency === 'ngn') price = price * exchangeRate;
          totalAmount += price * cart[items][item];
        }
      }
    }
    return totalAmount;
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setCart({});
    localStorage.removeItem('cart');
    localStorage.removeItem('currency');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    products,
    loading,
    currency,
    delivery_fee,
    currencySymbol,
    exchangeRate,
    updateCurrencyByCountry,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cart,
    setCart,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    orders,
    setOrders,
    backendUrl,
    setToken,
    token,
    logout
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;