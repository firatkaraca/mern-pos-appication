import { useEffect, useState } from 'react';
import CartTotals from '../components/cart/CartTotals';
import Categories from '../components/categories/Categories';
import Header from '../components/header/Header';
import Products from '../components/products/Products';
import { Spin } from 'antd';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/categories/get-all");
                const data = await res.json();
                setCategories(data);
            }
            catch (error) {
                console.log(error);
            }
        }

        getCategories();
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/get-all");
                const data = await res.json();
                setProducts(data);
            }
            catch (error) {
                console.log(error);
            }
        }

        getProducts();
    }, []);

    return (
        <>
            <Header setSearch={setSearch} />
            {
                (products.length && categories.length) ?
                    <div className="home px-6 flex flex-col md:flex-row justify-between gap-10 md:pb-0 pb-2">
                        <div className="categories overflow-auto max-h-[calc(100vh_-_120px)] pb-6 ">
                            <Categories
                                categories={categories}
                                setCategories={setCategories}
                                products={products}
                                setFiltered={setFiltered}
                            />
                        </div>
                        <div className="products flex-[8] overflow-y-auto max-h-[calc(100vh_-_120px)] pb-10">
                            <Products
                                categories={categories}
                                products={products}
                                setProducts={setProducts}
                                filtered={filtered}
                                search={search}
                            />
                        </div>
                        <div className="cart-wrapper min-w-[300px] md:-mr-[24px] md:-mt-[24px] border">
                            <CartTotals />
                        </div>
                    </div>
                    : <Spin size='large' className='absolute top-1/2 left-1/2' />
            }
        </>
    )
}

export default HomePage;