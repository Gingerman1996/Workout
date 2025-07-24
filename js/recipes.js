// Saved Recipes Management
const SAVED_RECIPES_KEY = 'savedRecipes';

function getSavedRecipes() { 
    return JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY)) || []; 
}

function saveSavedRecipes(recipes) { 
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(recipes));
    if (typeof autoSyncToGithub === 'function') {
        autoSyncToGithub();
    }
}

function saveRecipe(recipeData) {
    const recipes = getSavedRecipes();
    const newRecipe = {
        id: Date.now(),
        ...recipeData,
        savedAt: new Date().toISOString()
    };
    recipes.unshift(newRecipe);
    saveSavedRecipes(recipes);
    showNotification('บันทึกเมนูเรียบร้อยแล้ว');
}

function deleteRecipe(recipeId) {
    const recipes = getSavedRecipes().filter(r => r.id !== recipeId);
    saveSavedRecipes(recipes);
    renderSavedRecipes();
    showNotification('ลบเมนูเรียบร้อยแล้ว');
}

function editRecipeName(recipeId) {
    const recipes = getSavedRecipes();
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) {
        showNotification('ไม่พบเมนูที่ต้องการแก้ไข');
        return;
    }

    const currentName = recipe.name || recipe.recipeName || 'เมนูไม่ระบุชื่อ';
    
    showInputModal(
        'แก้ไขชื่อเมนู',
        'กรุณาใส่ชื่อเมนูใหม่:',
        currentName,
        (newName) => {
            if (newName && newName.trim()) {
                recipe.name = newName.trim();
                // Remove old recipeName property if exists
                if (recipe.recipeName) {
                    delete recipe.recipeName;
                }
                saveSavedRecipes(recipes);
                renderSavedRecipes();
                showNotification('แก้ไขชื่อเมนูเรียบร้อยแล้ว');
            } else {
                showNotification('กรุณาใส่ชื่อเมนู', true);
            }
        }
    );
}

function renderSavedRecipes() {
    const container = document.getElementById('saved-recipes-container');
    const recipes = getSavedRecipes();

    if (recipes.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-2">📝</div>
                <p>ยังไม่มีเมนูที่บันทึกไว้</p>
                <p class="text-sm">ลองใช้ AI สร้างสูตรอาหารในแท็บโภชนาการ</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recipes.map(recipe => `
        <div class="bg-gray-50 p-4 rounded-lg border">
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-lg">${recipe.name || recipe.recipeName || 'เมนูไม่ระบุชื่อ'}</h3>
                <div class="flex recipe-actions space-x-2">
                    <button onclick="addIngredientsToRecipe(${recipe.id})" class="text-green-500 hover:text-green-700 text-sm" title="เพิ่มวัตถุดิบ">
                        🥄 เพิ่มวัตถุดิบ
                    </button>
                    <button onclick="editRecipeName(${recipe.id})" class="recipe-edit-btn text-blue-500 hover:text-blue-700 text-sm" title="แก้ไขชื่อ">
                        ✏️ แก้ไข
                    </button>
                    <button onclick="deleteRecipe(${recipe.id})" class="recipe-delete-btn text-red-500 hover:text-red-700 text-sm" title="ลบเมนู">
                        🗑️ ลบ
                    </button>
                </div>
            </div>
            
            ${recipe.instructions ? `
                <div class="mb-3">
                    <h4 class="font-medium text-sm mb-1">วิธีทำ:</h4>
                    <div class="text-sm text-gray-700 whitespace-pre-line">${recipe.instructions}</div>
                </div>
            ` : ''}
            
            ${recipe.ingredients && recipe.ingredients.length > 0 ? `
                <div class="mb-3">
                    <h4 class="font-medium text-sm mb-2">วัตถุดิบ:</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        ${recipe.ingredients.map((ingredient, index) => `
                            <div class="bg-white p-2 rounded text-sm border">
                                <div class="flex justify-between items-center">
                                    <span class="font-medium">${ingredient.name}</span>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-gray-500">${ingredient.amount} ${ingredient.unit || ''}</span>
                                        <button onclick="editIngredientAmount(${recipe.id}, ${index})" class="text-blue-500 hover:text-blue-700 text-xs" title="แก้ไขปริมาณ">
                                            ✏️
                                        </button>
                                        <button onclick="removeIngredientFromRecipe(${recipe.id}, ${index})" class="text-red-500 hover:text-red-700 text-xs" title="ลบวัตถุดิบ">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    ${ingredient.calories}kcal, P:${ingredient.protein}g, C:${ingredient.carbs}g, F:${ingredient.fat}g
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${(recipe.nutrition || (recipe.ingredients && recipe.ingredients.length > 0)) ? `
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div class="bg-white p-2 rounded text-center">
                        <div class="text-xs text-gray-500">พลังงาน</div>
                        <div class="font-bold">${recipe.nutrition?.calories || '-'}</div>
                    </div>
                    <div class="bg-white p-2 rounded text-center">
                        <div class="text-xs text-gray-500">โปรตีน</div>
                        <div class="font-bold">${recipe.nutrition?.protein || '-'}</div>
                    </div>
                    <div class="bg-white p-2 rounded text-center">
                        <div class="text-xs text-gray-500">คาร์บ</div>
                        <div class="font-bold">${recipe.nutrition?.carbs || '-'}</div>
                    </div>
                    <div class="bg-white p-2 rounded text-center">
                        <div class="text-xs text-gray-500">ไขมัน</div>
                        <div class="font-bold">${recipe.nutrition?.fat || '-'}</div>
                    </div>
                </div>
            ` : ''}
            
            <div class="text-xs text-gray-400">
                บันทึกเมื่อ: ${new Date(recipe.savedAt).toLocaleDateString('th-TH')}
            </div>
        </div>
    `).join('');
}

// Variables for ingredient management
let currentRecipeId = null;
let selectedIngredients = [];

// Function to show the add ingredients modal
function addIngredientsToRecipe(recipeId) {
    currentRecipeId = recipeId;
    selectedIngredients = [];
    
    const modal = document.getElementById('add-ingredients-modal');
    modal.classList.remove('hidden');
    
    populateFoodList();
    updateSelectedIngredientsList();
    updateNutritionSummary();
}

// Populate the food list in the modal
function populateFoodList() {
    const container = document.getElementById('ingredients-food-list');
    const foods = getCustomFoods();
    
    if (foods.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                <p>ยังไม่มีรายการอาหารในคลัง</p>
                <p class="text-sm">ไปเพิ่มในแท็บคลังอาหารก่อน</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = foods.map(food => `
        <div class="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer" onclick="selectFood(${food.id})">
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-medium">${food.name}</div>
                    <div class="text-sm text-gray-500">${food.serving}</div>
                </div>
                <div class="text-right text-sm">
                    <div>${food.calories} kcal</div>
                    <div class="text-gray-500">P:${food.protein}g C:${food.carbs}g F:${food.fat}g</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Select a food item
function selectFood(foodId) {
    const foods = getCustomFoods();
    const food = foods.find(f => f.id === foodId);
    if (!food) return;
    
    // Check if already selected
    const existing = selectedIngredients.find(ing => ing.id === foodId);
    if (existing) {
        showNotification('วัตถุดิบนี้ถูกเลือกไว้แล้ว', true);
        return;
    }
    
    // Show input modal for amount
    showInputModal(
        'ระบุปริมาณ',
        `กรุณาใส่ปริมาณของ ${food.name} (หน่วย: ${food.serving.split(' ').slice(1).join(' ')})`,
        '1',
        (amount) => {
            const qty = parseFloat(amount);
            if (isNaN(qty) || qty <= 0) {
                showNotification('กรุณาใส่ปริมาณที่ถูกต้อง', true);
                return;
            }
            
            const ingredient = {
                id: food.id,
                name: food.name,
                amount: qty,
                unit: food.serving.split(' ').slice(1).join(' '),
                calories: Math.round(food.calories * qty),
                protein: Math.round(food.protein * qty * 10) / 10,
                carbs: Math.round(food.carbs * qty * 10) / 10,
                fat: Math.round(food.fat * qty * 10) / 10
            };
            
            selectedIngredients.push(ingredient);
            updateSelectedIngredientsList();
            updateNutritionSummary();
            showNotification(`เพิ่ม ${food.name} แล้ว`);
        }
    );
}

// Update selected ingredients list
function updateSelectedIngredientsList() {
    const container = document.getElementById('selected-ingredients-list');
    
    if (selectedIngredients.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                <p>ยังไม่ได้เลือกวัตถุดิบ</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = selectedIngredients.map((ingredient, index) => `
        <div class="border rounded-lg p-3 bg-green-50">
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-medium">${ingredient.name}</div>
                    <div class="text-sm text-gray-600">${ingredient.amount} ${ingredient.unit}</div>
                    <div class="text-xs text-gray-500">
                        ${ingredient.calories}kcal, P:${ingredient.protein}g, C:${ingredient.carbs}g, F:${ingredient.fat}g
                    </div>
                </div>
                <button onclick="removeSelectedIngredient(${index})" class="text-red-500 hover:text-red-700">
                    ✕
                </button>
            </div>
        </div>
    `).join('');
}

// Remove selected ingredient
function removeSelectedIngredient(index) {
    selectedIngredients.splice(index, 1);
    updateSelectedIngredientsList();
    updateNutritionSummary();
}

// Update nutrition summary
function updateNutritionSummary() {
    const totalCalories = selectedIngredients.reduce((sum, ing) => sum + ing.calories, 0);
    const totalProtein = selectedIngredients.reduce((sum, ing) => sum + ing.protein, 0);
    const totalCarbs = selectedIngredients.reduce((sum, ing) => sum + ing.carbs, 0);
    const totalFat = selectedIngredients.reduce((sum, ing) => sum + ing.fat, 0);
    
    document.getElementById('total-calories').textContent = totalCalories;
    document.getElementById('total-protein').textContent = Math.round(totalProtein * 10) / 10;
    document.getElementById('total-carbs').textContent = Math.round(totalCarbs * 10) / 10;
    document.getElementById('total-fat').textContent = Math.round(totalFat * 10) / 10;
}

// Save ingredients to recipe and continue adding
function saveIngredientsToRecipe() {
    if (selectedIngredients.length === 0) {
        showNotification('กรุณาเลือกวัตถุดิบอย่างน้อย 1 รายการ', true);
        return;
    }
    
    const recipes = getSavedRecipes();
    const recipe = recipes.find(r => r.id === currentRecipeId);
    
    if (!recipe) {
        showNotification('ไม่พบเมนูที่ต้องการเพิ่มวัตถุดิบ', true);
        return;
    }
    
    // Initialize ingredients array if doesn't exist
    if (!recipe.ingredients) {
        recipe.ingredients = [];
    }
    
    // Add new ingredients (check for duplicates)
    selectedIngredients.forEach(newIngredient => {
        const existingIndex = recipe.ingredients.findIndex(ing => ing.id === newIngredient.id);
        if (existingIndex >= 0) {
            // Update existing ingredient amount
            const existing = recipe.ingredients[existingIndex];
            existing.amount += newIngredient.amount;
            existing.calories += newIngredient.calories;
            existing.protein += newIngredient.protein;
            existing.carbs += newIngredient.carbs;
            existing.fat += newIngredient.fat;
        } else {
            // Add new ingredient
            recipe.ingredients.push({...newIngredient});
        }
    });
    
    // Update nutrition summary for the recipe
    updateRecipeNutrition(recipe);
    
    saveSavedRecipes(recipes);
    renderSavedRecipes();
    
    // Clear selected ingredients but keep modal open
    selectedIngredients = [];
    updateSelectedIngredientsList();
    updateNutritionSummary();
    
    showNotification('เพิ่มวัตถุดิบในเมนูเรียบร้อยแล้ว สามารถเพิ่มวัตถุดิบต่อได้');
}

// Save ingredients to recipe and close modal
function saveAndCloseIngredientsToRecipe() {
    if (selectedIngredients.length === 0) {
        showNotification('กรุณาเลือกวัตถุดิบอย่างน้อย 1 รายการ', true);
        return;
    }
    
    const recipes = getSavedRecipes();
    const recipe = recipes.find(r => r.id === currentRecipeId);
    
    if (!recipe) {
        showNotification('ไม่พบเมนูที่ต้องการเพิ่มวัตถุดิบ', true);
        return;
    }
    
    // Initialize ingredients array if doesn't exist
    if (!recipe.ingredients) {
        recipe.ingredients = [];
    }
    
    // Add new ingredients (check for duplicates)
    selectedIngredients.forEach(newIngredient => {
        const existingIndex = recipe.ingredients.findIndex(ing => ing.id === newIngredient.id);
        if (existingIndex >= 0) {
            // Update existing ingredient amount
            const existing = recipe.ingredients[existingIndex];
            existing.amount += newIngredient.amount;
            existing.calories += newIngredient.calories;
            existing.protein += newIngredient.protein;
            existing.carbs += newIngredient.carbs;
            existing.fat += newIngredient.fat;
        } else {
            // Add new ingredient
            recipe.ingredients.push({...newIngredient});
        }
    });
    
    // Update nutrition summary for the recipe
    updateRecipeNutrition(recipe);
    
    saveSavedRecipes(recipes);
    renderSavedRecipes();
    
    // Close modal and reset
    closeIngredientsModal();
    
    showNotification('เพิ่มวัตถุดิบในเมนูเรียบร้อยแล้ว');
}

// Close ingredients modal and reset
function closeIngredientsModal() {
    document.getElementById('add-ingredients-modal').classList.add('hidden');
    currentRecipeId = null;
    selectedIngredients = [];
}

// Update recipe nutrition based on ingredients
function updateRecipeNutrition(recipe) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) return;
    
    const totalCalories = recipe.ingredients.reduce((sum, ing) => sum + ing.calories, 0);
    const totalProtein = recipe.ingredients.reduce((sum, ing) => sum + ing.protein, 0);
    const totalCarbs = recipe.ingredients.reduce((sum, ing) => sum + ing.carbs, 0);
    const totalFat = recipe.ingredients.reduce((sum, ing) => sum + ing.fat, 0);
    
    if (!recipe.nutrition) {
        recipe.nutrition = {};
    }
    
    recipe.nutrition.calories = totalCalories + ' kcal';
    recipe.nutrition.protein = Math.round(totalProtein * 10) / 10 + ' g';
    recipe.nutrition.carbs = Math.round(totalCarbs * 10) / 10 + ' g';
    recipe.nutrition.fat = Math.round(totalFat * 10) / 10 + ' g';
}

// Edit ingredient amount
function editIngredientAmount(recipeId, ingredientIndex) {
    const recipes = getSavedRecipes();
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe || !recipe.ingredients || !recipe.ingredients[ingredientIndex]) {
        showNotification('ไม่พบวัตถุดิบที่ต้องการแก้ไข', true);
        return;
    }
    
    const ingredient = recipe.ingredients[ingredientIndex];
    
    showInputModal(
        'แก้ไขปริมาณ',
        `แก้ไขปริมาณของ ${ingredient.name} (หน่วย: ${ingredient.unit})`,
        ingredient.amount.toString(),
        (newAmount) => {
            const qty = parseFloat(newAmount);
            if (isNaN(qty) || qty <= 0) {
                showNotification('กรุณาใส่ปริมาณที่ถูกต้อง', true);
                return;
            }
            
            // Find original food data to recalculate nutrition
            const foods = getCustomFoods();
            const originalFood = foods.find(f => f.id === ingredient.id);
            
            if (originalFood) {
                // Recalculate nutrition based on new amount
                ingredient.amount = qty;
                ingredient.calories = Math.round(originalFood.calories * qty);
                ingredient.protein = Math.round(originalFood.protein * qty * 10) / 10;
                ingredient.carbs = Math.round(originalFood.carbs * qty * 10) / 10;
                ingredient.fat = Math.round(originalFood.fat * qty * 10) / 10;
                
                updateRecipeNutrition(recipe);
                saveSavedRecipes(recipes);
                renderSavedRecipes();
                showNotification('แก้ไขปริมาณวัตถุดิบเรียบร้อยแล้ว');
            } else {
                // If original food not found, just update amount
                ingredient.amount = qty;
                saveSavedRecipes(recipes);
                renderSavedRecipes();
                showNotification('แก้ไขปริมาณเรียบร้อยแล้ว (ไม่สามารถคำนวณโภชนาการใหม่ได้)');
            }
        }
    );
}

// Remove ingredient from recipe
function removeIngredientFromRecipe(recipeId, ingredientIndex) {
    showChoiceModal(
        'ลบวัตถุดิบ',
        'คุณต้องการลบวัตถุดิบนี้จากเมนูหรือไม่?',
        [
            {
                text: 'ยกเลิก',
                className: 'bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300',
                callback: null
            },
            {
                text: 'ลบ',
                className: 'bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600',
                callback: () => {
                    const recipes = getSavedRecipes();
                    const recipe = recipes.find(r => r.id === recipeId);
                    
                    if (recipe && recipe.ingredients && recipe.ingredients[ingredientIndex]) {
                        recipe.ingredients.splice(ingredientIndex, 1);
                        updateRecipeNutrition(recipe);
                        saveSavedRecipes(recipes);
                        renderSavedRecipes();
                        showNotification('ลบวัตถุดิบเรียบร้อยแล้ว');
                    }
                }
            }
        ]
    );
}

// Initialize ingredients modal events
function initIngredientsModal() {
    const modal = document.getElementById('add-ingredients-modal');
    const closeBtn = document.getElementById('close-ingredients-modal-btn');
    const cancelBtn = document.getElementById('cancel-ingredients-btn');
    const saveBtn = document.getElementById('save-ingredients-btn');
    const saveAndCloseBtn = document.getElementById('save-and-close-ingredients-btn');
    const clearBtn = document.getElementById('clear-selected-ingredients');
    
    closeBtn.addEventListener('click', closeIngredientsModal);
    
    cancelBtn.addEventListener('click', closeIngredientsModal);
    
    saveBtn.addEventListener('click', saveIngredientsToRecipe);
    
    saveAndCloseBtn.addEventListener('click', saveAndCloseIngredientsToRecipe);
    
    clearBtn.addEventListener('click', () => {
        selectedIngredients = [];
        updateSelectedIngredientsList();
        updateNutritionSummary();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeIngredientsModal();
        }
    });
}
