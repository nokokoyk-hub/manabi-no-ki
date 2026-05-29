// ============================================
// 🎚️ LevelSettingsScreen - 教科別レベル設定画面
// 凸凹ちゃん向けに「算数はレベル1、国語はレベル4」など自由設定
// ============================================

import React from 'react';
import MameCharacter from '../components/MameCharacter';
import { COLORS } from '../constants/colors';
import {
  SUBJECT_LEVELS,
  MIN_LEARNING_LEVEL,
  MAX_LEARNING_LEVEL,
  getLevelLabel,
  normalizeSubjectLevels,
} from '../constants/learningLevels';

const LevelSettingsScreen = ({ levels, onChange, onBack }) => {
  const normalizedLevels = normalizeSubjectLevels(levels);

  const updateLevel = (subjectKey, level) => {
    onChange({
      ...normalizedLevels,
      [subjectKey]: level,
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.sky} 0%, ${COLORS.bg} 40%, ${COLORS.bgSoft} 100%)`,
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      color: COLORS.text,
    }}>
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(255,255,255,0.9)', borderBottom: '2px solid #F5F5F5',
        position: 'sticky', top: 0, zIndex: 2,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 24,
          cursor: 'pointer', padding: 4,
        }}>
          ←
        </button>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.greenDark }}>
            🎚️ レベル設定
          </div>
          <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
            教科ごとに いまの 得意・苦手へ あわせます
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{
          background: 'white', borderRadius: 20, padding: 18, marginBottom: 16,
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <MameCharacter
            pose="heart"
            message="とくいも にがても その子のペースで ええんだよ！"
            size={72}
          />
          <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textLight, fontWeight: 700 }}>
            さんすうは やさしく、こくごは ぐんぐん。<br />
            凸凹に合わせて ミッションの問題を えらぶよ。
          </div>
        </div>

        {SUBJECT_LEVELS.map((subject) => {
          const currentLevel = normalizedLevels[subject.key];
          return (
            <div key={subject.key} style={{
              background: 'white', borderRadius: 18, padding: 18, marginBottom: 14,
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              border: '2px solid #F5F5F5',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text }}>
                    {subject.emoji} {subject.label}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>
                    {subject.description}
                  </div>
                </div>
                <div style={{
                  background: '#FFF3E0', color: COLORS.orange, borderRadius: 999,
                  padding: '6px 12px', fontSize: 13, fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}>
                  {getLevelLabel(currentLevel)}
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
                marginTop: 14,
              }}>
                {Array.from({ length: MAX_LEARNING_LEVEL - MIN_LEARNING_LEVEL + 1 }, (_, i) => i + MIN_LEARNING_LEVEL).map(level => {
                  const selected = currentLevel === level;
                  return (
                    <button
                      key={level}
                      onClick={() => updateLevel(subject.key, level)}
                      style={{
                        border: selected ? `2px solid ${COLORS.green}` : '2px solid #E0E0E0',
                        background: selected ? '#E8F5E9' : 'white',
                        color: selected ? COLORS.greenDark : COLORS.textLight,
                        borderRadius: 14,
                        padding: '12px 6px',
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontFamily: "'Rounded Mplus 1c', sans-serif",
                      }}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 10, lineHeight: 1.6 }}>
                {currentLevel <= 1 ? subject.lowHint : subject.highHint}
              </div>
            </div>
          );
        })}

        <button
          onClick={onBack}
          style={{
            width: '100%', border: 'none', borderRadius: 18, padding: '16px 20px',
            background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.greenDark})`,
            color: 'white', fontSize: 16, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(76,175,80,0.28)',
            fontFamily: "'Rounded Mplus 1c', sans-serif",
          }}
        >
          ✅ このレベルで はじめる
        </button>
      </div>
    </div>
  );
};

export default LevelSettingsScreen;
