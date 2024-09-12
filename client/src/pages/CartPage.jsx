import { Button, Card, Popconfirm, Table, Input, Space, message } from "antd";
import Headers from "../components/header/Header"
import { useRef, useState } from "react";
import CreateBill from "../components/cart/CreateBill";
import { useSelector } from "react-redux";
import { PlusCircleOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";
import { increase, decrease, deleteCart } from "../redux/cartSlice";
import Highlighter from 'react-highlight-words';

const CartPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Ürün görseli',
            dataIndex: 'img',
            key: 'img',
            width: "125px",
            render: (text) => {
                return <img src={text} alt="" className="w-full h-20 object-cover" />
            }
        },
        {
            title: 'Ürün adı',
            dataIndex: 'title',
            key: 'title',
            ...getColumnSearchProps("title")
        },
        {
            title: 'Kategori',
            dataIndex: 'category',
            key: 'category',
            ...getColumnSearchProps("category")
        },
        {
            title: 'Ürün fiyatı',
            dataIndex: 'price',
            key: 'price',
            render: (text) => {
                return <span>{parseFloat(text).toFixed(2)} ₺</span>
            },
            sorter: (a, b) => a.price - b.price
        },
        {
            title: 'Ürün adeti',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) => {
                return (
                    <div className='flex items-center justify-center'>
                        <Button
                            onClick={() => dispatch(increase(record))}
                            icon={<PlusCircleOutlined />}
                            type='primary'
                            className='w-full flex items-center rounded-full'
                            size='small'
                        />

                        <span className='font-bold w-6 text-center'>
                            {record.quantity}
                        </span>

                        <Button
                            onClick={() => {
                                if (record.quantity === 1) {
                                    if (window.confirm("Ürün silinsin mi?")) {
                                        dispatch(decrease(record));
                                        message.success("Ürün sepetten silindi.");
                                    }
                                }
                                if (record.quantity > 1) {
                                    dispatch(decrease(record));
                                }
                            }}
                            icon={<MinusCircleOutlined />}
                            type='primary'
                            className='w-full flex items-center rounded-full'
                            size='small'
                        />
                    </div>
                )
            }
        },
        {
            title: 'Toplam Fiyat',
            render: (_, record) => {
                return <span>{(record.quantity * record.price).toFixed(2)} ₺</span>
            }
        },
        {
            title: 'Action',
            render: (_, record) => {
                return (
                    <Popconfirm
                        onConfirm={() => {
                            dispatch(deleteCart(record));
                            message.success("Ürün sepetten silindi.");
                        }}
                        title="Silmek için emin misiniz?"
                        okText="Evet"
                        cancelText="Hayır"
                    >
                        <Button type="link" danger>Sil</Button>
                    </Popconfirm>
                )
            }
        },
    ];

    return (
        <>
            <Headers />
            <div className="px-6">
                <Table
                    dataSource={cart.cartItems}
                    columns={columns}
                    pagination={false}
                    scroll={{
                        x: 1200,
                        y: 550
                    }}
                    bordered
                />
                <div className="cart-total flex justify-end mt-4">
                    <Card className="w-72">
                        <div className="flex justify-between">
                            <span>Ara Toplam</span>
                            <span>{cart.total.toFixed(2)}₺</span>
                        </div>
                        <div className="flex justify-between my-2">
                            <span>KDV %{cart.tax}</span>
                            <span className="text-red-600">+{((cart.total * cart.tax) / 100).toFixed(2)}₺</span>
                        </div>
                        <div className="flex justify-between">
                            <b>Genel Toplam</b>
                            <b>{(cart.total + parseFloat((cart.total * cart.tax) / 100)).toFixed(2)}₺</b>
                        </div>
                        <Button
                            disabled={!cart.cartItems.length}
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 w-full"
                            type="primary"
                            size="large">
                            Sipariş Oluştur
                        </Button>
                    </Card>
                </div>
            </div>

            <CreateBill
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </>
    )
}

export default CartPage;