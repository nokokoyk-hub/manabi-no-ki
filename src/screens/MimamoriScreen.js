// ============================================
// 👀 MimamoriScreen - 保護者向け学習状況確認
// 週間記録 + 教科別進捗 + 励ましメッセージ
// ============================================

import React from 'react';
import { COLORS, SUBJECT_COLORS } from '../constants/colors';

const MimamoriScreen = ({ onBack }) => {
  // デモ用データ（将来はSupabaseから取得）
  const weekData = [
    { day: '月', done: true, score: 3 },
    { day: '火', done: true, score: 2 },
    { day: '水', done: true, score: 3 },
    { day: '木', done: false, score: 0 },
    { day: '金', done: true, score: 3 },
    { day: '土', done: false, score: 0 },
    { day: '日', done: false, score: 0 },
  ];

  const totalDays = weekData.filter(d => d.done).length;

  const subjects = [
    { name: 'さんすう', emoji: '🔢', progress: 65, color: SUBJECT_COLORS['さんすう'] },
    { name: 'こくご', emoji: '📖', progress: 45, color: SUBJECT_COLORS['こくご'] },
    { name: 'せいかつ', emoji: '🌱', progress: 30, color: SUBJECT_COLORS['せいかつ'] },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#F5F5F5',
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'white', padding: '16px 20px',
        borderBottom: '2px solid #EEEEEE',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 24,
          cursor: 'pointer', padding: 4,
        }}>
          ←
        </button>
        <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>
          👀 みまもり
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* 統計カード */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{
            background: 'white', borderRadius: 16, padding: 20,
            textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.green }}>
              {totalDays}<span style={{ fontSize: 16 }}>にち</span>
            </div>
            <div style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4 }}>
              こんしゅうの がくしゅう
            </div>
          </div>
          <div style={{
            background: 'white', borderRadius: 16, padding: 20,
            textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.orange }}>
              3<span style={{ fontSize: 16 }}>にち</span>
            </div>
            <div style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4 }}>
              れんぞく ストリーク 🔥
            </div>
          </div>
        </div>

        {/* 週間カレンダー */}
        <div style={{
          background: 'white', borderRadius: 16, padding: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
            📅 こんしゅうの きろく
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 12, color: COLORS.textLight, marginBottom: 8, fontWeight: 600,
                }}>
                  {d.day}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                  background: d.done ? '#E8F5E9' : '#F5F5F5',
                  border: d.done ? `2px solid ${COLORS.green}` : '2px solid #E0E0E0',
                }}>
                  {d.done ? '🌿' : '−'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 教科別進捗 */}
        <div style={{
          background: 'white', borderRadius: 16, padding: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
            📊 きょうかべつ
          </div>
          {subjects.map((s, i) => (
            <div key={i} style={{ marginBottom: i < subjects.length - 1 ? 16 : 0 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 6,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                  {s.emoji} {s.name}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>
                  {s.progress}%
                </span>
              </div>
              <div style={{
                height: 10, background: '#F5F5F5', borderRadius: 5, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', background: s.color, borderRadius: 5,
                  width: `${s.progress}%`, transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* 励ましメッセージ */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF8E1, #FFF3E0)',
          borderRadius: 16, padding: 20,
          border: '2px solid #FFE0B2',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🌟</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, lineHeight: 1.6 }}>
            こんしゅうは {totalDays}にち がくしゅう できました！
          </div>
          <div style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4 }}>
            まいにち すこしずつ、おおきな ちからに なるよ
          </div>
        </div>
      </div>
    </div>
  );
};

export default MimamoriScreen;
