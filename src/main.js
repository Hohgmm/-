const defaultConfig = {
  url: 'https://www.builder.io/c/docs/developers',
  match: 'https://www.builder.io/c/docs/**',
  selector: '.docs-builder-container',
  maxPagesToCrawl: 50,
  outputFileName: 'output.json',
  maxFileSize: 10,
  maxTokens: 200000,
};

const steps = [
  '輸入起始網址，以及 GPT Crawler 後續允許追蹤的網址規則。',
  '選擇包含主要內容的 CSS selector，避免抓取導覽列或頁尾雜訊。',
  '設定頁數、檔案大小與 token 上限，讓輸出檔適合上傳到 GPT 或 Assistants。',
  '複製產生的設定到 config.ts，執行 npm start，然後上傳 output.json。',
];

const state = { ...defaultConfig };
const app = document.querySelector('#app');

function configText() {
  return `export const defaultConfig: Config = ${JSON.stringify(state, null, 2)};`;
}

function renderConfig() {
  document.querySelector('#page-count').textContent = `${state.maxPagesToCrawl} 頁`;
  document.querySelector('#output-name').textContent = state.outputFileName;
  document.querySelector('#config-output').textContent = configText();
}

function updateField(event) {
  const { name, type, value } = event.target;
  state[name] = type === 'number' ? Number(value) : value;
  renderConfig();
}

function field(label, name, type = 'text') {
  return `
    <label>
      ${label}
      <input name="${name}" type="${type}" value="${state[name]}" ${type === 'number' ? 'min="1"' : ''} />
    </label>
  `;
}

app.innerHTML = `
  <main>
    <section class="hero">
      <div class="hero__content">
        <p class="eyebrow">GPT Crawler · 中文 Web App</p>
        <h1>從任何文件網站建立自訂 GPT 可用的知識檔。</h1>
        <p class="hero__text">
          在瀏覽器中設定爬蟲、即時預覽 TypeScript 設定檔，並依照流程產生可上傳到 OpenAI 的
          <code>output.json</code>。
        </p>
        <div class="hero__actions">
          <a href="#builder" class="button button--primary">設定爬蟲</a>
          <a href="#workflow" class="button button--secondary">查看流程</a>
        </div>
      </div>
      <div class="hero__card" aria-label="爬蟲輸出預覽">
        <span class="status-dot"></span>
        <p>準備開始爬取</p>
        <strong id="page-count"></strong>
        <small id="output-name"></small>
      </div>
    </section>

    <section id="builder" class="panel two-column">
      <div>
        <p class="eyebrow">爬蟲設定</p>
        <h2>產生 config.ts</h2>
        <p class="muted">使用表單快速調整 GPT Crawler 最常用的設定項目。</p>
        <form class="config-form">
          ${field('起始網址', 'url')}
          ${field('網址匹配規則', 'match')}
          ${field('內容 CSS selector', 'selector')}
          <div class="form-grid">
            ${field('最多爬取頁數', 'maxPagesToCrawl', 'number')}
            ${field('最大檔案大小 (MB)', 'maxFileSize', 'number')}
            ${field('最大 token 數', 'maxTokens', 'number')}
            ${field('輸出檔名', 'outputFileName')}
          </div>
        </form>
      </div>
      <div class="code-card">
        <div class="code-card__header">
          <span>config.ts</span>
          <button id="copy-config" type="button">複製</button>
        </div>
        <pre id="config-output"></pre>
      </div>
    </section>

    <section id="workflow" class="panel workflow">
      <p class="eyebrow">使用流程</p>
      <h2>從網址到 OpenAI 知識檔</h2>
      <div class="steps">
        ${steps.map((step, index) => `<article><span>${index + 1}</span><p>${step}</p></article>`).join('')}
      </div>
    </section>
  </main>
`;

document.querySelectorAll('input').forEach((input) => input.addEventListener('input', updateField));
document.querySelector('#copy-config').addEventListener('click', async () => {
  await navigator.clipboard.writeText(configText());
});
renderConfig();
