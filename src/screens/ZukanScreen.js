// ============================================
// 🔬 ZukanScreen - げんそずかん（周期表ビューア）
// v0.9.1: 新規作成
// スマホでピンチズーム＋スクロール対応
// ============================================

import React, { useState } from 'react';
import { COLORS } from '../constants/colors';

const ZukanScreen = ({ petName, onBack }) => {
  const displayName = petName || 'まめ';
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #E8F5E9 0%, #F1F8E9 30%, #FFFFFF 100%)',
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    }}>
      {/* ヘッダー */}
      <div style={{
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'white',
        borderBottom: '2px solid #F5F5F5',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 24,
          cursor: 'pointer', padding: 4,
        }}>
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 18, fontWeight: 800, color: COLORS.greenDark,
          }}>
            🔬 げんそずかん
          </div>
          <div style={{
            fontSize: 12, color: COLORS.textLight, fontWeight: 600,
          }}>
            げんそ しゅうきひょう — ゆびで ひろげて みてね！
          </div>
        </div>
      </div>

      {/* 周期表画像エリア */}
      <div style={{
        padding: '16px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* 説明テキスト */}
        <div style={{
          background: 'white', borderRadius: 16,
          padding: '12px 20px', marginBottom: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          textAlign: 'center',
          width: '100%', maxWidth: 500,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>
            🌍 この せかいは ぜんぶ「げんそ」で できている！
          </div>
          <div style={{ fontSize: 13, color: COLORS.textLight, lineHeight: 1.6 }}>
            みず は H（すいそ）と O（さんそ）で できてるよ。<br />
            {displayName}の からだにも いろんな げんそが はいってるんだ！
          </div>
        </div>

        {/* 周期表画像（タップでズーム対応） */}
        <div
          onClick={() => setIsZoomed(!isZoomed)}
          style={{
            width: '100%', maxWidth: 600,
            overflow: isZoomed ? 'scroll' : 'hidden',
            WebkitOverflowScrolling: 'touch',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            background: 'white',
            cursor: 'pointer',
            maxHeight: isZoomed ? '70vh' : 'none',
          }}
        >
          <img
            src="/public/images/genso_hyou.png"
            alt="げんそ しゅうきひょう（元素周期表）"
            style={{
              width: isZoomed ? '250%' : '100%',
              height: 'auto',
              display: 'block',
              borderRadius: isZoomed ? 0 : 16,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* ズームヒント */}
        <div style={{
          marginTop: 8, fontSize: 13, fontWeight: 700,
          color: isZoomed ? '#FF6F00' : COLORS.textLight,
          textAlign: 'center',
        }}>
          {isZoomed
            ? '🔍 ゆびで スクロールできるよ！もういちど タップで もどる'
            : '👆 タップで おおきく できるよ！'}
        </div>

        {/* ミニ知識コーナー */}
        <div style={{
          marginTop: 16, padding: '16px 20px',
          background: '#FFF8E1', borderRadius: 16,
          width: '100%', maxWidth: 500,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FF8F00', marginBottom: 8 }}>
            💡 しってた？
          </div>
          <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.8 }}>
            ・にほんで はっけんされた げんそが <strong>4つ</strong> あるよ！<br />
            ・ニホニウム（Nh）は にほんの なまえが ついた げんそだよ🇯🇵<br />
            ・きんぞくの げんそが いちばん おおいんだ！<br />
            ・からだの なかで いちばん おおい げんそは さんそ（O）だよ
          </div>
        </div>

        {/* 戻るボタン */}
        <button
          onClick={onBack}
          style={{
            marginTop: 20, marginBottom: 40,
            background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
            color: 'white', border: 'none', borderRadius: 16,
            padding: '14px 32px', fontSize: 16, fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(76,175,80,0.3)',
            fontFamily: "'Rounded Mplus 1c', sans-serif",
          }}
        >
          🏠 ホームに もどる
        </button>
      </div>
    </div>
  );
};

export default ZukanScreen;
