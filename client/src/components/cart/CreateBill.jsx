import React from 'react'
import { Form, Input, Modal, Select, Card, Button, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import { reset } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const CreateBill = ({ isModalOpen, setIsModalOpen }) => {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/bills/add-bill", {
                method: "POST",
                body: JSON.stringify({
                    ...values,
                    subTotal: cart.total,
                    tax: ((cart.total * cart.tax) / 100).toFixed(2),
                    totalAmount: (cart.total + (cart.total * cart.tax) / 100).toFixed(2),
                    cartItems: cart.cartItems
                }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (res.status === 200) {
                message.success("Fatura başarıyla oluşturuldu.");
                dispatch(reset());
                navigate("/bills");
            }
        }
        catch (error) {
            message.error("Bir şeyler yanlış gitti.");
            console.log(error);
        }
    }

    return (
        <Modal
            title="Fatura Oluştur"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={false}>
            <Form onFinish={onFinish} layout='vertical'>
                <Form.Item
                    name="customerName"
                    rules={[{ required: true, message: "Müşteri Adı Alanı Boş Geçilemez" }]}
                    label='Müşteri Adı'>
                    <Input placeholder='Bir Müşteri Adı Yazınız' />
                </Form.Item>

                <Form.Item
                    name="customerPhoneNumber"
                    rules={[{ required: true, message: " Telefon Numarası Alanı Boş Geçilemez" }]}
                    label='Tel No'>
                    <Input placeholder='Bir Telefon Numarası Yazınız' maxLength={11} />
                </Form.Item>

                <Form.Item
                    name="paymentMode"
                    rules={[{ required: true, message: "Ödeme Yöntemi Alanı Boş Geçilemez" }]}
                    label='Ödeme Yöntemi'>
                    <Select placeholder="Ödeme Yöntemi Seçiniz">
                        <Select.Option value={"Nakit"}>Nakit</Select.Option>
                        <Select.Option value={"Kredi Kartı"}>Kredi Kartı</Select.Option>
                    </Select>
                </Form.Item>

                <Card>
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
                        htmlType='submit'
                        className="mt-4 w-full"
                        type="primary"
                        size="large">
                        Sipariş Oluştur
                    </Button>
                </Card>
            </Form>
        </Modal>
    )
}

export default CreateBill;