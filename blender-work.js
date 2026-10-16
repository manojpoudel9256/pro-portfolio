/* Gallery metadata is small; Three.js and the original GLB load only on inspect. */
(() => {
    'use strict';
    const section = document.getElementById('blender-work');
    const dialog = document.getElementById('blenderInspector');
    if (!section || !dialog) return;
    const $ = id => document.getElementById(id);
    const lang = () => document.documentElement.lang === 'ja' ? 'ja' : 'en';
    const copy = {
        en: {
            eyebrow: 'Modeling & asset creation', title: 'Blender Work',
            intro: 'Models created in Blender for logistics, automation, and real-time scenes. Explore each asset in 3D and take a closer look at its geometry.',
            inspect: 'Inspect model', footnote: 'AI-styled previews based on the models. The inspector displays each original GLB file.',
            viewer: 'Interactive model inspector', close: 'Close model inspector', reset: 'Reset view', wireframe: 'Wireframe', rotate: 'Auto-rotate', reducedMotion: 'Auto-rotation is disabled while reduced motion is enabled.', environment: 'Lighting', studio: 'Studio', dark: 'Dark studio',
            help: 'Drag to orbit · Scroll or pinch to zoom · Right-drag or two-finger drag to pan. Keyboard: arrows to orbit, + / − to zoom, Home to reset.',
            triangles: 'Triangles', vertices: 'Exported vertices', meshes: 'Meshes', materials: 'Materials', textures: 'Textures', size: 'GLB file size', dimensions: 'Dimensions (X × Y × Z)',
            statNote: 'GLB geometry is triangulated; original Blender quad counts are not retained. Counts include mesh instances. Dimensions use the exported scene’s meter units.',
            play: 'Play animation', pause: 'Pause animation', clips: 'Animation clips', animated: 'Animated', animations: 'animations',
            loading: 'Preparing your model…', downloading: 'Loading model', failed: 'The 3D viewer could not load. Please try again, or use a browser with WebGL support.', retry: 'Try again', canvas: 'Interactive 3D model. Drag to rotate, or use arrow keys. Plus and minus zoom; Home resets the view.'
        },
        ja: {
            eyebrow: 'モデリング・アセット制作', title: 'Blender 制作',
            intro: '物流、自動化、リアルタイムシーン向けにBlenderで制作した3Dモデル。各アセットを自由に回転させ、形状や構成を詳しくご覧いただけます。',
            inspect: '3Dモデルを見る', footnote: 'プレビューはモデルを参考にAIで制作した画像です。ビューアには元のGLBファイルを表示します。',
            viewer: '3Dモデルビューア', close: 'モデルビューアを閉じる', reset: '視点をリセット', wireframe: 'ワイヤーフレーム', rotate: '自動回転', reducedMotion: '動きを減らす設定が有効なため、自動回転は無効です。', environment: '照明', studio: 'スタジオ', dark: 'ダークスタジオ',
            help: 'ドラッグで回転・スクロール／ピンチで拡大縮小・右ドラッグ／2本指で移動。キーボード：矢印キーで回転、＋／−で拡大縮小、Homeでリセット。',
            triangles: '三角形ポリゴン', vertices: '出力された頂点', meshes: 'メッシュ', materials: 'マテリアル', textures: 'テクスチャ', size: 'GLBファイルサイズ', dimensions: '寸法（X × Y × Z）',
            statNote: 'GLBの形状は三角形に変換されるため、Blenderでの四角形ポリゴン数とは異なります。数値はメッシュの配置数を含み、寸法は出力シーンのメートル単位です。',
            play: 'アニメーション再生', pause: '一時停止', clips: 'アニメーション', animated: 'アニメーション付き', animations: '種類のアニメーション',
            loading: 'モデルを準備しています…', downloading: 'モデルを読み込み中', failed: '3Dビューアを読み込めませんでした。再試行するか、WebGL対応のブラウザをご利用ください。', retry: '再試行', canvas: '操作できる3Dモデル。ドラッグまたは矢印キーで回転、＋と−で拡大縮小、Homeで視点をリセットします。'
        }
    };
    let models, model, viewer, controller, library, saved, trigger, metadata, request = 0, progress = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controls = [$('biReset'), $('biWireframe'), $('biRotate'), $('biEnvironment')];
    function loadMetadata() {
        return metadata ||= fetch('assets/models/blender/models.json').then(response => {
            if (!response.ok) throw new Error('Model metadata unavailable');
            return response.json();
        }).then(data => { models = data; translate(); return data; }).catch(error => {
            metadata = null;
            throw error;
        });
    }
    // The error is displayed only if a visitor opens the inspector.
    loadMetadata().catch(() => {});
    const text = key => copy[lang()][key];
    const number = value => new Intl.NumberFormat(lang() === 'ja' ? 'ja-JP' : 'en-US').format(value);
    const size = bytes => bytes >= 1e6 ? (bytes / 1e6).toFixed(2) + ' MB' : (bytes / 1e3).toFixed(1) + ' KB';
    function translate() {
        [section, dialog].forEach(root => {
            root.querySelectorAll('[data-bw-text]').forEach(el => { el.textContent = text(el.dataset.bwText); });
        });
        $('biClose').setAttribute('aria-label', text('close'));
        updateMotionControl();
        if (models) section.querySelectorAll('.bw-card').forEach(card => {
            const data = models[card.dataset.model];
            card.querySelector('.bw-name').textContent = data.title[lang()];
            card.querySelector('.bw-desc').textContent = data.description[lang()];
            card.querySelector('.bw-cover img').alt = data.title[lang()] + (lang() === 'ja' ? 'のAIスタジオプレビュー' : ' — AI studio preview');
            card.querySelectorAll('[data-inspect-model]').forEach(button => button.setAttribute('aria-label', text('inspect') + ': ' + data.title[lang()]));
            card.querySelector('[data-bw-triangles]').textContent = number(data.stats.triangles) + (lang() === 'ja' ? ' 三角形' : ' triangles');
            const sizeEl = card.querySelector('[data-bw-size]');
            if (sizeEl) sizeEl.textContent = size(data.fileSizeBytes);
            const animEl = card.querySelector('[data-bw-anim]');
            const clipCount = (data.animations || []).length;
            if (animEl) {
                animEl.hidden = !clipCount;
                animEl.textContent = clipCount > 1 ? (lang() === 'ja' ? clipCount + text('animations') : clipCount + ' ' + text('animations')) : text('animated');
            }
        });
        dialog.querySelectorAll('[data-bw-aria]').forEach(el => el.setAttribute('aria-label', text(el.dataset.bwAria)));
        renderAnimationUI();
        if (model) {
            $('biTitle').textContent = model.title[lang()];
            $('biDescription').textContent = model.description[lang()];
            renderStats();
        }
        const canvas = $('biViewport').querySelector('canvas');
        if (canvas) canvas.setAttribute('aria-label', text('canvas'));
        statusText();
    }
    function renderStats() {
        const values = { ...model.stats, size: size(model.fileSizeBytes), dimensions: ['x','y','z'].map(k => number(Math.round(model.dimensions[k] * 1000) / 1000)).join(' × ') + ' m' };
        dialog.querySelectorAll('[data-bi-value]').forEach(el => { const v = values[el.dataset.biValue]; el.textContent = typeof v === 'number' ? number(v) : v; });
    }
    function statusText() {
        $('biStatusText').textContent = dialog.dataset.state === 'error' ? text('failed') : progress === null ? text('loading') : text('downloading') + ' · ' + Math.round(progress * 100) + '%';
    }
    function state(value) {
        dialog.dataset.state = value;
        $('biStatus').hidden = value === 'ready';
        $('biRetry').hidden = value !== 'error';
        $('biProgress').hidden = value === 'error';
        $('biViewport').setAttribute('aria-busy', String(value === 'loading'));
        controls.forEach(control => { control.disabled = value !== 'ready'; });
        updateMotionControl();
        statusText();
    }
    function updateMotionControl() {
        $('biRotate').disabled = dialog.dataset.state !== 'ready' || reducedMotion.matches;
        $('biRotate').title = reducedMotion.matches ? text('reducedMotion') : '';
        if (reducedMotion.matches) {
            $('biRotate').setAttribute('aria-pressed', 'false');
            viewer?.setAutoRotate(false);
        }
    }
    // ── Animation playback (models with glTF clips only) ──
    let clipName = null;
    function renderAnimationUI() {
        const clips = (model && viewer && model.animations || []).filter(a => viewer.getAnimations().some(c => c.name === a.clip));
        $('biAnim').hidden = !clips.length;
        if (!clips.length) return;
        clipName ||= clips[0].clip;
        const wrap = $('biClips');
        wrap.hidden = clips.length < 2;
        wrap.replaceChildren(...clips.map(a => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'bi-control bi-clip'; b.dataset.clip = a.clip;
            b.textContent = a.label[lang()] || a.clip;
            b.setAttribute('aria-pressed', String(a.clip === clipName));
            return b;
        }));
        const on = viewer.isPlaying();
        $('biPlay').setAttribute('aria-pressed', String(on));
        $('biPlayLabel').textContent = text(on ? 'pause' : 'play');
    }
    $('biPlay').addEventListener('click', () => {
        if (!viewer) return;
        if (viewer.isPlaying()) viewer.pauseAnimation(); else viewer.playAnimation(clipName);
        renderAnimationUI();
    });
    $('biClips').addEventListener('click', event => {
        const b = event.target.closest('[data-clip]');
        if (!b || !viewer) return;
        clipName = b.dataset.clip;
        viewer.playAnimation(clipName);
        renderAnimationUI();
    });
    async function load(id) {
        const token = ++request;
        controller?.abort(); viewer?.dispose(); viewer = null;
        controller = new AbortController();
        const signal = controller.signal;
        progress = null;
        $('biProgress').removeAttribute('value');
        $('biWireframe').setAttribute('aria-pressed', 'false');
        $('biRotate').setAttribute('aria-pressed', 'false');
        $('biEnvironment').value = 'studio';
        clipName = null;
        $('biAnim').hidden = true;
        state('loading');
        try {
            const data = await loadMetadata();
            if (token !== request || !dialog.open) return;
            model = data[id];
            if (!model) throw new Error('Unknown model');
            translate();
            library ||= import('./blender-viewer.js').catch(error => { library = null; throw error; });
            const module = await library;
            if (token !== request || !dialog.open) return;
            const instance = await module.createModelViewer($('biViewport'), model, { signal, onError: () => {
                if (token !== request || !dialog.open) return;
                viewer = null;
                state('error');
            }, onProgress: value => {
                if (token !== request || !dialog.open) return;
                progress = Math.max(0, Math.min(1, value)); $('biProgress').value = progress; statusText();
            } });
            if (token !== request || !dialog.open) { instance.dispose(); return; }
            viewer = instance;
            state('ready');
            translate();
        } catch (error) {
            if (token === request && dialog.open && error.name !== 'AbortError') state('error');
        }
    }
    function open(id, button) {
        if (dialog.open) return;
        trigger = button; model = null;
        saved = { root: document.documentElement.style.overflow, body: document.body.style.overflow, lenis: window.lenis, stopped: window.lenis?.isStopped };
        saved.lenis?.stop();
        document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
        $('biTitle').textContent = button.closest('.bw-card').querySelector('.bw-name').textContent;
        $('biDescription').textContent = '';
        dialog.querySelectorAll('[data-bi-value]').forEach(el => { el.textContent = '—'; });
        dialog.dataset.model = id;
        dialog.showModal();
        $('biClose').focus({ preventScroll: true });
        load(id);
    }
    function cleanup() {
        request++; controller?.abort(); controller = null; viewer?.dispose(); viewer = null;
        $('biViewport').replaceChildren();
        if (saved) {
            document.documentElement.style.overflow = saved.root; document.body.style.overflow = saved.body;
            if (saved.lenis && !saved.stopped) saved.lenis.start();
            saved = null;
        }
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    }
    section.addEventListener('click', event => { const button = event.target.closest('[data-inspect-model]'); if (button) open(button.dataset.inspectModel, button); });
    $('biClose').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', cleanup);
    let backdrop = false;
    dialog.addEventListener('pointerdown', event => { backdrop = event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom); });
    dialog.addEventListener('click', event => { if (backdrop && event.target === dialog) dialog.close(); backdrop = false; });
    $('biRetry').addEventListener('click', () => load(dialog.dataset.model));
    $('biReset').addEventListener('click', () => viewer?.reset());
    for (const [id, method] of [['biWireframe','setWireframe'],['biRotate','setAutoRotate']]) $(id).addEventListener('click', () => {
        const on = $(id).getAttribute('aria-pressed') !== 'true'; $(id).setAttribute('aria-pressed', String(on)); viewer?.[method](on);
    });
    $('biEnvironment').addEventListener('change', () => viewer?.setEnvironment($('biEnvironment').value));
    window.addEventListener('portfolio:languagechange', translate);
    reducedMotion.addEventListener('change', updateMotionControl);
    window.addEventListener('pagehide', () => { if (dialog.open) dialog.close(); cleanup(); });
    translate();
})();
