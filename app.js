// app.js
import os from 'os';
import chalk from 'chalk';

console.log("안녕하세요, Node.js 환경이 준비되었습니다!");
console.log(`현재 사용자: ${chalk.blue(os.userInfo().username)}`);
console.log(`시스템 메모리: ${chalk.green((os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB')}`);

const cpus = os.cpus();
console.log(`CPU 모델: ${cpus[0].model}`);
console.log(`CPU 코어 수: ${cpus.length}개`);
console.log(`CPU 속도: ${cpus[0].speed} MHz`);
