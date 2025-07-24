// Exercise Suggestion Feature
const modal = document.getElementById('suggestion-modal');

function initExerciseSuggestion() {
    document.getElementById('workout').addEventListener('click', async (e) => {
        if (e.target.classList.contains('suggest-btn')) {
            const exerciseName = e.target.dataset.exercise;
            modal.classList.remove('hidden');
            document.getElementById('suggestion-result').innerHTML = '';
            document.getElementById('suggestion-loader').style.display = 'flex';
            
            const prompt = `You are a certified personal trainer. A user is looking for an alternative to the exercise "${exerciseName}". They have access to dumbbells, an adjustable bench, and standard gym machines (lat pulldown, leg press, etc.). Suggest one alternative exercise that targets the same primary muscle group. Provide the name of the exercise and a brief 1-2 sentence explanation of how to perform it. The response MUST be in Thai language.`;
            
            const result = await callGemini(prompt);
            document.getElementById('suggestion-loader').style.display = 'none';
            document.getElementById('suggestion-result').innerHTML = result.replace(/\n/g, '<br>');
        }
    });
    
    document.getElementById('close-modal-btn').addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) modal.classList.add('hidden'); 
    });
}
