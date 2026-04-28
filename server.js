import express from 'express';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url'; // ESM에서 경로를 다루기 위해 필요

const app = express();

// ESM에서는 __dirname이 기본 제공되지 않으므로 아래와 같이 정의해야 합니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경변수에 PORT가 있으면 쓰고, 없으면 3000을 씁니다.
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // 이제 안전하게 __dirname을 사용하여 파일을 보낼 수 있습니다.
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 기존의 인사/나이 계산 로직들...

// Vercel을 위한 내보내기 (ESM 방식)

// 사용자가 루트 경로('/')로 접속했을 때 실행될 로직
//  app.get('/', (req, res) => {
//    res.send(`
//      <h1>데이터 주고받기 연습</h1>
//
//      <h2>GET 방식 - 이름 인사</h2>
//      <form action="/hello" method="GET">
//        <input type="text" name="userName" placeholder="이름을 입력하세요">
//        <button type="submit">인사하기</button>
//      </form>
//
//      <h2>POST 방식 - 내년 나이 계산</h2>
//      <form action="/age" method="POST">
//        <input type="text" name="userName" placeholder="이름을 입력하세요">
//        <input type="number" name="userAge" placeholder="나이를 입력하세요" min="1">
//        <button type="submit">계산하기</button>
//      </form>
//    `);
//  });

app.get('/hello', (req, res) => {
  // 주소창의 쿼리 스트링(?userName=창환)에서 값을 추출합니다.
  const name = req.query.userName;

  if (name) {
    res.send(`<h1>반갑습니다, ${name}님!</h1><a href="/">뒤로 가기</a>`);
  } else {
    res.send('<h1>이름을 입력해 주세요!</h1><a href="/">뒤로 가기</a>');
  }
});

app.get('/api/status', (req, res) => {
  res.json({ platform: os.platform(), nodeVersion: process.version });
});

app.post('/age', (req, res) => {
  const name = req.body.userName;
  const age = parseInt(req.body.userAge, 10);

  if (!name || isNaN(age)) {
    res.send('<h1>이름과 나이를 모두 입력해 주세요!</h1><a href="/">뒤로 가기</a>');
    return;
  }

  const nextAge = age + 1;
  res.send(`<h1>${name}님은 내년에 ${nextAge}살이 되시네요!</h1><a href="/">뒤로 가기</a>`);
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 대기 중입니다.`);
});

// 기존 app.listen() 코드는 그대로 두셔도 됩니다 (로컬 테스트용).
// Vercel은 이 app 객체를 직접 가져가서 사용합니다.
export default app;
