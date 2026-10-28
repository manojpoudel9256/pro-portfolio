// ===== PROJECT DETAIL MODAL (Selected Work) =====
const PT = {
    en: {
        website: "Website", app: "Installable Web App",
        csProblem: "The problem", csDid: "What I did", csResult: "Result",
        builtWith: "Built with", live: "View live", open: "Open the app", code: "View on GitHub",
        installTitle: "Use it as an app on your iPhone",
        installNote: "This is a web app — no App Store needed. Add it to your home screen and it opens full-screen, just like a native app.",
        steps: [
            "Open the app link above in <strong>Safari</strong> on your iPhone.",
            "Tap the <strong>Share</strong> button — the square with an arrow pointing up — in the toolbar.",
            "Scroll down and tap <strong>“Add to Home Screen.”</strong>",
            "Tap <strong>“Add”</strong> in the top-right corner.",
            "The app icon now sits on your home screen — tap it to launch it full-screen anytime."
        ]
    },
    ja: {
        website: "ウェブサイト", app: "インストール可能なウェブアプリ",
        csProblem: "課題", csDid: "取り組んだこと", csResult: "成果",
        builtWith: "使用技術", live: "ライブを見る", open: "アプリを開く", code: "GitHub で見る",
        installTitle: "iPhoneでアプリのように使う",
        installNote: "これはウェブアプリなので App Store は不要です。ホーム画面に追加すると、ネイティブアプリのように全画面で起動します。",
        steps: [
            "iPhoneの<strong>Safari</strong>で上のアプリのリンクを開きます。",
            "ツールバーの<strong>共有</strong>ボタン（上向き矢印付きの四角）をタップします。",
            "下にスクロールして<strong>「ホーム画面に追加」</strong>をタップします。",
            "右上の<strong>「追加」</strong>をタップします。",
            "ホーム画面にアイコンが追加されます。タップすればいつでも全画面で起動できます。"
        ]
    }
};

const PROJECTS = {
    everest: {
        img: "assets/images/projects/everest-travel.webp", cover: true, type: "website",
        live: "https://travel-site-delta-five.vercel.app/",
        en: {
            cs: ["I wanted to practise building a polished, bilingual marketing site — the kind a travel company would use to sell premium tours.", "Designed and built it from scratch as a personal concept project: a scroll-driven cinematic hero, tour highlights, guide profiles and an EN / 日本語 toggle, fully responsive with Tailwind CSS.", "A live, responsive site on Vercel that shows my front-end, layout and bilingual UX skills."],
            title: "Everest Travel Experience",
            desc: "A cinematic marketing website for Mount Everest expeditions. It sells curated Himalayan adventure tours through an immersive, scroll-driven hero, tour highlights, expert-guide sections and a bilingual EN / 日本語 interface — designed to make visitors feel the journey before they book it.",
            stack: [
                ["HTML5", "Builds the semantic structure and content of every section of the site."],
                ["Tailwind CSS", "Utility-first styling for the clean, fully responsive layout across phone, tablet and desktop."],
                ["JavaScript", "Powers interactivity — the language toggle, smooth scroll effects and the animated hero."],
                ["Vercel", "Hosts and delivers the site globally so it loads fast anywhere."]
            ]
        },
        ja: {
            cs: ["旅行会社がプレミアムツアーの販売に使うような、完成度の高いバイリンガルのマーケティングサイトを作る練習をしたいと考えました。", "個人のコンセプトプロジェクトとしてゼロから設計・開発。スクロール連動のシネマティックなヒーロー、ツアー紹介、ガイド紹介、英語・日本語切り替えを実装し、Tailwind CSS でレスポンシブに対応しました。", "Vercel で公開中。フロントエンド実装、レイアウト、バイリンガル UX のスキルを示す作品になりました。"],
            title: "エベレスト・トラベル体験",
            desc: "エベレスト遠征のための、映画のようなマーケティングサイト。没入感のあるスクロール連動ヒーロー、ツアー紹介、専門ガイドの解説、英語・日本語のバイリンガル対応で、厳選されたヒマラヤ・アドベンチャーツアーを訴求します。予約する前に「旅」を体感してもらうためのデザインです。",
            stack: [
                ["HTML5", "サイト各セクションのセマンティックな構造とコンテンツを構築します。"],
                ["Tailwind CSS", "ユーティリティファーストのスタイリングで、スマホ・タブレット・PCに対応するクリーンなレスポンシブレイアウトを実現します。"],
                ["JavaScript", "言語切り替え、スムーズなスクロール演出、アニメーションするヒーローなどのインタラクションを担当します。"],
                ["Vercel", "サイトを世界中へ高速配信するホスティングです。"]
            ]
        }
    },
    budget: {
        img: "assets/images/projects/budget-tracker-16x9.webp", cover: true, fullImg: true, type: "app",
        live: "https://budget-tracker-v2-gamma.vercel.app/",
        en: {
            cs: ["I first built this in PHP at vocational college to practise what I was learning, hosted on the college's Lolipop server. When that two-year plan expired, the app went offline. Typing in every receipt by hand was also slow, and Japanese payslips are hard to read when Japanese isn't your first language.", ["I rebuilt it from scratch as an installable, offline-ready web app in plain JavaScript, with no framework:", "Home at a glance: balance, income and spending, a budget line with a marker for today, safe-to-spend per day, a month-end forecast, and a comparison with last month.", "Add in seconds: your most-used categories are one tap away, with Undo instead of “are you sure?”.", "Scan receipts and salary slips (photo or PDF): read on your phone by default, with no account or key. Gemini can read harder documents more accurately, using your own free Google key, which the app tests before saving it. Take-home pay is recorded as income; deductions are kept as details.", "Budget Assistant: ask “How much did I spend on groceries this month?”, 今月の家賃以外の支出 or yo mahina kati kharcha?. Every number is calculated on the device and shows how it was worked out. Gemini only helps read an unusual question and never sees your amounts.", "Budgets and history: monthly limits per category, including for one month only, with a pace marker and a “spending fast” warning; search and filters across your whole history.", "Reports: a spending breakdown, monthly trends, and a shareable report image.", "Safe data: backup reminders, checked imports, and one step back after an import or reset."], "Back online and in daily use — I track my income, salary, spending and budgets with it every week."],
            title: "Budget Tracker / 家計簿",
            desc: "A calm, bilingual budget book for life in Japan. It shows your balance, what you've spent this month and what's safe to spend today. You can scan a receipt or a Japanese salary slip to add it, and ask questions about your money in English, 日本語 or Romanised Nepali. Designed like a Japanese account book — warm paper, ink and a red hanko-style stamp — and built mobile-first, so it feels like a native app on your phone. Your records stay on your device.",
            installExtra: "It works offline too.",
            stack: [
                ["JavaScript, HTML and CSS", "No framework or build tooling for the app itself, so it stays light and fast."],
                ["Custom design system (“Washi Ledger”)", "A self-hosted serif (Fraunces) and sans-serif (Instrument Sans), ruled ledger layouts, and chart colours checked for colour-blind readers."],
                ["Custom SVG charts and Canvas", "Interactive charts, and the shareable report image."],
                ["Tesseract.js and PDF.js", "Read English and Japanese receipts and PDFs on the device."],
                ["Google Gemini API", "Optional, more accurate document reading; it also helps interpret unusual assistant questions."],
                ["Vercel serverless function", "Keeps the Gemini key on the server and adds rate limits so the service can't be abused."],
                ["Browser storage (localStorage)", "Your records stay on your own device, with exact money calculations and data checks."],
                ["Service worker and web app manifest", "Install it like an app; it works offline."],
                ["Node.js tests and Playwright", "Automated checks for the money calculations, the assistant, security, every screen at phone to desktop sizes, and real on-device scanning."],
                ["Security headers", "A strict Content Security Policy, HSTS and protection against being embedded in other sites."],
                ["Vercel", "Hosting, with automatic deploys from GitHub."]
            ]
        },
        ja: {
            cs: ["専門学校で学んだ PHP の練習として最初に開発し、学校の Lolipop サーバーで公開していました。2年間の利用期間が終わるとアプリは使えなくなりました。また、レシートを毎回手入力するのは時間がかかり、日本語が母語でない人にとって日本の給与明細は読みにくいものです。", ["フレームワークを使わないプレーンな JavaScript で、インストールしてオフラインでも使えるウェブアプリとして一から作り直しました：", "ひと目でわかるホーム：残高、収入と支出、今日の位置を示す予算ライン、1日あたり安心して使える金額、月末の見込み、先月との比較。", "数秒で記録：よく使うカテゴリーはワンタップ。「本当に削除しますか？」の代わりに「元に戻す」で取り消せます。", "レシート・給与明細のスキャン（写真またはPDF）：標準ではアカウントもキーも不要で、スマホ上で読み取ります。読み取りにくい書類は、ご自身の無料 Google キーで Gemini を使うとより正確に読み取れます（キーは保存前にアプリが動作を確認します）。手取り額は収入として記録し、控除は内訳として残します。", "家計アシスタント：「How much did I spend on groceries this month?」「今月の家賃以外の支出」「yo mahina kati kharcha?」のように質問できます。数値はすべて端末内で計算し、計算の根拠も表示します。Gemini は珍しい質問の解釈を手伝うだけで、金額データを見ることはありません。", "予算と履歴：カテゴリーごとの月間上限（今月だけの設定も可能）、ペースマーカーと「使いすぎ」の警告、全履歴の検索とフィルター。", "レポート：支出の内訳、月ごとの推移、共有できるレポート画像。", "安全なデータ管理：バックアップのリマインダー、チェック付きのインポート、インポートやリセット後に1ステップ戻せる機能。"], "再び公開され、毎日使っています。毎週、収入・給料・支出・予算をこのアプリで管理しています。"],
            title: "家計簿 / Budget Tracker",
            desc: "日本での暮らしのための、落ち着いたバイリンガル家計簿。残高、今月の支出、今日安心して使える金額がひと目でわかります。レシートや日本の給与明細をスキャンして登録でき、お金についての質問を英語・日本語・ローマ字表記のネパール語でできます。温かみのある和紙、墨、赤いはんこ風のスタンプで日本の家計簿のようにデザインし、モバイルファーストで作っているので、スマホではネイティブアプリのように使えます。記録は端末内に保存されます。",
            installExtra: "オフラインでも使えます。",
            stack: [
                ["JavaScript・HTML・CSS", "アプリ本体はフレームワークもビルドツールも使わないため、軽量で高速です。"],
                ["独自デザインシステム（Washi Ledger）", "セルフホストのセリフ体（Fraunces）とサンセリフ体（Instrument Sans）、罫線入りの帳簿レイアウト、色覚の多様性に配慮して確認したチャートの配色。"],
                ["自作の SVG チャートと Canvas", "操作できるグラフと、共有できるレポート画像。"],
                ["Tesseract.js と PDF.js", "英語・日本語のレシートや PDF を端末内で読み取ります。"],
                ["Google Gemini API", "任意で使える、より正確な書類の読み取り。アシスタントへの珍しい質問の解釈も手伝います。"],
                ["Vercel サーバーレス関数", "Gemini のキーをサーバー側で管理し、悪用を防ぐためのレート制限を加えています。"],
                ["ブラウザストレージ（localStorage）", "記録はご自身の端末内に保存され、正確な金額計算とデータチェックを行います。"],
                ["Service Worker とウェブアプリマニフェスト", "アプリのようにインストールでき、オフラインでも動作します。"],
                ["Node.js テストと Playwright", "金額計算、アシスタント、セキュリティ、スマホからPCまでの全画面、端末上での実際のスキャンを自動でチェックします。"],
                ["セキュリティヘッダー", "厳格なコンテンツセキュリティポリシー、HSTS、他サイトへの埋め込み防止。"],
                ["Vercel", "GitHub からの自動デプロイによるホスティングです。"]
            ]
        }
    },
    salary: {
        img: "assets/images/projects/salary-tracker-16x9.webp", cover: true, fullImg: true, type: "app",
        live: "https://salary-tracker-v3-six.vercel.app/",
        en: {
            cs: ["Working in Japan, I needed one place to track my salary and the money I send home. My original PHP version from college went offline when the college's Lolipop server plan expired. Typing in every payslip by hand was also slow, and Japanese payslips are hard to read if Japanese isn't your first language.", ["I rebuilt it from scratch as an installable, offline-ready web app in plain JavaScript, with no framework and no build step. Features:", "Dashboard: earned, sent home and kept, plus monthly trends.", "Remittance hub: an animated transfer path from Japan to Nepal, a yearly goal ring, and fees and exchange rates for each transfer.", "Insights: lifetime and year-by-year views, a year-end forecast, and a report card you can save as an image to share.", "Smart import: upload a payslip PDF or receipt photo. Google Gemini reads it, translates each Japanese item, and shows a summary for you to check before anything is saved.", "AI Financial Assistant: ask “How much pension did I pay in 2026?” or “How much did I send to my mother last year?” The app works out every number on the device, so the AI never invents figures. Each answer shows how it was calculated. More than 100 automated tests check the answers stay correct.", "Everyday tools: search, backup reminders, and renaming workplaces or the people you send money to."], "I use it every month. A friend liked it so much that I showed her how to use it, and she now tracks her own salary with it too."],
            title: "Salary Tracker App",
            desc: "A bilingual salary and remittance tracker for people working in Japan. It shows what you've earned, what you've sent home, and what you kept. You can scan a payslip or receipt to add it, and ask an AI assistant questions about your money in plain English, Japanese or Romanised Nepali. Supports EN / 日本語 and light / dark themes, and is built mobile-first. Your data stays on your device.",
            installExtra: "It also works offline.",
            stack: [
                ["JavaScript, HTML and CSS", "No framework and no build step, so the app is small and fast."],
                ["Custom SVG charts", "Hand-built charts with hover details and smooth animation."],
                ["Canvas", "Draws the report-card images you can share."],
                ["Browser storage (localStorage)", "Your records stay on your device, with backup and restore."],
                ["Service worker and web app manifest", "You can install it and it works offline."],
                ["Google Gemini API", "Reads payslips and receipts, and helps the assistant understand questions. Your amounts are never sent to it."],
                ["Node.js test runner", "More than 100 automated tests for the calculations and the assistant."],
                ["Content Security Policy", "Limits what the page is allowed to load, for security."],
                ["Vercel", "Hosting, with automatic deploys from GitHub."]
            ]
        },
        ja: {
            cs: ["日本で働くなかで、給料と仕送りを一か所で管理したいと考えました。学生時代に作った PHP 版は、学校の Lolipop サーバーの利用期間終了とともに使えなくなりました。また、給与明細を毎回手入力するのは手間がかかり、日本語が母語でない人にとって日本の給与明細は読みにくいものです。", ["フレームワークもビルドも使わないプレーンな JavaScript で、インストールしてオフラインでも使えるウェブアプリとして一から作り直しました。主な機能：", "ダッシュボード：稼いだ金額・仕送り額・手元に残った金額と、月ごとの推移。", "送金ハブ：日本からネパールへの送金ルートのアニメーション、年間目標のリング、送金ごとの手数料と為替レート。", "インサイト：累計と年別の表示、年末の見込み、画像として保存して共有できるレポートカード。", "スマートインポート：給与明細の PDF やレシートの写真をアップロードすると、Google Gemini が読み取って日本語の各項目を翻訳し、保存前に確認できる要約を表示します。", "AI ファイナンシャルアシスタント：「2026年に年金をいくら払った？」「去年、母にいくら送った？」のように質問できます。数値はすべて端末内で計算するため、AI が数字を作り出すことはありません。回答ごとに計算の根拠を表示し、100以上の自動テストで回答の正しさを確認しています。", "日常のツール：検索、バックアップのリマインダー、勤務先や送金相手の名前の変更。"], "毎月自分で使っています。友人も気に入ってくれたので使い方を教え、今では彼女も自分の給料管理に使っています。"],
            title: "給料トラッカーアプリ",
            desc: "日本で働く人のためのバイリンガル給料・送金管理アプリ。稼いだ金額、仕送りした金額、手元に残った金額がひと目でわかります。給与明細やレシートをスキャンして登録でき、お金についての質問をAIアシスタントに英語・日本語・ローマ字表記のネパール語で気軽に聞けます。英語・日本語、ライト／ダークテーマに対応したモバイルファースト設計で、データは端末内にだけ保存されます。",
            installExtra: "オフラインでも使えます。",
            stack: [
                ["JavaScript・HTML・CSS", "フレームワークもビルドも使わないため、アプリは軽量で高速です。"],
                ["自作の SVG チャート", "ホバー時の詳細表示となめらかなアニメーションを備えた手作りのグラフです。"],
                ["Canvas", "共有できるレポートカード画像を描画します。"],
                ["ブラウザストレージ（localStorage）", "記録は端末内に保存され、バックアップと復元にも対応します。"],
                ["Service Worker とウェブアプリマニフェスト", "インストールでき、オフラインでも動作します。"],
                ["Google Gemini API", "給与明細やレシートを読み取り、アシスタントが質問を理解するのを助けます。金額データが送信されることはありません。"],
                ["Node.js テストランナー", "計算とアシスタントを確認する100以上の自動テストです。"],
                ["コンテンツセキュリティポリシー（CSP）", "セキュリティのため、ページが読み込めるものを制限します。"],
                ["Vercel", "GitHub からの自動デプロイによるホスティングです。"]
            ]
        }
    },
    glbAnalyzer: {
        img: "assets/images/projects/glb-analyzer.webp", cover: true, fullImg: true, type: "website", repo: true,
        live: "https://github.com/manojpoudel9256/GLBAnalyzer",
        en: {
            cs: ["My team lead needed a fast, reliable way to check a 3D model's polygon counts, texture sizes and file size before it went into production.", "Built a browser tool that reads any .glb file and reports triangles, textures and data size per object, with a one-click PDF report for the team.", "Now used by my team lead and team to check models before they go into Unreal Engine."],
            title: "GLB Insight",
            desc: "An internal tool I built at work after my team lead needed a fast, reliable way to see the full technical breakdown of any 3D model before it went into production. Drop in a .glb file and it instantly reports the polygon (triangle) counts, texture sizes and total data size, with a per-object breakdown — and it exports a complete PDF report you can hand to the team. I designed it around the .glb format on purpose: a single .glb carries the model's complete meshes and original-quality textures and is the cleanest format to import into Unreal Engine, so the tool analyses the exact asset that ships. It became part of our team's everyday workflow and my lead personally thanked me for it. Run it locally in minutes: clone the repo, npm install, then start it and open the tool in your browser.",
            stack: [
                ["JavaScript (ES modules)", "Parses the .glb / glTF binary to pull out meshes, textures and buffers, then computes the stats."],
                ["Node.js", "Runs the analysis pipeline and the small local tool server."],
                ["glTF (Khronos)", "The 3D asset format it inspects — geometry, materials and embedded textures."],
                ["Three.js", "Renders the optional in-browser 3D preview of the loaded model."]
            ]
        },
        ja: {
            cs: ["チームリーダーから、本番投入前に3Dモデルのポリゴン数・テクスチャサイズ・ファイルサイズを素早く正確に確認できる方法が欲しいと依頼されました。", ".glb ファイルを読み込み、オブジェクトごとに三角形数・テクスチャ・データサイズを表示し、ワンクリックで PDF レポートを書き出せるブラウザツールを開発しました。", "現在、チームリーダーとチームが Unreal Engine に取り込む前のモデル確認に使っています。"],
            title: "GLB モデル解析ツール",
            desc: "社内で私が開発したツールです。チームリーダーから「本番で使う前に、3Dモデルの詳細（ポリゴン数やテクスチャサイズ）を素早く正確に把握できるツールが欲しい」と依頼を受けて制作しました。.glb ファイルをドロップすると、ポリゴン（三角形）数・テクスチャサイズ・データサイズを即座に表示し、オブジェクト別の内訳まで確認できます。さらに、すべての詳細をまとめた PDF レポートを書き出してチームに共有できます。あえて .glb 形式に対応させたのは、1つの .glb にモデルのメッシュとオリジナル品質のテクスチャがすべて含まれ、Unreal Engine への取り込みに最適な形式だからです。実際に取り込むアセットそのものを解析できます。このツールはチームの日常業務に組み込まれ、リーダーからも直接感謝されました。ローカル実行も簡単で、リポジトリをクローンして npm install し、起動してブラウザで開くだけです。",
            stack: [
                ["JavaScript（ESモジュール）", ".glb / glTF バイナリを解析し、メッシュ・テクスチャ・バッファを抽出して統計を算出します。"],
                ["Node.js", "解析パイプラインとローカルのツールサーバーを実行します。"],
                ["glTF（Khronos）", "解析対象の3Dアセット形式。ジオメトリ・マテリアル・テクスチャを含みます。"],
                ["Three.js", "読み込んだモデルのブラウザ内3Dプレビューを描画します。"]
            ]
        }
    },
    glbForge: {
        img: "assets/images/projects/glb-optimizer.webp", cover: true, fullImg: true, type: "website", repo: true,
        live: "https://github.com/manojpoudel9256/GLBOptimizer",
        en: {
            cs: ["For very complex objects, our team generates 3D models with Meshy AI. They often come out extremely dense — around a million triangles and ~20 MB — which makes Unreal Engine hang or crash on import.", "Built GLB Forge to simplify meshes and downscale textures locally in the browser, with a before/after 3D viewer to confirm the model still looks right.", "Typical results on our AI-generated models: about 1M → 100k triangles and ~20 MB → 4–5 MB, so they import cleanly and run smoothly in Unreal Engine."],
            title: "GLB Forge",
            desc: "A companion tool I created at work to solve a real production problem: when a 3D model's polygon count is too high, importing it into Unreal Engine — or any real-time 3D / simulation environment — can hang on load or crash the whole scene. I built GLB Forge to fix that by cutting the polygon count and downscaling the model's textures, so heavy assets import cleanly and run smoothly — all 100% locally in the browser, with nothing uploaded. A built-in before/after 3D viewer (Preview, Inspect, split-screen Compare and Mesh-Density modes) lets you confirm the model still looks right after optimization, and it strips UE5-incompatible extensions for clean imports. Together with GLB Insight, it's an internal tool our team relies on, built end-to-end by me. Setup is quick: with Node 18+, run npm install once, then npm start and open http://localhost:3000.",
            stack: [
                ["Node.js", "Runs the local server and the whole optimization pipeline — no framework, no uploads."],
                ["Three.js (r165)", "Powers the built-in 3D viewer: Preview, Inspect, Compare and Mesh-Density modes."],
                ["glTF-Transform + meshoptimizer", "Simplify meshes, resample animations and remove UE5-incompatible extensions."],
                ["sharp", "Downscales and re-encodes textures to shrink the final file."]
            ]
        },
        ja: {
            cs: ["形状が非常に複雑なモデルは、チームで Meshy AI を使って生成しています。生成モデルは約100万ポリゴン・約20MBと非常に重くなることが多く、Unreal Engine への取り込み時にフリーズやクラッシュの原因になっていました。", "メッシュの簡略化とテクスチャ縮小をブラウザ内でローカル処理し、before/after の3Dビューアで見た目を確認できる GLB Forge を開発しました。", "AI生成モデルでの目安は、約100万 → 10万ポリゴン、約20MB → 4〜5MB。Unreal Engine にスムーズに取り込めて、動作も軽くなりました。"],
            title: "GLB モデル最適化ツール",
            desc: "社内で私が開発した、GLB Insight と対になるツールです。3Dモデルのポリゴン数が多すぎると、Unreal Engine やその他のリアルタイム3D・シミュレーション環境に取り込む際に、読み込みが止まったりシーン全体がクラッシュしたりすることがあります。GLB Forge はこの課題を解決するために制作しました。ポリゴン数を削減し、テクスチャを縮小することで、重いアセットでもクリーンに取り込め、動作も軽くなります。処理はすべてブラウザ上（localhost）で完結し、ファイルはアップロードされません。Preview・Inspect・分割表示の Compare・Mesh Density を備えた圧縮前後の3Dビューアで、最適化後もモデルが正しく見えるか確認でき、UE5非対応の拡張も除去します。GLB Insight とともにチームが実際に使う社内ツールで、すべて私が制作しました。セットアップも手軽で、Node 18以上で npm install を行い、npm start して http://localhost:3000 を開くだけです。",
            stack: [
                ["Node.js", "ローカルサーバーと最適化パイプライン全体を実行します（フレームワーク不使用・アップロードなし）。"],
                ["Three.js（r165）", "Preview・Inspect・Compare・Mesh Density モードを備えた内蔵3Dビューアを実現します。"],
                ["glTF-Transform + meshoptimizer", "メッシュの簡略化、アニメーションのリサンプリング、UE5非対応拡張の除去を担当します。"],
                ["sharp", "テクスチャを縮小・再エンコードして最終ファイルを軽量化します。"]
            ]
        }
    }
};

let _openProj = null;

function renderProject() {
    const id = _openProj; if (!id) return;
    const p = PROJECTS[id]; if (!p) return;
    const lang = (window.__lang === "ja") ? "ja" : "en";
    const t = PT[lang]; const c = p[lang];
    const media = document.getElementById("pmMedia");
    const img = document.getElementById("pmImg");
    img.src = p.img; img.alt = c.title;
    media.classList.toggle("is-app", !p.cover);
    media.classList.toggle("is-full", !!p.fullImg);
    document.getElementById("pmKind").textContent = (p.type === "app") ? t.app : t.website;
    document.getElementById("pmTitle").textContent = c.title;
    document.getElementById("pmDesc").textContent = c.desc;
    const caseEl = document.getElementById("pmCase");
    caseEl.innerHTML = "";
    if (c.cs) {
        [[t.csProblem, c.cs[0]], [t.csDid, c.cs[1]], [t.csResult, c.cs[2]]].forEach(function (row) {
            const d = document.createElement("div");
            const dt = document.createElement("dt"); dt.textContent = row[0];
            const dd = document.createElement("dd");
            if (Array.isArray(row[1])) {
                const intro = document.createElement("p"); intro.textContent = row[1][0];
                const list = document.createElement("ul");
                row[1].slice(1).forEach(function (item) {
                    const li = document.createElement("li");
                    const cut = item.search(/[:：]/);
                    if (cut > 0 && cut < 60) {
                        const label = document.createElement("strong"); label.textContent = item.slice(0, cut + 1);
                        li.append(label, " " + item.slice(cut + 1).trim());
                    } else li.textContent = item;
                    list.appendChild(li);
                });
                dd.append(intro, list);
            } else dd.textContent = row[1];
            d.appendChild(dt); d.appendChild(dd); caseEl.appendChild(d);
        });
    }
    const live = document.getElementById("pmLive");
    live.href = p.live;
    live.querySelector("span").textContent = p.repo ? t.code : t.live;
    document.getElementById("pmBuilt").textContent = t.builtWith;
    const stack = document.getElementById("pmStack");
    stack.innerHTML = "";
    c.stack.forEach(function (row) {
        const li = document.createElement("li");
        const n = document.createElement("span"); n.className = "ps-name"; n.textContent = row[0];
        const f = document.createElement("span"); f.className = "ps-fn"; f.textContent = row[1];
        li.appendChild(n); li.appendChild(f); stack.appendChild(li);
    });
    const install = document.getElementById("pmInstall");
    if (p.type === "app") {
        install.style.display = "";
        document.getElementById("pmInstallTitle").textContent = t.installTitle;
        document.getElementById("pmInstallNote").textContent = t.installNote + (c.installExtra ? (lang === "ja" ? "" : " ") + c.installExtra : "");
        const steps = document.getElementById("pmSteps");
        steps.innerHTML = "";
        t.steps.forEach(function (s) { const li = document.createElement("li"); li.innerHTML = "<span>" + s + "</span>"; steps.appendChild(li); });
        const open = document.getElementById("pmOpen");
        open.href = p.live;
        open.querySelector("span").textContent = t.open;
    } else {
        install.style.display = "none";
    }
}

// Dialog focus: move focus in on open, keep Tab inside, give it back on close.
window.dialogFocus = window.dialogFocus || (function () {
    const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const openers = new Map();
    document.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;
        const dlg = [...openers.keys()].pop();
        if (!dlg) return;
        const items = [...dlg.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dlg.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !dlg.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    });
    return {
        open(dlg, initial) {
            if (!openers.has(dlg)) openers.set(dlg, document.activeElement);
            // The dialog fades in from visibility:hidden, which can't take focus
            // on the first frame; retry briefly until it lands.
            const target = initial || dlg.querySelector(FOCUSABLE);
            let tries = 0;
            (function tryFocus() {
                if (!target || !openers.has(dlg)) return;
                target.focus({ preventScroll: true });
                if (document.activeElement !== target && ++tries < 20) requestAnimationFrame(tryFocus);
            })();
        },
        close(dlg) {
            const back = openers.get(dlg);
            openers.delete(dlg);
            if (back && back.focus && document.contains(back)) back.focus({ preventScroll: true });
        }
    };
})();

function openProject(id) {
    if (!PROJECTS[id]) return;
    _openProj = id;
    renderProject();
    const m = document.getElementById("projModal");
    // The dialog element is reused for every project: always start at the top.
    m.querySelector(".proj-dialog").scrollTop = 0;
    m.classList.add("active");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (window.lenis) window.lenis.stop();
    window.dialogFocus.open(m, m.querySelector(".proj-close"));
}

function closeProject() {
    const m = document.getElementById("projModal");
    if (!m) return;
    m.classList.remove("active");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (window.lenis) window.lenis.start();
    _openProj = null;
    window.dialogFocus.close(m);
}

window.__refreshProjModal = function () {
    const m = document.getElementById("projModal");
    if (m && m.classList.contains("active")) renderProject();
};

document.addEventListener("DOMContentLoaded", function () {
    const m = document.getElementById("projModal");
    if (m) m.addEventListener("click", function (e) { if (e.target === m) closeProject(); });
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.getElementById("projModal").classList.contains("active")) closeProject();
});
