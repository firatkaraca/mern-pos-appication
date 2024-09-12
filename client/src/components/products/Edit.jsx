import { Button, Form, Input, message, Modal, Table, Select } from "antd";
import { useState, useEffect } from "react";

const Edit = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState({});
    const [form] = Form.useForm();

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

    const onFinish = (values) => {
        try {
            fetch(process.env.REACT_APP_SERVER_URL + "/api/products/update-product", {
                method: "PUT",
                body: JSON.stringify({ ...values, productId: editingItem._id }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            message.success("Ürün başarıyla güncellendi.");
            setProducts(products.map(item => {
                if (item._id === editingItem._id) {
                    return { ...item, title: values.title }
                }
                return item;
            }))
        }
        catch (error) {
            message.error("Bir şeyler yanlış gitti.")
            console.log(error);
        }
    }

    const deleteCategory = (id) => {
        if (window.confirm("Emin misin?")) {
            try {
                fetch(process.env.REACT_APP_SERVER_URL + "/api/products/delete-product", {
                    method: "DELETE",
                    body: JSON.stringify({ productId: id }),
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                });
                message.success("Ürün başarıyla silindi.");
                setProducts(products.filter(item => item._id !== id))
            }
            catch (error) {
                message.error("Bir şeyler yanlış gitti");
                console.log(error);
            }
        }
    }

    const selectOptions = categories.map(item => {
        return { value: item.title, label: item.label }
    });

    const columns = [
        {
            title: "Ürün adı",
            width: "8%",
            dataIndex: "title",
        },
        {
            title: "Ürün görseli",
            width: "8%",
            dataIndex: "img",
            render: (_, record) => {
                return <img className="w-full h-20 object-cover" src={record.img} alt="" />
            }
        },
        {
            title: "Ürün fiyatı",
            width: "8%",
            dataIndex: "price",
        },
        {
            title: "Kategori",
            width: "8%",
            dataIndex: "category",
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => {
                return (
                    <div>
                        <Button
                            type="link"
                            className="pl-0"
                            onClick={() => {
                                console.log(record)
                                setEditingItem(record);
                                setIsEditModalOpen(true);
                            }}>
                            Düzenle
                        </Button>

                        <Button
                            type="link"
                            onClick={() => deleteCategory(record._id)}
                            danger>
                            Sil
                        </Button>
                    </div>
                )
            }
        }
    ];

    return (
        <>
            <Table
                scroll={{ x: 1000, y: 550 }}
                bordered
                dataSource={products}
                columns={columns}
                rowKey={"_id"}
            />

            <Modal
                title="Yeni ürün ekle"
                open={isEditModalOpen}
                footer={false}
                onCancel={() => setIsEditModalOpen(false)}>
                <Form layout='vertical' onFinish={onFinish} form={form} initialValues={editingItem}>
                    <Form.Item
                        name="title"
                        label="Ürün adı"
                        rules={[{ required: true, message: "Ürün adı alanı boş geçilemez!" }]}>
                        <Input placeholder="Ürün adı giriniz." />
                    </Form.Item>

                    <Form.Item
                        name="img"
                        label="Ürün görseli"
                        rules={[{ required: true, message: "Ürün görseli alanı boş geçilemez!" }]}>
                        <Input placeholder="Ürün görseli giriniz." />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Ürün fiyatı"
                        rules={[{ required: true, message: "Ürün fiyatı alanı boş geçilemez!" }]}>
                        <Input placeholder="Ürün fiyatı giriniz." />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Kategori seç"
                        rules={[{ required: true, message: "Kategori alanı boş geçilemez!" }]}>
                        <Select
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="title"
                            options={selectOptions}
                        />
                    </Form.Item>

                    <Form.Item className='flex justify-end mb-0'>
                        <Button type='primary' htmlType='submit'>Güncelle</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Edit;