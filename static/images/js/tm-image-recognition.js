document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const ingredientResult = document.getElementById('ingredientResult');
    const ingredientInput = document.querySelector('input[name="ingredient"]');

    if (!analyzeBtn) return;

    analyzeBtn.addEventListener('click', async function() {
        if (!imageUpload.files[0]) {
            showResult('Please select an image first', 'error');
            return;
        }

        showResult('<div class="spinner-border spinner-border-sm"></div> Analyzing...', 'info');

        const formData = new FormData();
        formData.append('image', imageUpload.files[0]);

        try {
            const response = await fetch('/analyze-image', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Unknown error');
            }

            if (data.warning) {
                showResult(`
                    Not sure... Is it <strong>${data.guess}</strong>? 
                    (${Math.round(data.confidence * 100)}% confidence)<br>
                    <button class="btn btn-sm btn-outline-secondary mt-2" onclick="useSuggestion('${data.guess}')">
                        Use this suggestion
                    </button>
                `, 'warning');
            } else {
                showResult(`
                    Detected: <strong>${data.ingredient}</strong> 
                    (${Math.round(data.confidence * 100)}% confidence)
                `, 'success');
                ingredientInput.value = data.ingredient;
            }
        } catch (error) {
            showResult(`Error: ${error.message}`, 'error');
        }
    });
});

function showResult(message, type) {
    const resultDiv = document.getElementById('ingredientResult');
    resultDiv.innerHTML = message;
    resultDiv.className = `alert alert-${type}`;
    resultDiv.style.display = 'block';
}

function useSuggestion(ingredient) {
    document.querySelector('input[name="ingredient"]').value = ingredient;
    document.getElementById('ingredientResult').style.display = 'none';
}