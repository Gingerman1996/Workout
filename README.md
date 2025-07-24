# แผนปฏิวัติรูปร่าง 3 เดือน 🏋️‍♂️

เว็บแอปพลิเคชันสำหรับวางแผนการออกกำลังกายและโภชนาการแบบครบวงจร พร้อมผู้ช่วย AI

## ฟีเจอร์หลัก 🌟

- 📅 ตารางการออกกำลังกายแบบ Upper/Lower Split
- 🥗 แผนโภชนาการและการคำนวณแมคโคร
- ☁️ **GitHub Sync** - ซิงค์ข้อมูลข้ามอุปกรณ์ผ่าน GitHub
- 🤖 ผู้ช่วย AI สำหรับ:
  - สร้างสูตรอาหารเพื่อสุขภาพ
  - แนะนำท่าออกกำลังกายทางเลือก
  - ตอบคำถามเกี่ยวกับสุขภาพและการออกกำลังกาย
- 📦 คลังอาหารส่วนตัว พร้อมฟีเจอร์:
  - เพิ่ม/แก้ไข/ลบรายการอาหาร
  - แก้ไขชื่อเมนูอาหารที่บันทึกไว้
  - คำนวณโภชนาการอัตโนมัติ

## การติดตั้งและการใช้งาน 🚀

1. Clone โปรเจค:
   ```bash
   git clone https://github.com/Gingerman1996/Workout.git
   cd Workout
   ```

2. เปิดไฟล์ `index.html` ในเบราว์เซอร์ หรือใช้ Live Server

3. ตั้งค่า Gemini API Key:
   - สร้าง API key จาก [Google AI Studio](https://makersuite.google.com/app/apikey)
   - คลิกปุ่ม "ตั้งค่า API Key" ในเว็บแอป
   - ใส่ API key ของคุณ

4. ตั้งค่า GitHub Sync (ไม่บังคับ):
   - สร้าง Personal Access Token จาก [GitHub Settings](https://github.com/settings/tokens)
   - เลือก scope: `repo` (Full control of private repositories)
   - คลิกปุ่ม "GitHub Sync" ในเว็บแอป
   - ใส่ Username, Repository name และ Personal Access Token
   - เริ่มซิงค์ข้อมูลข้ามอุปกรณ์ได้ทันที

## การใช้งาน AI Assistant 🤖

เว็บแอปนี้ใช้ Gemini API จาก Google สำหรับฟีเจอร์ AI ต่างๆ คุณจำเป็นต้องมี API key ของตัวเอง โดย:
1. API key จะถูกเก็บไว้ใน localStorage ของเบราว์เซอร์เท่านั้น
2. ไม่มีการส่ง API key ไปยังเซิร์ฟเวอร์อื่นๆ
3. คุณสามารถเปลี่ยน API key ได้ตลอดเวลาผ่านปุ่ม "ตั้งค่า API Key"

## การใช้งาน GitHub Sync ☁️

GitHub Sync ช่วยให้คุณซิงค์ข้อมูลระหว่างอุปกรณ์ต่างๆ ได้:

### ข้อมูลที่ซิงค์ได้:
- ฐานข้อมูลอาหาร (Food Database)
- สูตรอาหารที่บันทึก (Saved Recipes)
- ประวัติการคำนวณโภชนาการ

### การรักษาความปลอดภัย:
- Personal Access Token เก็บใน localStorage เท่านั้น
- ข้อมูลถูกเข้ารหัสด้วย UTF-8 และ Base64
- รองรับข้อความภาษาไทยอย่างสมบูรณ์
- ซิงค์อัตโนมัติทุก 3 วินาทีเมื่อมีการเปลี่ยนแปลง

### การใช้งาน:
1. คลิก "GitHub Sync" ในเมนูหลัก
2. ใส่ข้อมูล GitHub (Username, Repository, Token)
3. คลิก "เชื่อมต่อ GitHub" 
4. ระบบจะซิงค์ข้อมูลโดยอัตโนมัติ

## เทคโนโลยีที่ใช้ 💻

- HTML5
- Tailwind CSS
- JavaScript (Vanilla)
- Google Gemini API
- GitHub API v3 (สำหรับ GitHub Sync)
- Local Storage API
- UTF-8 & Base64 Encoding

## หมายเหตุ 📝

โปรเจคนี้เป็นส่วนหนึ่งของการศึกษาและพัฒนาทักษะการเขียนโปรแกรม การใช้งานจริงควรปรึกษาผู้เชี่ยวชาญด้านการออกกำลังกายและโภชนาการ
