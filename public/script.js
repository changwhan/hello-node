// ── 상태 폴링 ──────────────────────────────────────────

const STATUS_INTERVAL_MS = 5000;

async function fetchStatus() {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('non-2xx');
    const data = await res.json();
    const now = new Date().toLocaleTimeString('ko-KR');
    document.getElementById('status-content').innerHTML = `
      <div class="status-row"><span>서버</span><span class="badge green">정상</span></div>
      <div class="status-row"><span>플랫폼</span><span class="status-val">${data.platform}</span></div>
      <div class="status-row"><span>Node.js</span><span class="status-val">${data.nodeVersion}</span></div>
      <div class="status-row"><span>마지막 갱신</span><span class="status-val">${now}</span></div>
    `;
  } catch {
    document.getElementById('status-content').innerHTML = `
      <div class="status-row"><span>서버</span><span class="badge red">연결 오류</span></div>
    `;
  }
}

// 페이지 로드 시 즉시 1회 실행 후 5초마다 반복
fetchStatus();
setInterval(fetchStatus, STATUS_INTERVAL_MS);

// ── 탭 전환 ────────────────────────────────────────────

const TAB_TITLES = { home: '홈', hello: '인사하기', age: '나이 계산' };

function switchTab(tab, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');
  document.getElementById('page-title').textContent = TAB_TITLES[tab];
}

// ── 인사 (GET /hello) ──────────────────────────────────

async function sayHello() {
  const name = document.getElementById('helloName').value.trim();
  if (!name) { showAlert('이름을 입력해주세요!'); return; }
  try {
    const res = await fetch(`/hello?userName=${encodeURIComponent(name)}`);
    const html = await res.text();
    const match = html.match(/<h1>(.*?)<\/h1>/);
    showResult('hello', match ? match[1] : '서버 응답을 읽지 못했어요');
  } catch {
    showResult('hello', '서버에 연결할 수 없어요');
  }
}

// ── 나이 계산 (POST /age) ──────────────────────────────

async function calcAge() {
  const name = document.getElementById('ageName').value.trim();
  const age  = document.getElementById('ageInput').value;
  if (!name || !age) { showAlert('이름과 나이를 모두 입력해주세요!'); return; }
  try {
    const res = await fetch('/age', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `userName=${encodeURIComponent(name)}&userAge=${encodeURIComponent(age)}`,
    });
    const html = await res.text();
    const match = html.match(/<h1>(.*?)<\/h1>/);
    showResult('age', match ? match[1] : '서버 응답을 읽지 못했어요');
  } catch {
    showResult('age', '서버에 연결할 수 없어요');
  }
}

// ── 공통 UI 헬퍼 ───────────────────────────────────────

function showResult(type, text) {
  const card = document.getElementById(type + '-result');
  document.getElementById(type + '-result-text').textContent = text;
  card.hidden = false;
  card.classList.remove('pop-in');
  void card.offsetWidth; // reflow로 애니메이션 재실행
  card.classList.add('pop-in');
}

function showAlert(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 2000);
}
