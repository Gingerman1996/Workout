// Recipe Generation Feature
let currentRecipeData = null;

async function generateRecipe() {
    const ingredients = document.getElementById('ingredients-input').value.trim();
    if (!ingredients) { 
        showNotification('กรุณากรอกวัตถุดิบ', true); 
        return; 
    }

    const loader = document.getElementById('recipe-loader');
    const resultDiv = document.getElementById('recipe-result');
    
    loader.classList.remove('hidden');
    loader.classList.add('flex');
    resultDiv.classList.add('hidden');

    try {
        const customFoods = getCustomFoods();
        const nutritionDatabase = customFoods.map(food => 
            `${food.name} (ต่อ ${food.serving}): ${food.calories} kcal, โปรตีน ${food.protein}g, คาร์บ ${food.carbs}g, ไขมัน ${food.fat}g`
        ).join('\n');

        const prompt = `You are a creative Thai chef and nutritionist. Create a healthy Thai recipe and calculate nutrition.

Food Database:
${nutritionDatabase}

User's Ingredients:
${ingredients}

Create a JSON response in Thai:
{
  "recipeName": "ชื่อเมนูภาษาไทย",
  "ingredients": ["วัตถุดิบ 1", "วัตถุดิบ 2"],
  "instructions": "วิธีทำแบบละเอียด",
  "nutrition": {
    "calories": "XXX kcal",
    "protein": "XX.X g", 
    "carbs": "XX.X g",
    "fat": "XX.X g",
    "sugar": "XX.X g",
    "sodium": "XXX mg",
    "cholesterol": "XX mg"
  }
}`;

        const response = await callGemini(prompt);
        
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON found');
            
            const recipeData = JSON.parse(jsonMatch[0]);
            currentRecipeData = recipeData;
            
            resultDiv.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-[#C5A47E]">${recipeData.recipeName}</h3>
                    <button id="save-recipe-btn" class="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                        💾 บันทึกเมนู
                    </button>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold mb-2">🥘 ส่วนผสม:</h4>
                        <ul class="list-disc list-inside text-gray-700 space-y-1 mb-4">
                            ${recipeData.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                        
                        <h4 class="font-semibold mb-2">👩‍🍳 วิธีทำ:</h4>
                        <p class="text-gray-700 whitespace-pre-line">${recipeData.instructions}</p>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold mb-2">📊 ข้อมูลโภชนาการ:</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-white p-3 rounded border text-center">
                                <div class="text-sm text-gray-500">พลังงาน</div>
                                <div class="font-bold text-lg">${recipeData.nutrition.calories}</div>
                            </div>
                            <div class="bg-white p-3 rounded border text-center">
                                <div class="text-sm text-gray-500">โปรตีน</div>
                                <div class="font-bold text-lg">${recipeData.nutrition.protein}</div>
                            </div>
                            <div class="bg-white p-3 rounded border text-center">
                                <div class="text-sm text-gray-500">คาร์โบไฮเดรต</div>
                                <div class="font-bold text-lg">${recipeData.nutrition.carbs}</div>
                            </div>
                            <div class="bg-white p-3 rounded border text-center">
                                <div class="text-sm text-gray-500">ไขมัน</div>
                                <div class="font-bold text-lg">${recipeData.nutrition.fat}</div>
                            </div>
                        </div>
                        
                        <div class="mt-3 text-sm text-gray-600">
                            <div class="flex justify-between"><span>น้ำตาล:</span><span>${recipeData.nutrition.sugar}</span></div>
                            <div class="flex justify-between"><span>โซเดียม:</span><span>${recipeData.nutrition.sodium}</span></div>
                            <div class="flex justify-between"><span>คอเลสเตอรอล:</span><span>${recipeData.nutrition.cholesterol}</span></div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add save recipe functionality
            document.getElementById('save-recipe-btn').addEventListener('click', () => saveRecipe(recipeData));
            
        } catch (parseError) {
            resultDiv.innerHTML = `<div class="bg-yellow-50 p-4 rounded border border-yellow-200">
                <h3 class="font-semibold text-yellow-800 mb-2">⚠️ ไม่สามารถแปลงผลลัพธ์ได้</h3>
                <div class="text-sm text-gray-700">${response}</div>
            </div>`;
        }
        
    } catch (error) {
        resultDiv.innerHTML = `<p class="text-red-600">เกิดข้อผิดพลาด: ${error.message}</p>`;
    } finally {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
        resultDiv.classList.remove('hidden');
    }
}

// Initialize recipe generation
function initRecipeGeneration() {
    document.getElementById('generate-recipe-btn').addEventListener('click', generateRecipe);
}
