# Feature: เพิ่มวัตถุดิบในเมนูจากคลังอาหาร

## 📋 คำอธิบาย Feature

Feature นี้ช่วยให้ผู้ใช้สามารถเพิ่มวัตถุดิบต่างๆ จากคลังอาหารที่บันทึกไว้แล้ว เข้าไปในเมนูอาหารที่บันทึก โดยระบบจะคำนวณค่าโภชนาการแบบเรียลไทม์และอัปเดตข้อมูลโภชนาการของเมนูโดยอัตโนมัติ

## ✨ คุณสมบัติหลัก

### 1. การเพิ่มวัตถุดิบ
- เลือกวัตถุดิบจากคลังอาหารที่มีอยู่
- ระบุปริมาณที่ต้องการสำหรับแต่ละวัตถุดิบ
- ดูการคำนวณโภชนาการแบบเรียลไทม์
- แสดงสรุปโภชนาการรวมก่อนบันทึก

### 2. การจัดการวัตถุดิบ
- แก้ไขปริมาณวัตถุดิบในเมนูที่มีอยู่แล้ว
- ลบวัตถุดิบออกจากเมนู
- ระบบจะปรับปรุงค่าโภชนาการโดยอัตโนมัติ

### 3. การแสดงผล
- แสดงรายการวัตถุดิบในเมนูพร้อมปริมาณ
- แสดงค่าโภชนาการของแต่ละวัตถุดิบ
- แสดงสรุปค่าโภชนาการรวมของเมนู

## 🚀 วิธีการใช้งาน

### ขั้นตอนที่ 1: เตรียมข้อมูล
1. ไปที่แท็บ "📦 คลังอาหาร" 
2. เพิ่มอาหารต่างๆ พร้อมข้อมูลโภชนาการ
3. ไปที่แท็บ "💾 เมนูที่บันทึก"

### ขั้นตอนที่ 2: เพิ่มวัตถุดิบ
1. เลือกเมนูที่ต้องการเพิ่มวัตถุดิบ
2. กดปุ่ม "🥄 เพิ่มวัตถุดิบ"
3. เลือกวัตถุดิบจากคลังอาหาร (ฝั่งซ้าย)
4. ระบุปริมาณที่ต้องการ
5. ดูการคำนวณโภชนาการในส่วน "วัตถุดิบที่เลือก" (ฝั่งขวา)
6. กด "เพิ่มลงในเมนู" เพื่อบันทึก

### ขั้นตอนที่ 3: จัดการวัตถุดิบ
- **แก้ไขปริมาณ**: กดปุ่ม ✏️ ข้างชื่อวัตถุดิบ
- **ลบวัตถุดิบ**: กดปุ่ม ✕ ข้างชื่อวัตถุดิบ

## 🛠️ การพัฒนา Technical Details

### ไฟล์ที่เกี่ยวข้อง

1. **index.html**
   - เพิ่ม Modal สำหรับเลือกวัตถุดิบ
   - UI responsive design

2. **js/recipes.js**
   - ฟังก์ชัน `addIngredientsToRecipe()` - เปิด modal เลือกวัตถุดิบ
   - ฟังก์ชัน `selectFood()` - เลือกอาหารจากคลัง
   - ฟังก์ชัน `saveIngredientsToRecipe()` - บันทึกวัตถุดิบลงเมนู
   - ฟังก์ชัน `updateRecipeNutrition()` - คำนวณโภชนาการรวม
   - ฟังก์ชัน `editIngredientAmount()` - แก้ไขปริมาณ
   - ฟังก์ชัน `removeIngredientFromRecipe()` - ลบวัตถุดิบ

3. **js/app.js**
   - เรียกใช้ `initIngredientsModal()` ในการ initialize

### โครงสร้างข้อมูล

```javascript
// Recipe Object
{
  id: number,
  name: string,
  instructions: string,
  ingredients: [
    {
      id: number,           // ID ของอาหารในคลัง
      name: string,         // ชื่อวัตถุดิบ
      amount: number,       // ปริมาณ
      unit: string,         // หน่วย
      calories: number,     // พลังงาน (คำนวณตามปริมาณ)
      protein: number,      // โปรตีน (คำนวณตามปริมาณ)
      carbs: number,        // คาร์โบไฮเดรต (คำนวณตามปริมาณ)
      fat: number          // ไขมัน (คำนวณตามปริมาณ)
    }
  ],
  nutrition: {
    calories: string,       // รวมพลังงาน "xxx kcal"
    protein: string,        // รวมโปรตีน "xxx g"
    carbs: string,         // รวมคาร์บ "xxx g"  
    fat: string           // รวมไขมัน "xxx g"
  },
  savedAt: string
}
```

## 🧪 การทดสอบ

### ไฟล์ทดสอบ
- `test-ingredients-feature.html` - หน้าสำหรับทดสอบ feature
- สร้างข้อมูลทดสอบอัตโนมัติ (คลังอาหาร + เมนูตัวอย่าง)

### วิธีทดสอบ
1. เปิดไฟล์ `test-ingredients-feature.html`
2. กด "สร้างข้อมูลทดสอบ"
3. เปิดแอปหลัก (`index.html`)
4. ทดสอบการเพิ่ม/แก้ไข/ลบ วัตถุดิบ

## 🔄 Git Workflow

```bash
# สร้าง branch ใหม่
git checkout -b feature/add-ingredients-to-recipe

# ทำการพัฒนา feature

# Commit การเปลี่ยนแปลง
git add .
git commit -m "feat: Add ingredients to recipe from food database

- Add modal for selecting ingredients from food database
- Implement real-time nutrition calculation
- Add edit/remove ingredient functionality
- Update recipe nutrition summary automatically
- Add responsive design for mobile compatibility
- Create test file with sample data"

# Push ไปยัง remote repository
git push origin feature/add-ingredients-to-recipe
```

## 📚 Dependencies

- Tailwind CSS (สำหรับ styling)
- JavaScript ES6+ 
- Local Storage API (สำหรับเก็บข้อมูล)

## 💡 Future Enhancements

1. **การค้นหาและกรองวัตถุดิบ**
   - เพิ่ม search box ในการเลือกวัตถุดิบ
   - กรองตามประเภทอาหาร

2. **การคำนวณต่อหน่วยบริโภค**
   - ระบุจำนวนหน่วยบริโภคของเมนู
   - แสดงโภชนาการต่อหน่วยบริโภค

3. **การ Import/Export สูตรอาหาร**
   - แชร์สูตรอาหารกับผู้อื่น
   - นำเข้าสูตรจากแหล่งข้อมูลภายนอก

4. **การคำนวณต้นทุนอาหาร**
   - เพิ่มราคาต่อหน่วยในคลังอาหาร
   - คำนวณต้นทุนของเมนู
