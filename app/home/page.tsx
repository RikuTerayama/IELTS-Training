'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { Task, ProgressSummary } from '@/lib/domain/types';

export default function HomePage() {
  const [recommendedTask, setRecommendedTask] = useState<{
    task: Task;
    estimated_time: number;
  } | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 推奨タスク取得
    fetch('/api/tasks/recommended')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setRecommendedTask(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // 進捗サマリー取得
    fetch('/api/progress/summary')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSummary(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleStartTask = () => {
    if (recommendedTask) {
      router.push(`/task/${recommendedTask.task.id}`);
    }
  };

  const handleChooseLevel = () => {
    // TODO: レベル選択モーダル（簡易版では初級に固定）
    router.push('/task/new?level=beginner');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* カード1: 今日のおすすめ */}
          {recommendedTask && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">今日のおすすめ</h2>
              <div className="space-y-2">
                <p>
                  レベル: <span className="font-medium">{recommendedTask.task.level}</span>
                </p>
                <p>
                  所要時間: <span className="font-medium">{recommendedTask.estimated_time}分</span>
                </p>
                <button
                  onClick={handleStartTask}
                  className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Start
                </button>
              </div>
            </div>
          )}

          {/* カード2: 弱点タグ */}
          {summary && summary.weakness_tags.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">弱点タグ</h2>
              <p className="text-gray-700">
                最近は{summary.weakness_tags.join(', ')}が弱め
              </p>
            </div>
          )}

          {/* クイックアクション */}
          <div className="flex gap-4">
            <button
              onClick={handleChooseLevel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Choose level
            </button>
            <button
              onClick={() => router.push('/vocab')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Vocab 10問
            </button>
          </div>

          {/* Tipsセクション */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">IELTS Tips</h2>
            <div className="space-y-4">
              {/* Reading Tips */}
              <div className="rounded-md border border-blue-100 bg-blue-50 p-4">
                <h3 className="mb-3 font-semibold text-blue-900">📖 Reading 戦略</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="mb-2 font-medium text-gray-900">攻略法</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>本文中から類義語を探す</li>
                      <li>パッセージ1は18分、2は20分、3は22分</li>
                      <li>後で考えない</li>
                      <li>難問の見切りをつける</li>
                      <li>パッセージに目を通し、メインアイディアをつかむ</li>
                      <li>設問に目を通し、同義語、言い換えを考える</li>
                      <li>各段落をスキミングしトピックとメインアイディアを探す</li>
                      <li>関連する段落をスキャニングして答えを見つける</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Not Given問題</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>false/noは根拠に下線が引ける（not givenは下線が引けない）</li>
                      <li>断定的な表現（all, every, alwaysなど）が入っていてもfalseではない</li>
                      <li>trueやyesは100%言い換えられている</li>
                      <li>common senseでも本文に記載がなければnot given</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Heading問題</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>パラグラフの途中で問題を解かない</li>
                      <li>トピックセンテンスとコンクルーディングセンテンスに注目</li>
                      <li>候補となる選択肢を解答用紙に記載</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Matching問題</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>'NB You may use any letter more than once'は2度以上使っても構わないと心得る（それ以外は1回）</li>
                      <li>固有名詞のマッチング（同じ人物名が複数回出てくることがある。全ての人物が回答に関係するわけではない）</li>
                      <li>インフォメーションマッチングの選択肢は概念化される</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Summary Completion</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>選択肢の単語は本文中にないので注意</li>
                      <li>パラグラフを読み終わるごとに該当箇所をチェック</li>
                      <li>品詞とコロケーションの知識で選択肢を絞り込む</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="https://note.com/ielts_consult/n/n019aaecea296"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    詳細はこちら →
                  </a>
                </div>
              </div>

              {/* Listening Tips */}
              <div className="rounded-md border border-green-100 bg-green-50 p-4">
                <h3 className="mb-3 font-semibold text-green-900">🎧 Listening 戦略</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="mb-2 font-medium text-gray-900">攻略法</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Section 1に集中（満点をとること）</li>
                      <li>順番通りに音声は流れないことに注意する</li>
                      <li>カタカナを使ってメモを取る</li>
                      <li>大文字、小文字の区別する</li>
                      <li>複数形と単数形の区別する</li>
                      <li>字数指定に注意する</li>
                      <li>トピックに関する語彙を想像</li>
                      <li>タスクに目を通し、話題、設問を想像</li>
                      <li>設問と回答タイプを確認</li>
                      <li>キーワードの同義語、言い換えを考える</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">設問パターン</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>言い換え（substitutions）</li>
                      <li>暗示型（implications）</li>
                      <li>概念化（conceptualisation / abstraction）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Map重要表現</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>right, immediately, directly（ちょうど、ぴったり）</li>
                      <li>renovate, refurbish（を改装、改築する）</li>
                      <li>facing（の向かいにある）</li>
                      <li>(foot)path（小道、細道）：a path leading to the entrance, a path running to the north</li>
                      <li>clockwise（時計回りに）, counter-clockwise(anti-clockwise)（反時計回りに）</li>
                      <li>bend（曲がり角）, corridor（廊下）, brook（小川）, (dead)end（行き止まり）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">トレーニング</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>CNN, National Geographic, TED Talk, BBCラジオ, CNN student news</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Dictation対策（間違いやすい重要スペリング）</p>
                    <div className="ml-4 space-y-2">
                      <div>
                        <p className="font-medium text-gray-800">場所、建物系</p>
                        <p className="text-xs text-gray-600">garage, reception, veranda, balcony, basement, aquarium, restaurant, castle, council, terrace, studio, desert, mountain, valley, channel, tunnel, coast, canal, harbor, gallery</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">もの系</p>
                        <p className="text-xs text-gray-600">calendar, wool, receipt, umbrella, couch, jewel, diary, battery, oven, vehicle, furniture, brochure, calculator, curtain, dessert, chocolate, alcohol, sculpture, laundry, menu</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">レジャー、イベント系</p>
                        <p className="text-xs text-gray-600">leisure, cycling, journey, grocery, sailing, barbecue, relaxation, exploration, marriage, climbing, conference, competition, ceremony, excursion, voyage</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">キャンパスライフ系</p>
                        <p className="text-xs text-gray-600">science, business, statistics, engineering, technology, language, medicine, research, analysis, survey, resource, catalogue, reference, review, seminar, certificate, interview, guideline, journal, evidence, laboratory, assignment, curriculum</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">環境、健康系</p>
                        <p className="text-xs text-gray-600">environment, weather, species, climate, fuel, coal, drought, temperature, garbage, pollution, flood, recycling, insect, gene, predator, disease, livestock, ozone layer</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">人系</p>
                        <p className="text-xs text-gray-600">scientist, client, clerk, lawyer, vegetarian, secretary, flexibility, confidence, patience, stress, courage, sympathy, pleasure, anxiety, communication</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">状態、行動、変化系</p>
                        <p className="text-xs text-gray-600">success, failure, decision, variety, diversity, improvement, awareness, donation, progress, renovation, survival, creation, vacancy, crisis, repair</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">概念、思考、抽象名詞</p>
                        <p className="text-xs text-gray-600">knowledge, expertise, experience, mechanism, bias, behavior, democracy, religion, image, attitude, status, principle</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">その他</p>
                        <p className="text-xs text-gray-600">government, committee, address, technique, message, surface, pattern, deposit, currency, satellite, pottery, requirement, procedure, insurance, crime</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Dictation対策（複数形）</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>末尾のアルファベット：ch / sh / s / ss / x / z → boxes, beaches, dresses, dishes, watches, buses</li>
                      <li>末尾のアルファベット：o → tomatoes, potatoes, volcanoes, heroes</li>
                      <li>例外：quizzes, photos, casinos</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Dictation対策（特別対応）</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>複合語は1語でスペルアウトする：wildlife, lifestyle, workforce, workplace, countryside, bedroom</li>
                      <li>品詞の変化によって、語尾以外のスペルが変化するものに注意：maintain, maintenance / pronounce, pronunciation</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Dictation対策（数字）</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>同じ数字が連続する場合：2連続（22）→ double two、3連続（222）→ triple two</li>
                      <li>0の聞き分け：zero or o</li>
                      <li>時間の聞き分け：7:00→seven o'clock、3:15→three fifteen、3:30→three thirty、4:10→ten past four（—時から—分過ぎている）、9:45→quarter to ten（—時まで、あと—分）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Dictation対策（固有名詞）</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>M：エンム</li>
                      <li>N：エンヌ</li>
                      <li>R：アー</li>
                      <li>V：ヴィー</li>
                      <li>W：ダブリュー</li>
                      <li>Z：ズィー</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Writing Tips */}
              <div className="rounded-md border border-purple-100 bg-purple-50 p-4">
                <h3 className="mb-3 font-semibold text-purple-900">✍️ Writing 戦略</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="mb-2 font-medium text-gray-900">最重要キーワード</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Argument：主張、理由、根拠</li>
                      <li>Coherence：論理性と一貫性</li>
                      <li>Cohesion：意味的、言語的つながり</li>
                      <li>Lexical Resource：正確に幅広い語彙力</li>
                      <li>Simple & Complex Sentence</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Argument</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Claim：think, agree, suppose</li>
                      <li>Reason：because, as</li>
                      <li>Evidence：facts, statistics</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Coherence</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Logical / Reasonable</li>
                      <li>Structured / Organized</li>
                      <li>Relevant</li>
                      <li>具体的に発信する：For example, such as</li>
                      <li>抽象→具体で述べる（General to Specific）</li>
                      <li>Hedgingで断定的表現を避ける（seem to, tend to, may, might, generally, typically, probably など）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Cohesion</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Cohesive Devices：追加（furthermore, in addition）、譲歩（however, although）、強調（in fact）、順序（firstly, finally）、比較対照（similarly, by contrast）、原因結果（because, therefore）、具体例（for example）、結論（in conclusion）</li>
                      <li>Repetition：同じ表現や語彙を繰り返し使用しない</li>
                      <li>Referencing：指示代名詞や限定詞を用いる</li>
                      <li>Paraphrase：類義語や異なる文構造を使う（Synonym、Word Formation、Sentence Structureの変化）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Lexical Resource</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Style / Register：話し言葉と書き言葉の使い分け</li>
                      <li>Discipline Specific Vocabulary：各分野に応じた語彙</li>
                      <li>Collocation：自然な語彙の組み合わせ</li>
                      <li>Variety：幅広い表現</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">攻略法</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>書きすぎない（Task1は150-200 words、Task2は250-300 words）</li>
                      <li>人称代名詞は必要以上に使わない</li>
                      <li>アカデミックな語彙を用いる（フォーマルな語彙、Phrasal Verbを使わない、Emotive Languageは使わない、否定の接頭辞を使う、FANBOYSを文頭で使わない、IdiomとProverbは使わない）</li>
                      <li>できるだけ消しゴムを使わない、二重線を引いて消す</li>
                      <li>丸暗記はしない、Consistencyを意識する</li>
                      <li>本番と同じ用紙で文字数を極める</li>
                      <li>アメリカ英語とイギリス英語のスペリング統一</li>
                      <li>読みやすいスペリングで書く</li>
                      <li>and so on(forth)やetc.は不要</li>
                      <li>短縮系で書かない</li>
                      <li>代名詞の対象先が遠すぎる場合は、代名詞を使わない</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Task1 重要ポイント</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>全体の概要が書かれているか</li>
                      <li>パラグラフ構成は適切か</li>
                      <li>数値の描写に誤りはないか</li>
                      <li>比較できているか</li>
                      <li>24分を目安に仕上げる</li>
                      <li>Overviewを重視する（Overall, で書き始める、イントロで書く、細かな数値は入れない）</li>
                      <li>必ず比較、対照すること</li>
                      <li>意見や考察を書かない</li>
                      <li>数字表記の5つのルール（10以下はスペル、文頭はスペル、%の前はアラビア数字など）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Task2 重要ポイント</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>イントロに自分自身の意見が書かれているか</li>
                      <li>具体例を提示できているか</li>
                      <li>主張がロジカルか</li>
                      <li>パラグラフ構成（イントロ→ボディ→コンクルージョン）が適切か</li>
                      <li>Cohesive Devices（結束語）の運用</li>
                      <li>パラフレーズ（置き換え、照応、繰り返し）が適切か</li>
                      <li>フォーマルでアカデミックか</li>
                      <li>分野別語彙が使えているか</li>
                      <li>Argumentは2つ提示する</li>
                      <li>100%トピックに従う</li>
                      <li>論理的且つ明確に構成された展開</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Task2 重要パターン</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>Argument Essay：agree/disagree, outweigh, positive/negative</li>
                      <li>Discussion Essay：discuss both views, comparison between advantages and disadvantages</li>
                      <li>Two-question Essay：cause & solution, cause & effect</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">必須表現（Graph）</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>1文目は「このグラフはーを示している」と始める（show, illustrate, provide information on, compare, display）</li>
                      <li>数と量を表す（the number of, the amount of, the percentage of, the figure for）</li>
                      <li>変化を表す（increase, rise, grow / decrease, fall, decline / remain unchanged / fluctuate / peak at, hit the lowest point）</li>
                      <li>程度を表す（大幅：significant, considerable / わずか：slight, modest / 徐々：slow, gradual / 急激：rapid, sharp / 一定：steady, constant）</li>
                      <li>4つのフォーマットをマスター</li>
                      <li>構成を描写（account for, comprise, constitute, represent）</li>
                      <li>倍数、比較、対照の表現（a half, a third, two thirds, double, triple, while, whereas, in contrast, similarly）</li>
                      <li>予測表現（be predicted to do, be projected to do, It is likely that）</li>
                      <li>数値もパラフレーズ（20%→a fifth, 25%→a quarter, 75%→three quarters）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">必須表現（Diagram）</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>位置関係（be located, be situated, lie, be positioned, be surrounded by, on the opposite side of, next to, along）</li>
                      <li>東西南北（north, east, south, west）</li>
                      <li>上下左右（the top left, the centre, the bottom right corner など）</li>
                      <li>大きさ（拡大：be expanded, be widened / 縮小：be shortened, be narrowed / 減少：be cut down, be removed）</li>
                      <li>その他（be turned into, be developed into, A is replaced by B）</li>
                      <li>受動態で書くこと、動詞の用法に注意</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">重要表現（Task2）</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>言い換え文の書き始め（These days, In recent years, Recently, It has been claimed that, Many people believe that）</li>
                      <li>目的文の書き始め（The purpose of this essay is to, In this essay, I will discuss）</li>
                      <li>アイディアの書き始め（One of the main reasons for, To begin with, First of all）</li>
                      <li>理由を述べる（One of the main reasons for, This is largely because）</li>
                      <li>例を挙げる（For example, For instance, such as, A good example is）</li>
                      <li>他のポイントを付け加える（What is more, Moreover, In addition, Furthermore）</li>
                      <li>比較対照する（In contrast, Conversely, whereas, on the other hand, However, although）</li>
                      <li>まとめを述べる（As a result, Consequently, Therefore, Thus）</li>
                      <li>解決策を提示する（One solution would be to, I would suggest）</li>
                      <li>意見を述べる（Personally, I believe, In my opinion, I am convinced that）</li>
                      <li>要約文の書き始め（In conclusion, To conclude, To summarize, In short）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">語彙レベルを上げるために</p>
                    <div className="ml-4 text-xs text-gray-600">
                      <p>chance → opportunity / possibility</p>
                      <p>keep → maintain / continue</p>
                      <p>make → create / produce / generate</p>
                      <p>get → access / achieve / obtain</p>
                      <p>very → considerably / significantly</p>
                      <p>think → consider / believe / assume</p>
                      <p>good → beneficial / advantageous</p>
                      <p>bad → detrimental / harmful</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speaking Tips */}
              <div className="rounded-md border border-orange-100 bg-orange-50 p-4">
                <h3 className="mb-3 font-semibold text-orange-900">🎤 Speaking 戦略</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <p className="mb-2 font-medium text-gray-900">最重要キーワード</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Argument：主張、理由、根拠</li>
                      <li>Coherence：論理性と一貫性（トピックから離れない）</li>
                      <li>Cohesion：意味的、言語的つながり</li>
                      <li>Lexical Resource：正確に幅広い語彙力</li>
                      <li>Simple & Complex Sentence</li>
                      <li>ディスコースマーカーを使う</li>
                      <li>繋ぎ語を使う</li>
                      <li>チャンクで話す</li>
                      <li>上級レベルの単語を使う</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Argument</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Claim：think, agree, suppose</li>
                      <li>Reason</li>
                      <li>Evidence：facts, statistics</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Coherence</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>Logical / Reasonable</li>
                      <li>Structured / Organized</li>
                      <li>Relevant</li>
                      <li>具体的に発信する：For example, such as</li>
                      <li>抽象→具体で述べる（General to Specific）</li>
                      <li>Hedgingで断定的表現を避ける（seem to, tend to, may, might, generally, typically, probably など）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Cohesion</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>Cohesive Devices：追加（furthermore, in addition）、譲歩（however, although）、強調（in fact）、順序（firstly, finally）、比較対照（similarly, by contrast）、原因結果（because, therefore）、具体例（for example）、結論（in conclusion）</li>
                      <li>Repetition：同じ表現や語彙を繰り返し使用しない</li>
                      <li>Referencing：指示代名詞や限定詞を用いる</li>
                      <li>Paraphrase：類義語や異なる文構造を使う（Synonym、Word Formation、Sentence Structureの変化）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">重要ポイント</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>to improve fluency. 文法、語法は後回しでOK</li>
                      <li>ネタは日本語でOK、隙間時間で実施しよう</li>
                      <li>Filterを使おう（Basic: Um.., Er…, Let me see… / Standard: If I remember correctly, / Advanced: I can't say for sure, but I'd say that…）</li>
                      <li>聞き返すこと（Could you repeat the question, please?）</li>
                      <li>5W1Hで情報を補足する</li>
                      <li>おうむ返しではなく、パラフレーズする</li>
                      <li>Advanced：インフォーマルな語彙を使う（I reckon, but, plus, so など）</li>
                      <li>昔の事実と、未来の希望、計画を伝える</li>
                      <li>Generalな解答を心がける</li>
                      <li>Generalな後にPersonalを述べる（Personally speaking, In my own experience など）</li>
                      <li>必勝フレーズをマスター（意見を述べる、追加する、対比させる、理由を挙げる、メリットとデメリットを挙げる）</li>
                      <li>Task2は試験官がStopというまで、話し続ける</li>
                      <li>Chunkで話す（コロケーション、熟語、句動詞、よくある表現）</li>
                      <li>文法の幅と正確さ（almost, most, especially の使い方に注意）</li>
                      <li>ストレスキーワード（内容語は強調、機能語は小さめに）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Task2 ポイント</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>Think 5W1H+past, present, future</li>
                      <li>Make a memo topic by topic</li>
                      <li>Promptに頼らず練習すべし</li>
                      <li>最終目標は100秒</li>
                      <li>3大 favoriteを準備する（a favorite person, a favorite leisure activity, a favorite place in Japan）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">Task3 ポイント</p>
                    <ul className="ml-4 list-disc space-y-1 text-xs">
                      <li>頻出パターン（2者択一、手段・程度、種類、メリット・デメリット、過去との比較、予測、賛否、理由・原因、解決策など）</li>
                      <li>Generalな解答を心がける</li>
                      <li>Generalな後にPersonalを述べる</li>
                      <li>必勝フレーズをマスター（意見を述べる、追加する、対比させる、理由を挙げる、メリットとデメリットを挙げる）</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">上級レベルの単語</p>
                    <div className="ml-4 text-xs text-gray-600">
                      <p>名詞・動詞：assumption/assume, consumer/consume, development/develop, distribution/distribute, participation/participate, requirement/require</p>
                      <p>形容詞・副詞：alternative/alternatively, comprehensive/comprehensively, considerable/considerably, direct/directly, individual/individually, previous/previously, responsible/responsibly</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">ありきたりな単語の推奨代替</p>
                    <div className="ml-4 text-xs text-gray-600">
                      <p>good → beneficial, useful, advantageous, favorable, positive</p>
                      <p>bad → detrimental, harmful, useless, negative</p>
                      <p>difficult → challenging, tough, tricky</p>
                      <p>easy → effortless, simple, uncomplicated</p>
                      <p>expensive → pricey, costly, dear</p>
                      <p>cheap → inexpensive, affordable, low-cost, reasonable</p>
                      <p>think → consider</p>
                      <p>very → considerably</p>
                      <p>chance → opportunity</p>
                      <p>get → obtain</p>
                      <p>give → provide</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-gray-900">繋ぎ語</p>
                    <div className="ml-4 text-xs text-gray-600">
                      <p>again, also, and, and then, besides, equally important, finally, first, further, furthermore, in addition, in the first place, last, moreover, next, second, still, too</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blogセクション */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">📝 Blog</h2>
            <p className="mb-4 text-gray-700">
              IELTS学習に役立つ記事や最新情報をお届けします
            </p>
            <a
              href="https://ieltsconsult.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Blogを読む →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

