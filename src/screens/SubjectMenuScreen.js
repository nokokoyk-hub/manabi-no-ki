// ============================================
// 📂 SubjectMenuScreen - 教科内カテゴリ選択画面
// 教科ボタン → このメニュー → カテゴリ選んで問題 or ずかん
// v0.9.5: 新規作成（りか/げんそ分離対応）
// v1.0.4: CharacterDisplay対応（先生キャラ切替）（2026/06/29）
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors';
import CharacterDisplay from '../components/CharacterDisplay';

// 教科ごとのカテゴリ定義
// ※ 将来カテゴリ追加時はここに追記するだけ
const SUBJECT_CATEGORIES = {
  kokugo: {
    title: 'こくご',
    emoji: '📖',
    categories: [
      { label: 'おくりがな', description: 'かんじの おくりがな', emoji: '✏️', mode: 'okurigana' },
      { label: 'よみかき', description: 'かんじの よみ・かき', emoji: '📝', mode: 'kokugo' },
      // 将来追加: { label: 'かきじゅん', description: 'ただしい かきじゅん', emoji: '✍️', mode: 'kakijun', locked: true },
      // 将来追加: { label: 'どっかい', description: 'ぶんしょうを よみとく', emoji: '📚', mode: 'dokkai', locked: true },
    ],
  },
  genso: {
    title: 'げんそ',
    emoji: '🔬',
    categories: [
      { label: 'もんだい', description: 'げんそきごう・しゅうきひょう', emoji: '🧪', mode: 'genso' },
      { label: 'げんそずかん', description: 'しゅうきひょうを みる', emoji: '🔬', mode: 'zukan', isZukan: true },
    ],
  },
  math: {
    title: 'さんすう',
    emoji: '🔢',
    categories: [
      { label: 'ぜんぶ', description: 'たしざん・ひきざん・かけざん', emoji: '🔢', mode: 'math' },
      // 将来追加: { label: 'たしざん', mode: 'math_tashizan' },
    ],
  },
  rika: {
    title: 'りか',
    emoji: '🌿',
    categories: [
      { label: 'ぜんぶ', description: 'しぜん・いきもの・じっけん', emoji: '🌿', mode: 'rika' },
      // 将来追加: { label: 'しょくぶつ', mode: 'rika_shokubutsu' },
    ],
  },
};

const SubjectMenuScreen = ({ subject, onStartMode, onOpenZukan, onBack, petName, equippedItem, selectedCharacter = 'mame' }) => {
  const config = SUBJECT_CATEGORIES[subject];

  if (!config) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>⚠️ きょうかが みつかりません</p>
        <button onClick={onBack}>もどる</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg }}>
      {/* ヘッダー */}
      <div style={{
        background: 'white',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div
          onClick={onBack}
          style={{ cursor: 'pointer', fontSize: 22, marginRight: 12, padding: '4px 8px' }}
        >
          ←
        </div>
        <div style={{ fontSize: 22, marginRight: 8 }}>{config.emoji}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>
          {config.title}
        </div>
      </div>

      {/* キャラクター */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 16px' }}>
        <CharacterDisplay
          character={selectedCharacter}
          pose="cheer"
          message={`なにを れんしゅうする？`}
          size={80}
          name={petName}
          equippedItem={equippedItem}
        />
      </div>

      {/* カテゴリ一覧 */}
      <div style={{ padding: '0 20px 40px' }}>
        {config.categories.map((cat, i) => {
          const isLocked = cat.locked;

          return (
            <div
              key={i}
              onClick={() => {
                if (isLocked) return;
                if (cat.isZukan && onOpenZukan) {
                  onOpenZukan();
                } else {
                  onStartMode(cat.mode);
                }
              }}
              style={{
                background: isLocked ? '#F5F5F5' : 'white',
                borderRadius: 16,
                padding: 18,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                boxShadow: isLocked ? 'none' : '0 2px 10px rgba(0,0,0,0.06)',
                cursor: isLocked ? 'default' : 'pointer',
                border: `2px solid ${isLocked ? '#E0E0E0' : '#E8F5E9'}`,
                opacity: isLocked ? 0.6 : 1,
                transition: 'transform 0.1s',
              }}
            >
              <div style={{ fontSize: 32, marginRight: 14 }}>
                {isLocked ? '🔒' : cat.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isLocked ? '#9E9E9E' : COLORS.text,
                }}>
                  {cat.label}
                </div>
                <div style={{
                  fontSize: 12,
                  color: isLocked ? '#BDBDBD' : COLORS.textLight,
                  marginTop: 2,
                }}>
                  {isLocked ? 'coming soon' : cat.description}
                </div>
              </div>
              {!isLocked && (
                <div style={{ fontSize: 18, color: COLORS.textLight }}>▶</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectMenuScreen;
