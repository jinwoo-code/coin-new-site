import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './page/main';
import ApplyPage from './page/apply';
import './index.css'; // ★ 전역 스타일을 여기서 import 합니다.

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/apply" element={<ApplyPage />} />
        {/* 다른 라우트가 있다면 여기에 추가 */}
      </Routes>
    </div>
  );
}

export default App;