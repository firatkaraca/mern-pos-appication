import React, { useRef } from 'react'
import { Button, Modal } from 'antd'
import { useReactToPrint } from 'react-to-print';

const PrintBill = ({ isModalOpen, setIsModalOpen, customer }) => {

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    return (
        <Modal
            title="Fatura Yazdır"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={false}
            width={800}>
            <section className='py-20 bg-black' ref={componentRef}>
                <div className='max-w-5xl mx-auto bg-white px-6'>
                    <article className='overflow-hidden'>
                        <div className="logo my-6">
                            <h2 className='text-4xl font-bold text-slate-700'>LOGO</h2>
                        </div>

                        <div className="bill-details">
                            <div className='grid sm:grid-cols-4 grid-cols-3 gap-12'>
                                <div className='text-md text-slate-500'>
                                    <p className='font-bold text-slate-700'>Fatura Detayı:</p>
                                    <p className='text-green-600'>{customer.customerName}</p>
                                    <p>Fake Street 123</p>
                                    <p>San Javier</p>
                                    <p>CA 1234</p>
                                </div>

                                <div className='text-md text-slate-500'>
                                    <p className='font-bold text-slate-700'>Fatura:</p>
                                    <p>The Boring Company</p>
                                    <p>Tesla Street 007</p>
                                    <p>Frisco</p>
                                    <p>CA 0000</p>
                                </div>

                                <div className='text-md text-slate-500'>
                                    <div>
                                        <p className='font-bold text-slate-700'>Fatura Numarası:</p>
                                        <p>{Math.floor(Math.random() * 100)}</p>
                                    </div>
                                    <div>
                                        <p className='font-bold text-slate-700 mt-2'>Veriliş Tarihi:</p>
                                        <p>{customer.createdAt?.substring(0, 10)}</p>
                                    </div>
                                </div>

                                <div className='text-md text-slate-500 sm:block hidden'>
                                    <div>
                                        <p className='font-bold text-slate-700'>Şartlar:</p>
                                        <p>10 gün</p>
                                    </div>
                                    <div>
                                        <p className='font-bold text-slate-700 mt-2'>Vade Tarihi:</p>
                                        <p>2023-11-21</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bill-table-area mt-8'>
                            <table className='min-w-full divide-y divide-slate-500 overflow-hidden'>
                                <thead>
                                    <tr className='border-b border-slate-200'>
                                        <th scope='col' className='py-3.5 text-left text-sm font-normal text-slate-700 md:pl-0 md:table-cell hidden'>Görsel</th>
                                        <th scope='col' className='py-3.5 text-left text-sm font-normal text-slate-700 md:pl-0 sm:table-cell hidden' >Başlık</th>
                                        <th scope='col' className='py-3.5 text-left text-sm font-normal text-slate-700 md:pl-0 sm:hidden' colSpan={4}>Başlık</th>

                                        <th scope='col' className='py-3.5 text-center text-sm font-normal text-slate-700 md:pl-0 md:table-cell hidden'>Fiyat</th>
                                        <th scope='col' className='py-3.5 text-center text-sm font-normal text-slate-700 md:pl-0 md:table-cell hidden'>Adet</th>
                                        <th scope='col' className='py-3.5 text-end text-sm font-normal text-slate-700 md:pl-0'>Toplam</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        (!!customer.cartItems) && customer.cartItems.map((item) => (
                                            <tr key={item._id} className='border-b border-slate-200'>
                                                <td className='py-4 sm:table-cell hidden'>
                                                    <img
                                                        src={item.img}
                                                        alt=""
                                                        className="w-12 h-12 object-cover border-b"
                                                    />
                                                </td>

                                                <td className='py-4 sm:table-cell hidden'>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{item.title}</span>
                                                        <span className='sm:hidden inline-block text-xs'>Birim Fiyatı {item.price}₺ </span>
                                                    </div>
                                                </td>

                                                <td className='py-4 sm:hidden table-cell' colSpan={4}>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{item.title}</span>
                                                        <span className='sm:hidden inline-block text-xs'>Birim Fiyatı {item.price}₺</span>
                                                    </div>
                                                </td>

                                                <td className='py-4 text-center sm:table-cell hidden'>
                                                    <span>{parseFloat(item.price).toFixed(2)} ₺</span>
                                                </td>

                                                <td className='py-4 sm:text-center text-right sm:table-cell hidden'>
                                                    <span>{item.quantity}</span>
                                                </td>

                                                <td className='py-4 text-end'>
                                                    <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                                                </td>
                                            </tr>
                                        ))
                                    }


                                </tbody>

                                <tfoot>
                                    <tr>
                                        <th className='text-right pt-4 sm:table-cell hidden' colSpan="4" scope='row'>
                                            <span className='font-normal text-slate-700'>Ara Toplam</span>
                                        </th>

                                        <th className='text-left pt-4 sm:hidden' colSpan="4" scope='row'>
                                            <p className='font-normal text-slate-700'>Ara Toplam</p>
                                        </th>

                                        <th className='text-right pt-4' colSpan="4" scope='row'>
                                            <span className='font-normal text-slate-700'>{parseFloat(customer.subTotal).toFixed(2)} ₺</span>
                                        </th>
                                    </tr>

                                    <tr>
                                        <th className='text-right pt-4 sm:table-cell hidden' colSpan="4" scope='row'>
                                            <span className='font-normal text-slate-700'>KDV</span>
                                        </th>

                                        <th className='text-left pt-4 sm:hidden' colSpan="4" scope='row'>
                                            <p className='font-normal text-slate-700'>KDV</p>
                                        </th>
                                        <th className='text-right pt-4' colSpan="4" scope='row'>
                                            <span className='font-norma text-red-600'>+{customer.tax} ₺</span>
                                        </th>
                                    </tr>

                                    <tr>
                                        <th className='text-right pt-4 sm:table-cell hidden' colSpan="4" scope='row'>
                                            <span className='font-normal text-slate-700'>Genel Toplam</span>
                                        </th>

                                        <th className='text-left pt-4 sm:hidden' colSpan="4" scope='row'>
                                            <p className='font-normal text-slate-700'>Genel Toplam</p>
                                        </th>
                                        <th className='text-right pt-4' colSpan="4" scope='row'>
                                            <span className='font-normal text-slate-700'>{parseFloat(customer.totalAmount).toFixed(2)} ₺</span>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className='py-9'>
                                <div className='border-t pt-9 border-slate-400'>
                                    <p className='text-sm font-light text-slate-700'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores eligendi fuga qui sit voluptatibus nam neque perferendis natus excepturi repudiandae consequuntur repellat ea hic accusamus dolore, libero, earum reiciendis esse! Veritatis, tempora nostrum! Vero perferendis tempora eius necessitatibus rem doloremque temporibus fuga distinctio doloribus hic id repudiandae nihil deleniti sequi error at similique iure accusamus, alias minima voluptate. Tempore quo explicabo mollitia architecto magnam esse facilis distinctio repudiandae, voluptas saepe commodi dignissimos, alias perferendis sapiente beatae nam aspernatur ullam dolores eaque molestias aliquam. Id, at! Quas saepe eaque id rem ipsam fugiat, quis perferendis architecto, rerum similique voluptate magnam in.</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <div className='flex justify-end mt-4'>
                <Button type='primary' size='large' onClick={handlePrint}>Yazdır</Button>
            </div>
        </Modal>
    )
}

export default PrintBill;