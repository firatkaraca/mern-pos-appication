import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Carousel, message } from 'antd';
import { Link } from 'react-router-dom';
import AuthCarousel from '../../components/auth/AuthCarousel';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(process.env.REACT_APP_SERVER_URL + "/api/auths/login", {
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
            const user = await res.json();

            if (res.status === 200) {
                localStorage.setItem("posUser", JSON.stringify({
                    username: user.username,
                    email: user.email
                }))
                message.success("Giriş işlemi başarılı.");
                navigate("/");
            }
            else if (res.status === 404) {
                message.error("Kullanıcı bulunamadı.");
            }
            else if (res.status === 403) {
                message.error("Şifre yanlış!");
            }
            setLoading(false);
        }
        catch (error) {
            message.error("Bir şeyler yanlış gitti");
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div className='h-screen'>
            <div className='flex justify-between h-full'>
                <div className='xl:px-20 px-10 flex flex-col h-full w-full justify-center relative'>
                    <h1 className='text-center text-5xl font-bold mb-2'>LOGO</h1>
                    <Form onFinish={onFinish} layout='vertical' initialValues={{ remember: false }}>

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

                        <Form.Item name={"remember"} valuePropName='checked'>
                            <div className='flex justify-between items-center'>
                                <Checkbox>Remember me</Checkbox>
                                <Link>Forgot Password?</Link>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loading} type='primary' htmlType='submit' className='w-full' size='large'>
                                Giriş Yap
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className='flex justify-center gap-2 absolute left-0 bottom-5 w-full'>
                        Henüz bir hesabınız yokmu?
                        <Link className='text-blue-600' to="/register">Şimdi kaydol</Link>
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

export default Login