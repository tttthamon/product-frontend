
// src/app/product/[id]/page.tsx 

'use client'; 

 

import { useState, useEffect, use } from 'react'; 

import { useRouter } from 'next/navigation'; 

import Link from 'next/link'; 

 

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) { 

  const { id } = use(params); // Next.js 15 ต้องใช้ use() แกะ params 

  const router = useRouter(); 

   

  const [name, setName] = useState(''); 

  const [price, setPrice] = useState(''); 

  const [description, setDescription] = useState(''); 

 

  // 1. ดึงข้อมูลเก่ามาแสดง 

  useEffect(() => { 

    const fetchData = async () => { 

      const res = await fetch(`http://localhost:3000/products/${id}`); 

      if (res.ok) { 

        const data = await res.json(); 

        setName(data.name); 

        setPrice(data.price); 

        setDescription(data.description); 

      } else { 

        alert('ไม่พบสินค้านี้'); 

        router.push('/product'); 

      } 

    }; 

    fetchData(); 

  }, [id, router]); 

 

  // 2. บันทึกข้อมูลที่แก้ไข 

  const handleUpdate = async (e: React.FormEvent) => { 

    e.preventDefault(); 

    try { 

      const res = await fetch(`http://localhost:3000/products/${id}`, { 

        method: 'PATCH', // หรือ PUT ตาม NestJS Config 

        headers: { 'Content-Type': 'application/json' }, 

        body: JSON.stringify({ name, price: Number(price), description }), 

      }); 

 

      if (res.ok) { 

        router.push('/product'); 

      } else { 

        alert('แก้ไขไม่สำเร็จ'); 

      } 

    } catch (error) { 

      alert('Error updating product'); 

    } 

  }; 

 

  return ( 

    <div> 

      <h1>แก้ไขสินค้า (ID: {id})</h1> 

      <form onSubmit={handleUpdate}> 

        <p>ชื่อ: <input type="text" value={name} onChange={e => setName(e.target.value)} required /></p> 

        <p>ราคา: <input type="number" value={price} onChange={e => setPrice(e.target.value)} required /></p> 

        <p>รายละเอียด: <textarea value={description} onChange={e => setDescription(e.target.value)} /></p> 

        <button type="submit">อัปเดต</button> {' '} 

        <Link href="/product">ยกเลิก</Link> 

      </form> 

    </div> 

  ); 

} 

 

