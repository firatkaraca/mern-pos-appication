import Headers from "../components/header/Header";
import StatisticCard from "../components/statisctics/StatisticCard";
import { useEffect, useState } from "react";
import { Line, Pie } from '@ant-design/charts';
import { Spin } from "antd";

const StatisticPage = () => {
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const user = JSON.parse(localStorage.getItem("posUser"));

    useEffect(() => {
        getBills();
        getProducts();
    }, []);

    const getBills = async () => {
        try {
            const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/bills/get-all");
            const bills = await res.json();
            setData(bills);
        }
        catch (error) {
            console.log(error);
        }
    }

    const getProducts = async () => {
        try {
            const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/products/get-all");
            const products = await res.json();
            setProducts(products);
        }
        catch (error) {
            console.log(error);
        }
    }

    const configLine = {
        data,
        height: 400,
        xField: 'customerName',
        yField: 'subTotal',
    };

    const configPie = {
        data: data,
        angleField: 'subTotal',
        colorField: 'customerName',
        innerRadius: 0.6,
        label: {
            text: 'subTotal',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
        annotations: [
            {
                type: 'text',
                style: {
                    text: 'Toplam\nDeğer',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 40,
                    fontStyle: 'bold',
                },
            },
        ],
    };

    const totalAmount = () => {
        const amount = data.reduce((total, item) => item.totalAmount + total, 0);
        return `${amount.toFixed(2)} ₺`;
    }

    return (
        <>
            <Headers />
            <div className="px-6 md:pb-0 pb-20">
                <h1 className="text-4xl font-bold text-center mb-4">İstatistiklerim</h1>

                {data.length > 0 ?
                    <div className="statistic-section">
                        <h2 className="text-lg flex items-center gap-1">
                            <span>Hoş geldin</span>
                            <span className="text-green-700 font-bold text-xl">{user.username}</span>
                        </h2>

                        <div className="statistic-cards grid xl:grid-cols-4 md:grid-cols-2 my-10 md:gap-10 gap-4">
                            <StatisticCard
                                title={"Toplam Müşteri"}
                                amount={data?.length}
                                img={"images/user.png"}
                            />

                            <StatisticCard
                                title={"Toplam Kazanç"}
                                amount={totalAmount()}
                                img={"images/money.png"}
                            />

                            <StatisticCard
                                title={"Toplam Satış"}
                                amount={data?.length}
                                img={"images/sale.png"}
                            />

                            <StatisticCard
                                title={"Toplam Ürün"}
                                amount={products?.length}
                                img={"images/product.png"}
                            />
                        </div>

                        <div className="flex justify-between gap-10 lg:flex-row flex-col items-center">
                            <div className="lg:w-1/2 lg:h-80 h-72">
                                <Line {...configLine} />
                            </div>
                            <div className="lg:w-1/2 lg:h-80 h-72">
                                <Pie {...configPie} />
                            </div>
                        </div>


                    </div> : <Spin size="large" className="absolute top-1/2 left-1/2" />
                }
            </div>
        </>
    )
}

export default StatisticPage;