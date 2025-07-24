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
                <button onclick="deleteRecipe(${recipe.id})" class="text-red-500 hover:text-red-700 text-sm">ลบ</button>
            </div>
            
            ${recipe.instructions ? `
                <div class="mb-3">
                    <h4 class="font-medium text-sm mb-1">วิธีทำ:</h4>
                    <div class="text-sm text-gray-700 whitespace-pre-line">${recipe.instructions}</div>
                </div>
            ` : ''}
            
            ${recipe.nutrition ? `
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div class="bg-white p-2 rounded text-center">
                        <div class="text-xs text-gray-500">พลังงาน</div>
                        <div class="font-bold">${recipe.nutrition.calories || '-'}</div>
                    </div>
                    <div class="bg-white p-2 rounded text-center">
                        <div class="text-xs text-gray-500">โปรตีน</div>
                        <div class="font-bold">${recipe.nutrition.protein || '-'}</div>
                    </div>
                    <div class="bg-white p-2 rounded text-center">
                        <div class="text-xs text-gray-500">คาร์บ</div>
                        <div class="font-bold">${recipe.nutrition.carbs || '-'}</div>
                    </div>
                    <div class="bg-white p-2 rounded text-center">
                        <div class="text-xs text-gray-500">ไขมัน</div>
                        <div class="font-bold">${recipe.nutrition.fat || '-'}</div>
                    </div>
                </div>
            ` : ''}
            
            <div class="text-xs text-gray-400">
                บันทึกเมื่อ: ${new Date(recipe.savedAt).toLocaleDateString('th-TH')}
            </div>
        </div>
    `).join('');
}
