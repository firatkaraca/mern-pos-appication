import React from 'react'
import { Button, message } from 'antd';
import { ClearOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCart, increase, decrease, reset } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartTotals = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);

    return (
        <div className="cart h-full flex flex-col max-h-[calc(100vh_-_120px)]">
            <h2 className="bg-blue-600 text-center py-4 text-white font-bold tracking-wide">
                Sepetteki ürünler
            </h2>
            <ul className="cart-items px-2 flex flex-col gap-y-3 py-2 overflow-y-auto">

                {
                    cart.cartItems.length > 0 ?
                        cart.cartItems.map((item) => (
                            <li key={item._id} className="cart-item flex justify-between">
                                <div className='flex items-center'>
                                    <img
                                        onClick={() => {
                                            dispatch(deleteCart(item));
                                            message.success("Ürün sepetten silindi.");
                                        }}
                                        className='w-16 h-16 object-cover cursor-pointer'
                                        src={item.img}
                                        alt=""
                                    />
                                    <div className='flex flex-col ml-2'>
                                        <b>{item.title}</b>
                                        <span>{item.price}₺ x {item.quantity}</span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <Button
                                        onClick={() => dispatch(increase(item))}
                                        icon={<PlusCircleOutlined />}
                                        type='primary'
                                        className='w-full flex items-center rounded-full'
                                        size='small'
                                    />

                                    <span className='font-bold w-6 text-center'>
                                        {item.quantity}
                                    </span>

                                    <Button
                                        onClick={() => {
                                            if (item.quantity === 1) {
                                                if (window.confirm("Ürün silinsin mi?")) {
                                                    dispatch(decrease(item));
                                                    message.success("Ürün sepetten silindi.");
                                                }
                                            }
                                            if (item.quantity > 1) {
                                                dispatch(decrease(item))
                                            }
                                        }}
                                        icon={<MinusCircleOutlined />}
                                        type='primary'
                                        className='w-full flex items-center rounded-full'
                                        size='small'
                                    />
                                </div>
                            </li>
                        )).reverse() :
                        <div>Sepette hiç ürün yok...</div>
                }
            </ul>


            <div className="cart-totals mt-auto">
                <div className='border-t border-b'>
                    <div className="flex justify-between p-2">
                        <b>Ara Toplam</b>
                        <span>{cart.total.toFixed(2)}₺</span>
                    </div>
                    <div className="flex justify-between p-2">
                        <b>KDV %{cart.tax}</b>
                        <span className='text-red-700'>+{((cart.total * cart.tax) / 100).toFixed(2)}₺</span>
                    </div>
                </div>

                <div className='border-b mt-4'>
                    <div className="flex justify-between p-2">
                        <b className='text-xl text-green-500'>Genel Toplam</b>
                        <span className='text-xl'>{(cart.total + parseFloat((cart.total * cart.tax) / 100)).toFixed(2)}₺</span>
                    </div>
                </div>

                <div className='py-4 px-2'>
                    <Button
                        disabled={!cart.cartItems.length}
                        type='primary'
                        className='w-full'
                        onClick={() => navigate("/cart")}
                        size='large'>
                        Sipariş Oluştur
                    </Button>

                    <Button
                        disabled={!cart.cartItems.length}
                        onClick={() => {
                            if (window.confirm("Emin misiniz?")) {
                                dispatch(reset());
                                message.success("Sepet başarıyla temizlendi.")
                            }
                        }}
                        icon={<ClearOutlined />}
                        type='primary'
                        className='w-full mt-2 flex items-center'
                        size='large'
                        danger>
                        Temizle
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CartTotals;