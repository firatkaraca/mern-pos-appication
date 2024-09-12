import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { Carousel } from 'antd';
import AuthCarousel from '../../components/auth/AuthCarousel';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/auths/register", {
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            if (res.status === 200) {
                setLoading(false);
                message.success("Kayıt işlemi başarılı");
                navigate("/login");
            }
        }
        catch (error) {
            message.error("Bir şeyler yanlış gitti");
            console.log(error);
        }
    }

    return (
        <div className='h-screen'>
            <div className='flex justify-between h-full'>
                <div className='xl:px-20 px-10 flex flex-col h-full w-full justify-center relative'>
                    <h1 className='text-center text-5xl font-bold mb-2'>LOGO</h1>
                    <Form layout='vertical' onFinish={onFinish}>
                        <Form.Item
                            label="Kullanıcı Adı"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Kullanıcı Adı Alanı Boş Bırakılamaz"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Email Alanı Boş Bırakılamaz"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Şifre"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Şifre Alanı Boş Bırakılamaz"
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Şifre Tekrar"
                            name="passwordAgain"
                            dependencies={["password"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Şifre Tekrar Alanı Boş Bırakılamaz"
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(
                                            new Error(
                                                "Şifreler aynı olmak zorunda!"
                                            )
                                        )
                                    }
                                })
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loading} type='primary' htmlType='submit' className='w-full' size='large'>
                                Kaydol
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className='flex justify-center gap-2 absolute left-0 bottom-5 w-full'>
                        Bir hesabınız var mı?
                        <Link className='text-blue-600' to="/login">Şimdi giriş yap</Link>
                    </div>
                </div>
                <div className='xl:w-4/6 lg:w-3/5 md:w-1/2 md:flex hidden bg-[#6C63FF] flex items-center'>
                    <div className='w-full'>
                        <Carousel className='h-full px-6' autoplay>
                            <AuthCarousel
                                img="/images/responsive.svg"
                                title="Responsive"
                                description="Tüm cihaz boyutlarıyla uyumluluk"
                            />

                            <AuthCarousel
                                img="/images/statistic.svg"
                                title="İstatistikler"
                                description="Geniş Tutulan İstatistikler"
                            />

                            <AuthCarousel
                                img="/images/customer.svg"
                                title="Müşteri Memnuniyeti"
                                description="Deneyim Sonunda Üründen Memnun Müşteriler"
                            />

                            <AuthCarousel
                                img="/images/admin.svg"
                                title="Yönetici Paneli"
                                description="Tek Yerden Yönetim"
                            />
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;