import { Modal, Form, Input, Button, Select, message } from "antd"

const Add = ({ isAddModalOpen, setIsAddModalOpen, categories, products, setProducts }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        try {
            fetch(process.env.REACT_APP_SERVER_URL + "/api/products/add-product", {
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            message.success("Ürün başarıyla eklendi.");
            form.resetFields();
            setProducts([
                ...products,
                {
                    ...values,
                    _id: Math.random(),
                    price: Number(values.price)
                }
            ]);
            setIsAddModalOpen(false)
        }
        catch (error) {
            console.log(error);
        }
    }

    const selectOptions = categories?.map(item => {
        return { value: item.title, label: item.label }
    });

    return (
        <Modal
            title="Yeni ürün ekle"
            open={isAddModalOpen}
            footer={false}
            onCancel={() => setIsAddModalOpen(false)}>
            <Form layout='vertical' onFinish={onFinish} form={form}>
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
                    <Button type='primary' htmlType='submit'>Oluştur</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Add;