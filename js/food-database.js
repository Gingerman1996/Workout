// Food Database Management
const FOOD_DB_KEY = 'fitnessPlanFoodDatabase';
const foodModal = document.getElementById('food-modal');
const foodForm = document.getElementById('food-form');
const addFoodBtn = document.getElementById('add-food-btn');
const foodCancelBtn = document.getElementById('food-cancel-btn');
const uploadLabelBtn = document.getElementById('upload-label-btn');
const foodDetailModal = document.getElementById('food-detail-modal');

function getCustomFoods() { 
    return JSON.parse(localStorage.getItem(FOOD_DB_KEY)) || []; 
}

function saveCustomFoods(foods) { 
    localStorage.setItem(FOOD_DB_KEY, JSON.stringify(foods));
    if (typeof autoSyncToGithub === 'function') {
        autoSyncToGithub();
    }
}

function deleteCustomFood(foodId) {
    let foods = getCustomFoods();
    foods = foods.filter(food => food.id !== foodId);
    saveCustomFoods(foods);
    renderCustomFoods();
    showNotification('ลบรายการอาหารเรียบร้อยแล้ว');
}

function showEditFoodModal(foodId) {
    const foods = getCustomFoods();
    const food = foods.find(f => f.id === foodId);
    if (!food) return;

    document.getElementById('food-id').value = food.id;
    document.getElementById('food-modal-title').textContent = 'แก้ไขรายการอาหาร';

    const servingMatch = food.serving.match(/^([\d\.\/]+)\s*(.*)$/);
    if (servingMatch) {
        document.getElementById('food-serving-amount').value = servingMatch[1];
        document.getElementById('food-serving-unit').value = servingMatch[2].trim();
    } else {
        document.getElementById('food-serving-amount').value = 1;
        document.getElementById('food-serving-unit').value = food.serving;
    }

    document.getElementById('food-name').value = food.name;
    document.getElementById('food-calories').value = food.calories;
    document.getElementById('food-protein').value = food.protein;
    document.getElementById('food-carbs').value = food.carbs;
    document.getElementById('food-fat').value = food.fat;
    document.getElementById('food-sugar').value = food.sugar;
    document.getElementById('food-fiber').value = food.fiber;
    document.getElementById('food-sodium').value = food.sodium;
    document.getElementById('food-cholesterol').value = food.cholesterol;

    foodModal.classList.remove('hidden');
}

function showFoodDetails(foodId) {
    const foods = getCustomFoods();
    const food = foods.find(f => f.id === foodId);
    if (!food) return;

    document.getElementById('food-detail-name').textContent = food.name;
    document.getElementById('food-detail-serving').textContent = food.serving;
    document.getElementById('food-detail-calories').textContent = `${food.calories} kcal`;
    document.getElementById('food-detail-protein').textContent = `${food.protein} g`;
    document.getElementById('food-detail-carbs').textContent = `${food.carbs} g`;
    document.getElementById('food-detail-fat').textContent = `${food.fat} g`;
    document.getElementById('food-detail-sugar').textContent = `${food.sugar} g`;
    document.getElementById('food-detail-fiber').textContent = `${food.fiber} g`;
    document.getElementById('food-detail-sodium').textContent = `${food.sodium} mg`;
    document.getElementById('food-detail-cholesterol').textContent = `${food.cholesterol} mg`;
    
    foodDetailModal.classList.remove('hidden');
}

function renderCustomFoods() {
    const container = document.getElementById('food-database-container');
    const foods = getCustomFoods();

    if (foods.length === 0) {
        container.innerHTML = `
            <div class="col-span-2 text-center py-8 text-gray-500">
                <div class="text-4xl mb-2">🍽️</div>
                <p>ยังไม่มีรายการอาหารในคลัง</p>
                <p class="text-sm">เพิ่มรายการแรกของคุณด้วยปุ่มด้านบน</p>
            </div>
        `;
        return;
    }

    container.innerHTML = foods.map(food => `
        <div class="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-lg">${food.name}</h3>
                <div class="flex space-x-1">
                    <button class="text-blue-500 hover:text-blue-700 text-sm view-food-btn" data-id="${food.id}">👁️</button>
                    <button class="text-green-500 hover:text-green-700 text-sm edit-food-btn" data-id="${food.id}">✏️</button>
                    <button class="text-red-500 hover:text-red-700 text-sm delete-food-btn" data-id="${food.id}">🗑️</button>
                </div>
            </div>
            
            <div class="text-sm text-gray-600 mb-3">
                ปริมาณ: ${food.serving}
            </div>
            
            <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="bg-white p-2 rounded text-center">
                    <div class="text-xs text-gray-500">พลังงาน</div>
                    <div class="font-bold">${food.calories} kcal</div>
                </div>
                <div class="bg-white p-2 rounded text-center">
                    <div class="text-xs text-gray-500">โปรตีน</div>
                    <div class="font-bold">${food.protein} g</div>
                </div>
                <div class="bg-white p-2 rounded text-center">
                    <div class="text-xs text-gray-500">คาร์บ</div>
                    <div class="font-bold">${food.carbs} g</div>
                </div>
                <div class="bg-white p-2 rounded text-center">
                    <div class="text-xs text-gray-500">ไขมัน</div>
                    <div class="font-bold">${food.fat} g</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize food database
function initFoodDatabase() {
    addFoodBtn.addEventListener('click', () => {
        foodForm.reset();
        document.getElementById('food-id').value = '';
        document.getElementById('food-modal-title').textContent = 'เพิ่มรายการอาหารใหม่';
        foodModal.classList.remove('hidden');
    });
    
    foodCancelBtn.addEventListener('click', () => foodModal.classList.add('hidden'));

    foodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const foodId = document.getElementById('food-id').value;
        const servingAmount = document.getElementById('food-serving-amount').value;
        const servingUnit = document.getElementById('food-serving-unit').value;
        
        const foodData = {
            name: document.getElementById('food-name').value,
            serving: `${servingAmount} ${servingUnit}`,
            calories: document.getElementById('food-calories').value,
            protein: document.getElementById('food-protein').value,
            carbs: document.getElementById('food-carbs').value,
            fat: document.getElementById('food-fat').value,
            sugar: document.getElementById('food-sugar').value || 0,
            fiber: document.getElementById('food-fiber').value || 0,
            sodium: document.getElementById('food-sodium').value || 0,
            cholesterol: document.getElementById('food-cholesterol').value || 0,
        };

        let foods = getCustomFoods();
        if (foodId) { // Editing existing food
            foods = foods.map(food => food.id === parseInt(foodId) ? { ...food, ...foodData } : food);
            showNotification(`แก้ไข "${foodData.name}" เรียบร้อยแล้ว`);
        } else { // Adding new food
            foodData.id = Date.now();
            foods.push(foodData);
            showNotification(`เพิ่ม "${foodData.name}" ในคลังอาหารแล้ว`);
        }
        
        saveCustomFoods(foods);
        renderCustomFoods();
        foodModal.classList.add('hidden');
    });

    // Label Recognition Feature
    uploadLabelBtn.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
            showNotification('กำลังวิเคราะห์รูปภาพ...');
            
            const prompt = `Analyze the provided Thai nutrition label image. Extract ONLY numerical values without units. If a value is not found, use 0. Format your response EXACTLY like this example, replacing the values:
{
  "name": "Product Name",
  "serving": "100 g",
  "calories": 150,
  "protein": 5,
  "carbs": 20,
  "fat": 8,
  "sugar": 2,
  "fiber": 1,
  "sodium": 400,
  "cholesterol": 0
}

Look for these Thai terms:
- ชื่อผลิตภัณฑ์ or product name
- หนึ่งหน่วยบริโภค (serving size)
- พลังงานทั้งหมด (total energy/calories)
- ไขมันทั้งหมด (total fat)
- โปรตีน (protein)
- คาร์โบไฮเดรตทั้งหมด (total carbohydrate)
- น้ำตาล (sugars)
- ใยอาหาร (dietary fiber)
- โซเดียม (sodium)
- คอเลสเตอรอล (cholesterol)`;

            const result = await callGemini(prompt, base64String, file.type);
            
            try {
                // Clean the response to ensure we only get JSON
                const cleanResult = result.replace(/[^\{\}":,.\d\s\[\]a-zA-Z-]/g, '')
                                        .replace(/\s+/g, ' ')
                                        .trim();
                
                // Find the JSON object in the cleaned response
                const jsonMatch = cleanResult.match(/\{.*\}/);
                if (!jsonMatch) {
                    console.error("No valid JSON found in response:", cleanResult);
                    throw new Error("ไม่พบข้อมูลโภชนาการในรูปภาพ");
                }
                
                let data;
                try {
                    data = JSON.parse(jsonMatch[0]);
                } catch (parseError) {
                    console.error("JSON parse error:", parseError, "Raw JSON:", jsonMatch[0]);
                    throw new Error("ข้อมูลที่ได้จากรูปภาพไม่ถูกต้อง");
                }
                
                const servingText = data.serving || '';
                const match = servingText.match(/^([\d\.\/]+)\s*(.*)$/);
                if (match) {
                    document.getElementById('food-serving-amount').value = match[1];
                    document.getElementById('food-serving-unit').value = match[2].trim();
                } else {
                    document.getElementById('food-serving-amount').value = 1;
                    document.getElementById('food-serving-unit').value = servingText;
                }

                document.getElementById('food-name').value = data.name || '';
                document.getElementById('food-calories').value = data.calories || '';
                document.getElementById('food-protein').value = data.protein || '';
                document.getElementById('food-carbs').value = data.carbs || '';
                document.getElementById('food-fat').value = data.fat || '';
                document.getElementById('food-sugar').value = data.sugar || 0;
                document.getElementById('food-fiber').value = data.fiber || 0;
                document.getElementById('food-sodium').value = data.sodium || 0;
                document.getElementById('food-cholesterol').value = data.cholesterol || 0;
                
                document.getElementById('food-id').value = '';
                document.getElementById('food-modal-title').textContent = 'เพิ่มรายการอาหารใหม่';
                foodModal.classList.remove('hidden');
                showNotification('ดึงข้อมูลสำเร็จ! กรุณาตรวจสอบข้อมูล');

            } catch (error) {
                console.error("Error parsing nutrition label JSON:", error, "Raw response:", result);
                showNotification('ไม่สามารถดึงข้อมูลจากรูปภาพได้ กรุณาลองใหม่', true);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset file input
    });

    // Event listeners for food database container
    document.getElementById('food-database-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-food-btn')) {
            const foodId = parseInt(e.target.dataset.id, 10);
            showChoiceModal('ยืนยันการลบ', 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการอาหารนี้?', [
                { text: 'ยกเลิก', className: 'bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300' },
                { text: 'ยืนยัน', className: 'bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600', callback: () => deleteCustomFood(foodId) }
            ]);
        }
        if (e.target.classList.contains('view-food-btn')) {
            const foodId = parseInt(e.target.dataset.id, 10);
            showFoodDetails(foodId);
        }
        if (e.target.classList.contains('edit-food-btn')) {
            const foodId = parseInt(e.target.dataset.id, 10);
            showEditFoodModal(foodId);
        }
    });

    document.getElementById('food-detail-close-btn').addEventListener('click', () => {
        foodDetailModal.classList.add('hidden');
    });
}
