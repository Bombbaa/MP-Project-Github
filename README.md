โปรเจค Manpower allocation & skill Control ใช้ Next.js (React Framework)ในการพัฒนาเว็บไซด์ สามารถอ่าน documentation (เอกสารการใช้งาน Next.js) ได้ที่ (https://nextjs.org/)

เริ่มด้วยเปิด development server ด้วยคำสั่ง
=>
npm run dev

เปิดเมื่อพิมพ์ npm run dev เรียบร้อยให้ไปยัง =>[http://localhost:3000](http://localhost:3000)

1. ภาษาที่ใช้ในการพัฒนาเว็บไซด์จะมีอยู่ทั้งหมดหลักๆ 3 ภาษาด้วยกัน
   1.1 HTML
   1.2 CSS
   1.3 TypeScript

2. โดยโปรเจคนี้ได้มีการใช้ไลบรารี (library) หลายอย่างเพื่อการพัฒนาที่สะดวกและเหมาะสมแก่การใช้งาน
   2.1 Tailwind CSS เพื่อการเขียน CSS ที่ง่ายยิ่งขึ้น
   - โดยสามารถศึกษา Tailwind CSS ได้ที่ => (https://tailwindcss.com/)
     2.2 Material UI ในการสร้าง UI ของเว็บไซด์เช่น ปุ่มกด (Button), กล่องข้อความ (Text Field) และอื่นๆอีกมากมาย
   - โดยสามารถศึกษา Material UI ได้ที่ => (https://mui.com/material-ui/)
     2.3 Chart.js เพื่อสร้าง Visualize Chart (กราฟแสดงข้อมูล)
   - โดยสามารถศึกษา Chart.js ได้ที่ => (https://www.chartjs.org/)
     2.4 Prisma ORM เพื่อใช้การสร้าง table, relationship (RDBMS) และอื่นๆอีกมากมายที่ใช้ในการพัฒนาฐานข้อมูลและ Query ข้อมูลจากฐานข้อมูล
   - โดยสามารถศึกษา Prisma ORM ได้ที่ => (https://www.prisma.io/)
     ที่กล่าวมาข้างต้นคือ library ที่ถูกใช้เป็นส่วนมากในโปรเจค Manpower allocation & skill Control
     นอกจากนี้ยังคงมี library อีกเล็กน้อยที่มีการใช้งานสามารถเช็คได้ที่ไฟล์ package.json ใน folder โปรเจค
