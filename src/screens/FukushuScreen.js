// ============================================
// 📚 FukushuScreen - ふくしゅう画面
// 最近の学習セッションから、やさしく復習メニューをすすめる
// v0.6.0: petName対応
// ============================================

import React, { useEffect, useMemo, useState } from 'react';
import MameCharacter from '../components/MameCharacter';
import { COLORS } from '../constants/colors';
import { getRecentSessions } from '../lib/storage';

const MODE_INFO = {
  mission: {
    label: 'ぜんたいミッション',
    shortLabel: 'ぜんたい',
    emoji: '📝',
    description: 'いろんな もんだいを まぜて れんしゅう',
    startMode: 'mission',
  },
  okurigana: {
    label: 'おくりがな',
    shortLabel: 'おくりがな',
    emoji: '✏️',
    description: 'かんじの おくりがなを やさしく ふくしゅう',
    startMode: 'okurigana',
  },
  clock: {
    label: 'とけい',
    shortLabel: 'とけい',
    emoji: '⏰',
    description: 'なんじ・なんぷんを もういちど',
    startMode: 'clock',
  },
  math: {
    label: 'さんすう きそ',
    shortLabel: 'さんすう',
    emoji: '🔢',
    description: 'その子のレベルに合わせた さんすう',
    startMode: 'math',
  },
  kokugo: {
    label: 'こくご よみ',
    shortLabel: 'こくご',
    emoji: '📖',
    description: 'かんじ・ことばを 得意に合わせて',
    startMode: 'kokugo',
  },
};

const DEFAULT_REVIEW_MODES = ['math', 'okurigana', 'clock', 'kokugo'];

const percent = (score, total) => {
  if (!total) return 0;
  return Math.round((score / total) * 100);
};

const analyzeSessions = (sessions) => {
  const grouped = sessions.reduce((acc, session) => {
    const mode = session.mode || 'mission';
    if (!acc[mode]) {
      acc[mode] = {
        mode,
        score: 0,
        total: 0,
        count: 0,
        latest: session.completed_at,
      };
    }

    acc[mode].score += Number(session.score || 0);
    acc[mode].total += Number(session.total_questions || 0);
    acc[mode].count += 1;

    if (session.completed_at && (!acc[mode].latest || session.completed_at > acc[mode].latest)) {
      acc[mode].latest = session.completed_at;
    }

    return acc;
  }, {});

  return Object.values(grouped)
    .map(item => ({
      ...item,
      rate: percent(item.score, item.total),
    }))
    .sort((a, b) => {
      if (a.rate !== b.rate) return a.rate - b.rate;
      return b.count - a.count;
    });
};

const buildRecommendations = (analysis) => {
  if (!analysis.length) {
    return DEFAULT_REVIEW_MODES.map(mode => ({
      mode,
      reason: 'まずは ここから はじめよう',
      rate: null,
    }));
  }

  const weakModes = analysis
    .filter(item => item.total > 0 && item.rate < 80)
    .map(item => ({
      mode: MODE_INFO[item.mode] ? item.mode : 'mission',
      reason: `さいきんの せいかい ${item.rate}%`,
      rate: item.rate,
    }));

  const recommendations = [...weakModes];

  DEFAULT_REVIEW_MODES.forEach(mode => {
    if (!recommendations.some(item => item.mode === mode)) {
      recommendations.push({
        mode,
        reason: '得意も にがても いっぽずつ',
        rate: null,
      });
    }
  });

  return recommendations.slice(0, 4);
};

const FukushuScreen = ({ onBack, onStartReview, petName }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const recent = await getRecentSessions(14);
        setSessions(recent || []);
      } catch (err) {
        console.error('復習データ読み込みエラー:', err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const analysis = useMemo(() => analyzeSessions(sessions), [sessions]);
  const recommendations = useMemo(() => buildRecommendations(analysis), [analysis]);
  const hasStudyData = sessions.length > 0;

  const displayName = petName || 'まめ';

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.sky} 0%, ${COLORS.bg} 42%, ${COLORS.bgSoft} 100%)`,
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      color: COLORS.text,
    }}>
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(255,255,255,0.92)', borderBottom: '2px solid #F5F5F5',
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
            📚 ふくしゅう
          </div>
          <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
            まちがいは つぎの いっぽだよ
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
            pose={hasStudyData ? 'touched' : 'cheer'}
            message={hasStudyData ? 'にがてを そっと 見つけるよ' : 'まずは できるところから！'}
            size={72}
            petName={displayName}
          />
          <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textLight, fontWeight: 700 }}>
            {isLoading ? (
              <>{displayName}が ふくしゅうを さがしています...</>
            ) : hasStudyData ? (
              <>さいきんの がくしゅうから、<br />やさしく もういちど やるものを えらぶよ。</>
            ) : (
              <>まだ データが 少ないから、<br />好きなところから れんしゅうしよう。</>
            )}
          </div>
        </div>

        {hasStudyData && (
          <div style={{
            background: '#FFFDE7', border: '2px solid #FFE082', borderRadius: 18,
            padding: 14, marginBottom: 16, fontSize: 12, lineHeight: 1.7,
            color: COLORS.textLight, fontWeight: 700,
          }}>
            💡 いまは「モードごとの点数」から復習をおすすめしています。<br />
            問題ごとのまちがい記録は、次の段階で強化できます。
          </div>
        )}

        <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.greenDark, margin: '4px 0 10px' }}>
          {displayName}の おすすめ
        </div>

        {recommendations.map((item) => {
          const info = MODE_INFO[item.mode] || MODE_INFO.mission;
          return (
            <button
              key={`${item.mode}-${item.reason}`}
              onClick={() => onStartReview(info.startMode)}
              style={{
                width: '100%', background: 'white', border: '2px solid #E8F5E9',
                borderRadius: 18, padding: 16, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer',
                fontFamily: "'Rounded Mplus 1c', sans-serif",
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#F1F8E9', fontSize: 26, flexShrink: 0,
              }}>
                {info.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>
                  {info.label}
                </div>
                <div style={{ fontSize: 11, color: COLORS.textLight, lineHeight: 1.5, marginTop: 3 }}>
                  {info.description}
                </div>
                <div style={{ fontSize: 11, color: COLORS.orange, fontWeight: 800, marginTop: 5 }}>
                  {item.reason}
                </div>
              </div>
              <div style={{ fontSize: 22, color: COLORS.green }}>›</div>
            </button>
          );
        })}

        {analysis.length > 0 && (
          <>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.greenDark, margin: '18px 0 10px' }}>
              さいきんの きろく
            </div>
            <div style={{ background: 'white', borderRadius: 18, padding: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              {analysis.map(item => {
                const info = MODE_INFO[item.mode] || MODE_INFO.mission;
                return (
                  <div key={item.mode} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 4px', borderBottom: '1px solid #F5F5F5', gap: 12,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>
                      {info.emoji} {info.shortLabel}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: 700 }}>
                      {item.count}回 / 正解 {item.rate}%
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FukushuScreen;
