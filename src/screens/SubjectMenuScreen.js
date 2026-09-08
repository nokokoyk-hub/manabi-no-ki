// ============================================
// 📂 SubjectMenuScreen - 教科内カテゴリ選択画面
// 教科ボタン → このメニュー → カテゴリ選んで問題 or ずかん
// v0.9.5: 新規作成（りか/げんそ分離対応）
// v1.0.4: CharacterDisplay対応（先生キャラ切替）（2026/06/29）
// v1.0.14: 着せ替え複数装着対応（equippedItems）
// ============================================

import React from 'react';
import { PageHeader } from '../components/ForestUI';
import CharacterDisplay from '../components/CharacterDisplay';

// 教科ごとのカテゴリ定義
// ※ 将来カテゴリ追加時はここに追記するだけ
const SUBJECT_CATEGORIES = {
  shakai: {
    title: 'しゃかい',
    categories: [{
      label: 'くらしを たんけん',
      description: 'まち・くらし・にほん',
      emoji: '🌏',
      mode: 'shakai'
    }]
  },
  clock: {
    title: 'とけい',
    categories: [{
      label: 'じかんに チャレンジ',
      description: 'なんじ・なんぷん',
      emoji: '⏰',
      mode: 'clock'
    }]
  },
  doutoku: {
    title: 'どうとく',
    categories: [{
      label: 'きもちを かんがえよう',
      description: 'おもいやり・ルール・きもち',
      emoji: '💛',
      mode: 'doutoku'
    }]
  },
  kokugo: {
    title: 'こくご',
    emoji: '📖',
    categories: [{
      label: 'おくりがな',
      description: 'かんじの おくりがな',
      emoji: '✏️',
      mode: 'okurigana'
    }, {
      label: 'よみかき',
      description: 'かんじの よみ・かき',
      emoji: '📝',
      mode: 'kokugo'
    }
    // 将来追加: { label: 'かきじゅん', description: 'ただしい かきじゅん', emoji: '✍️', mode: 'kakijun', locked: true },
    // 将来追加: { label: 'どっかい', description: 'ぶんしょうを よみとく', emoji: '📚', mode: 'dokkai', locked: true },
    ]
  },
  genso: {
    title: 'げんそ',
    emoji: '🔬',
    categories: [{
      label: 'もんだい',
      description: 'げんそきごう・しゅうきひょう',
      emoji: '🧪',
      mode: 'genso'
    }, {
      label: 'げんそずかん',
      description: 'しゅうきひょうを みる',
      emoji: '🔬',
      mode: 'zukan',
      isZukan: true
    }]
  },
  math: {
    title: 'さんすう',
    emoji: '🔢',
    categories: [{
      label: 'ぜんぶ',
      description: 'たしざん・ひきざん・かけざん',
      emoji: '🔢',
      mode: 'math'
    }
    // 将来追加: { label: 'たしざん', mode: 'math_tashizan' },
    ]
  },
  rika: {
    title: 'りか',
    emoji: '🌿',
    categories: [{
      label: 'ぜんぶ',
      description: 'しぜん・いきもの・じっけん',
      emoji: '🌿',
      mode: 'rika'
    }
    // 将来追加: { label: 'しょくぶつ', mode: 'rika_shokubutsu' },
    ]
  }
};
const SubjectMenuScreen = ({
  subject,
  onStartMode,
  onOpenZukan,
  onBack,
  petName,
  equippedItems,
  selectedCharacter = 'mame'
}) => {
  const config = SUBJECT_CATEGORIES[subject];
  if (!config) {
    return <div style={{
      padding: 40,
      textAlign: 'center'
    }}>
        <p>⚠️ きょうかが みつかりません</p>
        <button onClick={onBack}>もどる</button>
      </div>;
  }
  return <main className="mn-page mn-subject-page"><PageHeader title={config.title} onBack={onBack} /><p className="mn-note">じぶんの ペースで たんけんしよう！</p>
    {config.categories.map((cat, i) => <section className={i === 0 ? 'mn-practice-card' : 'mn-practice-card mn-secondary-practice'} key={cat.mode}>
      {i === 0 && <div><CharacterDisplay character={selectedCharacter} pose="cheer" size={125} name={petName} equippedItems={equippedItems} /></div>}
      <h2>{cat.emoji} {cat.label === 'ぜんぶ' ? 'れんしゅうに チャレンジ' : cat.label}</h2><p>{cat.description}</p>
      <button className={i === 0 ? 'reward-primary' : 'reward-secondary'} disabled={!!cat.locked} onClick={() => cat.isZukan ? onOpenZukan?.() : onStartMode(cat.mode)}>{cat.isZukan ? 'ずかんを みる' : 'はじめる'} <span aria-hidden="true">›</span></button>
    </section>)}<p className="mn-note">🌿 あせらず いっしょに やってみよう</p>
  </main>;
};
export default SubjectMenuScreen;
