import { useState } from "react";
import ProductItem from "./ProductItem";
import { PlusOutlined, EditOutlined } from "@ant-design/icons"
import Add from "./Add";
import { useNavigate } from "react-router-dom";

const Products = ({ categories, filtered, products, setProducts, search }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="products-wrapper grid gap-4 grid-cols-card">
            {
                filtered.length > 0 && 
                filtered
                .filter((product)=> product.title.toLowerCase().includes(search))
                .map((item) => (
                    <ProductItem key={item._id} item={item} />
                ))
            }

            <div onClick={() => setIsAddModalOpen(true)} className="product-item border hover:shadow-lg cursor-pointer transition-all select-none bg-purple-800 flex justify-center items-center hover:opacity-90 min-h-[180px]">
                <PlusOutlined className="text-white md:text-2xl" />
            </div>

            <div onClick={()=> navigate("/products")} className="product-item border hover:shadow-lg cursor-pointer transition-all select-none bg-orange-800 flex justify-center items-center hover:opacity-90 min-h-[180px]">
                <EditOutlined className="text-white md:text-2xl" />
            </div>


            <Add
                isAddModalOpen={isAddModalOpen}
                setIsAddModalOpen={setIsAddModalOpen}
                products={products}
                setProducts={setProducts}
                categories={categories}
            />

        </div>
    )
}

export default Products;