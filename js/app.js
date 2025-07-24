// Main App Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initModals();
    initApiKey();
    initGithubSync();
    initFoodDatabase();
    initRecipeGeneration();
    initExerciseSuggestion();
    initAIChat();
    initIngredientsModal();
    
    // Load initial data
    renderCustomFoods();
    renderSavedRecipes();
});
