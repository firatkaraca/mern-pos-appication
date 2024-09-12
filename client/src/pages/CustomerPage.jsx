import { useEffect, useState, useRef } from "react";
import { Table, Space, Input, Button, Spin } from "antd";
import Headers from "../components/header/Header"
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const CustomerPage = () => {
    const [billItems, setBillItems] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    useEffect(() => {
        const getBills = async () => {
            try {
                const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/bills/get-all");
                const data = await res.json();
                setBillItems(data);
            }
            catch (error) {
                console.log(error);
            }
        }

        getBills();
    }, [])

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
            title: 'Müşteri adı',
            dataIndex: 'customerName',
            key: 'customerName',
            ...getColumnSearchProps("customerName")
        },
        {
            title: 'Telefon numarası',
            dataIndex: 'customerPhoneNumber',
            key: 'customerPhoneNumber',
            ...getColumnSearchProps("customerPhoneNumber")
        },
        {
            title: 'İşlem tarihi',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (item) => {
                return <span>{item.substring(0, 10)}</span>
            }
        },
    ];

    return (
        <>
            <Headers />

            <div className="px-6">
                <h1 className="text-4xl font-bold text-center mb-4">Müşteriler</h1>
                {
                    billItems.length ?
                        <Table
                            dataSource={billItems}
                            columns={columns}
                            pagination={false}
                            bordered
                            scroll={{
                                x: 1000,
                                y: 550
                            }}
                            rowKey="_id"
                        />
                        : <Spin size="large" className="absolute top-1/2 left-1/2" />
                }
            </div>

        </>
    )
}

export default CustomerPage;