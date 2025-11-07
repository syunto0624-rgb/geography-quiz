import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// CORSを有効化
app.use('/api/*', cors())

// 静的ファイルの配信
app.use('/static/*', serveStatic({ root: './public' }))

// クイズデータ
const quizData = [
  // 北海道・東北
  { prefecture: '北海道', hints: ['札幌市', 'ジンギスカン', 'ラーメン', '時計台'], difficulty: 'easy' },
  { prefecture: '青森県', hints: ['弘前市', 'りんご', 'ねぶた祭り', '大間のマグロ'], difficulty: 'medium' },
  { prefecture: '岩手県', hints: ['盛岡市', 'わんこそば', '南部鉄器', '中尊寺金色堂'], difficulty: 'medium' },
  { prefecture: '宮城県', hints: ['仙台市', '牛タン', 'ずんだ餅', '笹かまぼこ'], difficulty: 'easy' },
  { prefecture: '秋田県', hints: ['秋田市', 'きりたんぽ', '秋田犬', 'なまはげ'], difficulty: 'medium' },
  { prefecture: '山形県', hints: ['山形市', 'さくらんぼ', 'ラ・フランス', '米沢牛'], difficulty: 'medium' },
  { prefecture: '福島県', hints: ['福島市', '喜多方ラーメン', '桃', '会津若松市'], difficulty: 'medium' },
  
  // 関東
  { prefecture: '茨城県', hints: ['水戸市', '納豆', 'メロン', '偕楽園'], difficulty: 'medium' },
  { prefecture: '栃木県', hints: ['宇都宮市', '餃子', 'いちご', '日光東照宮'], difficulty: 'medium' },
  { prefecture: '群馬県', hints: ['前橋市', 'こんにゃく', '下仁田ネギ', '草津温泉'], difficulty: 'medium' },
  { prefecture: '埼玉県', hints: ['さいたま市', '草加せんべい', '深谷ネギ', '川越'], difficulty: 'easy' },
  { prefecture: '千葉県', hints: ['千葉市', '落花生', 'なしの生産', '成田空港'], difficulty: 'easy' },
  { prefecture: '東京都', hints: ['新宿区', 'もんじゃ焼き', 'スカイツリー', '東京タワー'], difficulty: 'easy' },
  { prefecture: '神奈川県', hints: ['横浜市', 'シウマイ', '中華街', '鎌倉大仏'], difficulty: 'easy' },
  
  // 中部
  { prefecture: '新潟県', hints: ['新潟市', 'コシヒカリ', '日本酒', '笹団子'], difficulty: 'medium' },
  { prefecture: '富山県', hints: ['富山市', 'ます寿司', 'ホタルイカ', '黒部ダム'], difficulty: 'medium' },
  { prefecture: '石川県', hints: ['金沢市', '加賀百万石', '金箔', '兼六園'], difficulty: 'medium' },
  { prefecture: '福井県', hints: ['福井市', '越前ガニ', '眼鏡フレーム', '東尋坊'], difficulty: 'hard' },
  { prefecture: '山梨県', hints: ['甲府市', 'ぶどう', 'ワイン', '富士山'], difficulty: 'medium' },
  { prefecture: '長野県', hints: ['長野市', 'そば', 'りんご', '善光寺'], difficulty: 'medium' },
  { prefecture: '岐阜県', hints: ['岐阜市', '飛騨牛', '白川郷', '鵜飼い'], difficulty: 'medium' },
  { prefecture: '静岡県', hints: ['静岡市', 'お茶', 'みかん', '浜松餃子'], difficulty: 'easy' },
  { prefecture: '愛知県', hints: ['名古屋市', 'ひつまぶし', '味噌カツ', '手羽先'], difficulty: 'easy' },
  
  // 関西
  { prefecture: '三重県', hints: ['津市', '伊勢えび', '松阪牛', '伊勢神宮'], difficulty: 'medium' },
  { prefecture: '滋賀県', hints: ['大津市', '近江牛', '琵琶湖', 'ふな寿司'], difficulty: 'medium' },
  { prefecture: '京都府', hints: ['京都市', '八つ橋', '宇治茶', '金閣寺'], difficulty: 'easy' },
  { prefecture: '大阪府', hints: ['大阪市', 'たこ焼き', 'お好み焼き', '通天閣'], difficulty: 'easy' },
  { prefecture: '兵庫県', hints: ['神戸市', '神戸牛', 'いかなごのくぎ煮', '姫路城'], difficulty: 'easy' },
  { prefecture: '奈良県', hints: ['奈良市', '柿の葉寿司', '大仏', '鹿'], difficulty: 'easy' },
  { prefecture: '和歌山県', hints: ['和歌山市', 'みかん', '梅干し', 'パンダ'], difficulty: 'medium' },
  
  // 中国・四国
  { prefecture: '鳥取県', hints: ['鳥取市', '砂丘', '二十世紀梨', 'カニ'], difficulty: 'hard' },
  { prefecture: '島根県', hints: ['松江市', 'しじみ', '出雲そば', '出雲大社'], difficulty: 'hard' },
  { prefecture: '岡山県', hints: ['岡山市', '桃太郎', 'マスカット', 'きびだんご'], difficulty: 'medium' },
  { prefecture: '広島県', hints: ['広島市', 'お好み焼き', 'もみじ饅頭', '牡蠣'], difficulty: 'easy' },
  { prefecture: '山口県', hints: ['山口市', 'フグ', '瓦そば', '秋吉台'], difficulty: 'medium' },
  { prefecture: '徳島県', hints: ['徳島市', 'すだち', '阿波踊り', '鳴門金時'], difficulty: 'medium' },
  { prefecture: '香川県', hints: ['高松市', 'うどん', 'オリーブ', '金刀比羅宮'], difficulty: 'medium' },
  { prefecture: '愛媛県', hints: ['松山市', 'みかん', 'ポンジュース', '道後温泉'], difficulty: 'medium' },
  { prefecture: '高知県', hints: ['高知市', 'カツオのたたき', 'ゆず', '坂本龍馬'], difficulty: 'medium' },
  
  // 九州・沖縄
  { prefecture: '福岡県', hints: ['福岡市', '博多ラーメン', '明太子', '屋台'], difficulty: 'easy' },
  { prefecture: '佐賀県', hints: ['佐賀市', '有田焼', '佐賀牛', 'ムツゴロウ'], difficulty: 'hard' },
  { prefecture: '長崎県', hints: ['長崎市', 'ちゃんぽん', 'カステラ', '五島うどん'], difficulty: 'medium' },
  { prefecture: '熊本県', hints: ['熊本市', '馬刺し', 'からし蓮根', 'くまモン'], difficulty: 'medium' },
  { prefecture: '大分県', hints: ['大分市', '温泉', 'とり天', 'かぼす'], difficulty: 'medium' },
  { prefecture: '宮崎県', hints: ['宮崎市', 'マンゴー', '地鶏', 'チキン南蛮'], difficulty: 'medium' },
  { prefecture: '鹿児島県', hints: ['鹿児島市', '黒豚', 'さつまいも', '桜島'], difficulty: 'medium' },
  { prefecture: '沖縄県', hints: ['那覇市', 'ゴーヤチャンプルー', '泡盛', '首里城'], difficulty: 'easy' },
]

// APIエンドポイント: ランダムなクイズを取得
app.get('/api/quiz/random', (c) => {
  const difficulty = c.req.query('difficulty') || 'all'
  
  let filteredQuizzes = quizData
  if (difficulty !== 'all') {
    filteredQuizzes = quizData.filter(q => q.difficulty === difficulty)
  }
  
  const randomQuiz = filteredQuizzes[Math.floor(Math.random() * filteredQuizzes.length)]
  
  // ヒントをシャッフルして返す
  const shuffledHints = [...randomQuiz.hints].sort(() => Math.random() - 0.5)
  
  return c.json({
    hints: shuffledHints,
    difficulty: randomQuiz.difficulty,
    answer: randomQuiz.prefecture
  })
})

// APIエンドポイント: すべての都道府県リストを取得
app.get('/api/prefectures', (c) => {
  const prefectures = quizData.map(q => q.prefecture).sort()
  return c.json({ prefectures })
})

// メインページ
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>都道府県クイズ</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .fade-in {
                animation: fadeIn 0.5s ease-in;
            }
            .hint-card {
                transition: all 0.3s ease;
            }
            .hint-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
        </style>
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <!-- ヘッダー -->
            <div class="text-center mb-8">
                <h1 class="text-5xl font-bold text-indigo-800 mb-2">
                    <i class="fas fa-map-marked-alt mr-3"></i>
                    都道府県クイズ
                </h1>
                <p class="text-gray-600 text-lg">都市名や名産品から都道府県を当てよう！</p>
            </div>

            <!-- 統計表示 -->
            <div class="max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white rounded-lg shadow-md p-4 text-center">
                    <div class="text-3xl font-bold text-green-600" id="correctCount">0</div>
                    <div class="text-sm text-gray-600">正解数</div>
                </div>
                <div class="bg-white rounded-lg shadow-md p-4 text-center">
                    <div class="text-3xl font-bold text-red-600" id="wrongCount">0</div>
                    <div class="text-sm text-gray-600">不正解数</div>
                </div>
                <div class="bg-white rounded-lg shadow-md p-4 text-center">
                    <div class="text-3xl font-bold text-blue-600" id="accuracy">-</div>
                    <div class="text-sm text-gray-600">正答率</div>
                </div>
            </div>

            <!-- 難易度選択 -->
            <div class="max-w-4xl mx-auto mb-6 bg-white rounded-lg shadow-lg p-6">
                <label class="block text-gray-700 font-bold mb-3">
                    <i class="fas fa-sliders-h mr-2"></i>難易度を選択
                </label>
                <div class="flex flex-wrap gap-2">
                    <button onclick="setDifficulty('all')" class="difficulty-btn px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
                        すべて
                    </button>
                    <button onclick="setDifficulty('easy')" class="difficulty-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">
                        かんたん
                    </button>
                    <button onclick="setDifficulty('medium')" class="difficulty-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">
                        ふつう
                    </button>
                    <button onclick="setDifficulty('hard')" class="difficulty-btn px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">
                        むずかしい
                    </button>
                </div>
            </div>

            <!-- クイズエリア -->
            <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-6">
                <div id="quizArea" class="fade-in">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
                        <i class="fas fa-question-circle mr-2"></i>
                        この都道府県はどこでしょう？
                    </h2>
                    
                    <!-- ヒント表示 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" id="hintsContainer">
                        <!-- JavaScriptで動的に生成 -->
                    </div>

                    <!-- 回答入力 -->
                    <div class="mb-6">
                        <label class="block text-gray-700 font-bold mb-2">
                            <i class="fas fa-keyboard mr-2"></i>都道府県名を入力してください
                        </label>
                        <input 
                            type="text" 
                            id="answerInput" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                            placeholder="例: 北海道"
                            autocomplete="off"
                        >
                    </div>

                    <!-- ボタン -->
                    <div class="flex gap-4">
                        <button 
                            onclick="checkAnswer()" 
                            class="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
                        >
                            <i class="fas fa-check mr-2"></i>回答する
                        </button>
                        <button 
                            onclick="loadNewQuiz()" 
                            class="flex-1 bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition"
                        >
                            <i class="fas fa-redo mr-2"></i>スキップ
                        </button>
                    </div>
                </div>

                <!-- 結果表示エリア -->
                <div id="resultArea" class="hidden">
                    <div id="resultMessage" class="text-center mb-6">
                        <!-- JavaScriptで動的に生成 -->
                    </div>
                    <button 
                        onclick="loadNewQuiz()" 
                        class="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <i class="fas fa-arrow-right mr-2"></i>次の問題へ
                    </button>
                </div>
            </div>

            <!-- フッター -->
            <div class="text-center text-gray-600 text-sm">
                <p>全47都道府県の都市名や名産品を学びましょう！</p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
