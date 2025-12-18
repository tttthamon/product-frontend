'use client'; 

 

import { useState } from 'react'; 

import { useRouter } from 'next/navigation'; 

import Link from 'next/link'; 

import axios from 'axios'; 

import { useForm, SubmitHandler } from 'react-hook-form'; 

 

// 1. Import Zod และ Resolver 

import { z } from 'zod'; 

import { zodResolver } from '@hookform/resolvers/zod'; 

 

// 2. สร้าง Schema Validation ด้วย Zod 

// ข้อดี: กำหนดเงื่อนไขซับซ้อนได้ง่าย และจัดการเรื่อง Type ให้ด้วย 

const productSchema = z.object({ 

  name: z.string().min(1, 'กรุณากรอกชื่อสินค้า'), // ต้องมีอย่างน้อย 1 ตัวอักษร 

  // Coerce input (e.g. from a text/number input) to a number so resolver types match useForm 

  price: z.number() 

    .min(1, 'กรุณากรอกราคา') 

    .refine((val) => !isNaN(val), 'ราคาต้องเป็นตัวเลข') 

    .nonnegative('ราคาต้องไม่เป็นลบ')   

    .lt(5000, 'ราคาต้องน้อยกว่า 5000'), // เพิ่มเงื่อนไขว่าต้องน้อยกว่า 5000 

  description: z.string().optional(), // optional คือไม่กรอกก็ได้ (ส่งไปเป็น undefined/empty string) 

}); 

 

// 3. สร้าง Type จาก Schema โดยไม่ต้องเขียน Interface เอง (Zod จัดการให้) 

// type นี้จะมีค่าเท่ากับ { name: string; price: number; description?: string } 

type ProductFormInputs = z.infer<typeof productSchema>; 

 

export default function CreateProduct() { 

  const router = useRouter(); 

  const [serverError, setServerError] = useState<string | null>(null); 

 

  // 4. เชื่อม Zod เข้ากับ useForm ผ่าน resolver 

  const { 

    register, 

    handleSubmit, 

    formState: { errors }, 

  } = useForm<ProductFormInputs>({ 

    resolver: zodResolver(productSchema), // <--- จุดสำคัญอยู่ตรงนี้ 

  }); 

 

  const onSubmit: SubmitHandler<ProductFormInputs> = async (data) => { 

    setServerError(null); 

    try { 

      // data.price จะเป็น number ให้แล้ว เพราะเราใช้ z.coerce.number() 

      await axios.post('http://localhost:3000/products', data); 

      router.push('/product'); 

    } catch (error: any) { 

      const msg = error.response?.data?.message; 

      setServerError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error connecting to server'); 

    } 

  }; 

 

  return ( 

    <div> 

      <h1>เพิ่มสินค้าใหม่ (Zod Validation)</h1> 

 

      {serverError && ( 

        <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}> 

          Server Error: {serverError} 

        </div> 

      )} 

 

      <form onSubmit={handleSubmit(onSubmit)}> 

        <p> 

          ชื่อ:  

          {/* 5. ใน JSX จะสะอาดขึ้น ไม่ต้องใส่ rules ยาวๆ ตรงนี้แล้ว */} 

          <input type="text" {...register('name')} /> 

          {errors.name && <span style={{ color: 'red' }}> * {errors.name.message}</span>} 

        </p> 

 

        <p> 

          ราคา:  

          <input type="number" {...register('price')} /> 

          {errors.price && <span style={{ color: 'red' }}> * {errors.price.message}</span>} 

        </p> 

 

        <p> 

          รายละเอียด:  

          <textarea {...register('description')} /> 

          {errors.description && <span style={{ color: 'red' }}> * {errors.description.message}</span>} 

        </p> 

         

        <button type="submit">บันทึก</button> {' '} 

        <Link href="/product">ยกเลิก</Link> 

      </form> 

    </div> 

  ); 

} 

 