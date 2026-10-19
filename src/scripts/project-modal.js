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
        img: "assets/images/projects/personal-finance-app.webp", cover: false, type: "app",
        live: "https://budget-tracker-v2-gamma.vercel.app/",
        en: {
            cs: ["I first built this in PHP at vocational college to practise what I was learning, hosted on the college's Lolipop server. When that two-year server plan expired, the app went offline.", "Rebuilt it from the ground up as a modern JavaScript web app (React, Vite, Tailwind CSS), added receipt scanning and an AI spending advisor with Gemini, and moved it to Vercel.", "Back online and in daily use — I track my own income, expenses and budgets with it."],
            title: "Personal Finance App",
            desc: "A personal finance app that shows your money at a glance — balance, income and expenses on an elegant card, plus recent activity. You can add transactions, scan a receipt with your camera, set monthly budgets, and ask an AI advisor for spending insights. Built mobile-first, so it feels like a native app on your phone.",
            stack: [
                ["React", "Builds the fast, component-based interface and keeps the screen in sync with your data."],
                ["Vite", "The build tool and dev server — bundles the app and gives instant reloads while developing."],
                ["Tailwind CSS", "Utility-first styling for the polished, responsive mobile design."],
                ["Gemini AI (vision)", "Reads receipts from a photo and powers the AI Advisor’s spending insights."],
                ["Browser storage (localStorage)", "Keeps your transactions and budgets privately on your own device."],
                ["Vercel", "Hosts the app and serves it instantly worldwide."]
            ]
        },
        ja: {
            cs: ["専門学校で学んだ PHP の練習として最初に開発し、学校提供の Lolipop サーバーで公開していました。2年間の利用期間が終了し、アプリが使えなくなりました。", "React・Vite・Tailwind CSS でモダンな JavaScript の Web アプリとして一から作り直し、Gemini によるレシート読み取りと AI 支出アドバイザーを追加して、Vercel に移行しました。", "再び公開され、毎日使っています。自分の収入・支出・予算をこのアプリで管理しています。"],
            title: "家計管理アプリ",
            desc: "お金の状況をひと目で把握できる家計管理アプリ。残高・収入・支出を美しいカードに表示し、最近のアクティビティも確認できます。取引の追加、カメラでのレシート読み取り、月次予算の設定、AIアドバイザーへの支出相談まで可能。モバイルファーストで、スマホでネイティブアプリのように使えます。",
            stack: [
                ["React", "コンポーネントベースの高速なUIを構築し、データと画面を常に同期します。"],
                ["Vite", "ビルドツール兼開発サーバー。アプリをバンドルし、開発中は即時リロードを提供します。"],
                ["Tailwind CSS", "洗練されたレスポンシブなモバイルデザインのためのユーティリティファーストなスタイリングです。"],
                ["Gemini AI（ビジョン）", "写真からレシートを読み取り、AIアドバイザーの支出分析を実現します。"],
                ["ブラウザストレージ（localStorage）", "取引や予算のデータを端末内にプライベートに保存します。"],
                ["Vercel", "アプリを世界中へ瞬時に配信するホスティングです。"]
            ]
        }
    },
    salary: {
        img: "assets/images/projects/salary-tracker.webp", cover: false, type: "app",
        live: "https://salary-tracker-v3-six.vercel.app/",
        en: {
            cs: ["Working in Japan, I needed one place to track my salary and the money I send home. My original PHP version from college went offline when the college's Lolipop server plan expired.", "Rebuilt it as a bilingual, mobile-first web app (React, Vite, Tailwind CSS, Recharts) with earnings, remittance totals, percentage sent and charts, and deployed it on Vercel.", "I use it every month — and a friend liked it so much that I showed her how to use it. She now tracks her own salary with it too."],
            title: "Salary Tracker App",
            desc: "A bilingual salary & remittance tracker built for working in Japan. See your total earnings, how much you’ve sent home, your remaining balance and the percentage sent — plus recent salaries, remittances and charts. Supports EN / 日本語 and light / dark themes, mobile-first.",
            stack: [
                ["React", "Builds the interactive, component-based interface for salaries, remittances and stats."],
                ["Vite", "Fast build tool and dev server that bundles and runs the app."],
                ["Tailwind CSS", "Utility-first styling for the clean, responsive layout and light / dark themes."],
                ["Recharts", "Renders the earnings and remittance charts on the Charts screen."],
                ["Browser storage (localStorage)", "Saves your salary and remittance records privately on your device."],
                ["Vercel", "Hosts and delivers the app globally."]
            ]
        },
        ja: {
            cs: ["日本で働くなかで、給料と仕送りを一か所で管理したいと考えました。学生時代に作った PHP 版は、学校の Lolipop サーバーの利用期間終了とともに使えなくなりました。", "React・Vite・Tailwind CSS・Recharts で、バイリンガル・モバイルファーストの Web アプリとして作り直しました。収入、送金額、送金割合、グラフを確認でき、Vercel で公開しています。", "毎月自分で使っています。友人も気に入ってくれたので使い方を教え、今では彼女も自分の給料管理に使っています。"],
            title: "給料トラッカーアプリ",
            desc: "日本で働く人のためのバイリンガル給料・送金管理アプリ。総収入、仕送り額、残高、送金の割合に加え、最近の給料・送金・グラフを確認できます。英語・日本語とライト／ダークテーマに対応し、モバイルファースト設計です。",
            stack: [
                ["React", "給料・送金・統計を扱うインタラクティブなコンポーネントUIを構築します。"],
                ["Vite", "アプリをバンドルして動かす、高速なビルドツール兼開発サーバーです。"],
                ["Tailwind CSS", "クリーンでレスポンシブなレイアウトと、ライト／ダークテーマのためのスタイリングです。"],
                ["Recharts", "チャート画面で収入・送金のグラフを描画します。"],
                ["ブラウザストレージ（localStorage）", "給料・送金の記録を端末内にプライベートに保存します。"],
                ["Vercel", "アプリを世界中に配信するホスティングです。"]
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
            const dd = document.createElement("dd"); dd.textContent = row[1];
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
        document.getElementById("pmInstallNote").textContent = t.installNote;
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
