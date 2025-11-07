// グローバル変数
let currentQuiz = null;
let difficulty = 'all';
let stats = {
    correct: 0,
    wrong: 0
};

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    loadNewQuiz();
    
    // Enterキーで回答
    document.getElementById('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
});

// 難易度を設定
function setDifficulty(level) {
    difficulty = level;
    
    // ボタンのスタイルを更新
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    event.target.classList.remove('bg-gray-200', 'text-gray-700');
    event.target.classList.add('bg-indigo-600', 'text-white');
    
    // 新しいクイズを読み込む
    loadNewQuiz();
}

// 新しいクイズを読み込む
async function loadNewQuiz() {
    try {
        const response = await axios.get(`/api/quiz/random?difficulty=${difficulty}`);
        currentQuiz = response.data;
        
        // UIをリセット
        document.getElementById('quizArea').classList.remove('hidden');
        document.getElementById('resultArea').classList.add('hidden');
        document.getElementById('answerInput').value = '';
        document.getElementById('answerInput').focus();
        
        // ヒントを表示
        displayHints(currentQuiz.hints);
        
        // アニメーション効果
        document.getElementById('quizArea').classList.remove('fade-in');
        void document.getElementById('quizArea').offsetWidth; // reflow
        document.getElementById('quizArea').classList.add('fade-in');
        
    } catch (error) {
        console.error('クイズの読み込みに失敗しました:', error);
        alert('クイズの読み込みに失敗しました。再度お試しください。');
    }
}

// ヒントを表示
function displayHints(hints) {
    const container = document.getElementById('hintsContainer');
    container.innerHTML = '';
    
    const icons = [
        'fa-city',
        'fa-utensils',
        'fa-gift',
        'fa-landmark'
    ];
    
    hints.forEach((hint, index) => {
        const hintCard = document.createElement('div');
        hintCard.className = 'hint-card bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border-2 border-indigo-200';
        hintCard.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${icons[index % icons.length]} text-2xl text-indigo-600 mr-3"></i>
                <span class="text-lg text-gray-800 font-medium">${hint}</span>
            </div>
        `;
        container.appendChild(hintCard);
    });
}

// 回答をチェック
function checkAnswer() {
    const userAnswer = document.getElementById('answerInput').value.trim();
    
    if (!userAnswer) {
        alert('都道府県名を入力してください。');
        return;
    }
    
    const isCorrect = userAnswer === currentQuiz.answer;
    
    // 統計を更新
    if (isCorrect) {
        stats.correct++;
    } else {
        stats.wrong++;
    }
    updateStats();
    
    // 結果を表示
    showResult(isCorrect);
}

// 結果を表示
function showResult(isCorrect) {
    document.getElementById('quizArea').classList.add('hidden');
    document.getElementById('resultArea').classList.remove('hidden');
    
    const resultMessage = document.getElementById('resultMessage');
    
    if (isCorrect) {
        resultMessage.innerHTML = `
            <div class="bg-green-100 border-4 border-green-500 rounded-lg p-8">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-3xl font-bold text-green-800 mb-2">正解！</h3>
                <p class="text-xl text-green-700">
                    <i class="fas fa-check-circle mr-2"></i>
                    答えは <span class="font-bold">${currentQuiz.answer}</span> でした！
                </p>
            </div>
        `;
    } else {
        resultMessage.innerHTML = `
            <div class="bg-red-100 border-4 border-red-500 rounded-lg p-8">
                <div class="text-6xl mb-4">😢</div>
                <h3 class="text-3xl font-bold text-red-800 mb-2">残念...</h3>
                <p class="text-xl text-red-700">
                    <i class="fas fa-times-circle mr-2"></i>
                    正解は <span class="font-bold">${currentQuiz.answer}</span> でした
                </p>
            </div>
        `;
    }
    
    // アニメーション効果
    document.getElementById('resultArea').classList.remove('fade-in');
    void document.getElementById('resultArea').offsetWidth; // reflow
    document.getElementById('resultArea').classList.add('fade-in');
}

// 統計を更新
function updateStats() {
    document.getElementById('correctCount').textContent = stats.correct;
    document.getElementById('wrongCount').textContent = stats.wrong;
    
    const total = stats.correct + stats.wrong;
    if (total > 0) {
        const accuracy = Math.round((stats.correct / total) * 100);
        document.getElementById('accuracy').textContent = accuracy + '%';
    }
}
