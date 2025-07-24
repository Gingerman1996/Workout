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
    
    // Load initial data
    renderCustomFoods();
    renderSavedRecipes();
});
