// Tab Management
const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.content-section');

function showTab(tabName) {
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab-btn[onclick="showTab('${tabName}')"]`).classList.add('active');
    contents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    // Load content when switching tabs
    if (tabName === 'saved-recipes') renderSavedRecipes();
    if (tabName === 'food-database') renderCustomFoods();
}
