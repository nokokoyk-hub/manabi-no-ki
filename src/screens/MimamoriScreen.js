// ============================================
// 👀 MimamoriScreen - 保護者向け学習状況確認
// 週間記録（実データ） + 教科別進捗 + 励まし
// v0.2.0: Supabase実データ対応
// ============================================

import React, { useState, useEffect } from 'react';
import { COLORS, SUBJECT_COLORS } from '../constants/colors';
import { getRecentSessions } from '../lib/storage';

// モード名 → 表示名の変換
const MODE_LABELS = {
  mission: { name: 'ミッション', emoji: '📝' },
  okurigana: { name: 'かんじ', emoji: '✏️' },
  clock: { name: 'とけい', emoji: '⏰' },
  kagaku: { name: 'かがく', emoji: '🧪' },
};

// 曜日名（日本語）
const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

const MimamoriScreen = ({ onBack, streak = 0, appVersion = '' }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 起動時にSupabaseからセッション取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecentSessions(7);
        setSessions(data);
      } catch (err) {
        console.error('みまもりデータ取得エラー:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 週間カレンダーデータを計算 ---
  const getWeekData = () => {
    const today = new Date();
    // 今週の月曜日を起点に
    const monday = new Date(today);
    const dayOfWeek = today.getDay(); // 0=日, 1=月, ...
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 月曜からの差分
    monday.setDate(today.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // その日にセッションがあったか確認
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.completed_at).toLocaleDateString('sv-SE'); // YYYY-MM-DD
        return sessionDate === dateStr;
      });

      const totalScore = daySessions.reduce((sum, s) => sum + s.score, 0);
      const isFuture = date > today;

      week.push({
        day: DAY_NAMES[date.getDay()],
        done: daySessions.length > 0,
        sessionCount: daySessions.length,
        totalScore,
        isFuture,
        isToday: dateStr === today.toISOString().split('T')[0],
      });
    }
    return week;
  };

  // --- 教科別進捗を計算 ---
  const getSubjectStats = () => {
    const modeStats = {};

    sessions.forEach(s => {
      if (!modeStats[s.mode]) {
        modeStats[s.mode] = { totalScore: 0, totalQuestions: 0, sessionCount: 0 };
      }
      modeStats[s.mode].totalScore += s.score;
      modeStats[s.mode].totalQuestions += s.total_questions;
      modeStats[s.mode].sessionCount += 1;
    });

    // 教科別カラーの対応
    const modeColors = {
      mission: SUBJECT_COLORS['さんすう'] || '#4CAF50',
      okurigana: SUBJECT_COLORS['こくご'] || '#FF9800',
      clock: '#2196F3',
    };

    return Object.entries(modeStats).map(([mode, stats]) => {
      const accuracy = stats.totalQuestions > 0
        ? Math.round((stats.totalScore / stats.totalQuestions) * 100)
        : 0;
      const label = MODE_LABELS[mode] || { name: mode, emoji: '📚' };
      return {
        mode,
        name: label.name,
        emoji: label.emoji,
        accuracy,
        sessionCount: stats.sessionCount,
        totalScore: stats.totalScore,
        totalQuestions: stats.totalQuestions,
        color: modeColors[mode] || '#9E9E9E',
      };
    });
  };

  // --- 励ましメッセージを選択 ---
  const getEncouragement = (studyDays, totalSessions) => {
    if (totalSessions === 0) {
      return {
        emoji: '🌱',
        main: 'まだ きろくが ないよ',
        sub: 'ミッションに ちょうせん してみよう！',
      };
    }
    if (studyDays >= 5) {
      return {
        emoji: '🏆',
        main: `こんしゅうは ${studyDays}にちも がくしゅう できたよ！`,
        sub: 'すごい！ まいにち がんばってるね！',
      };
    }
    if (studyDays >= 3) {
      return {
        emoji: '🌟',
        main: `こんしゅうは ${studyDays}にち がくしゅう できました！`,
        sub: 'まいにち すこしずつ、おおきな ちからに なるよ',
      };
    }
    if (studyDays >= 1) {
      return {
        emoji: '🌿',
        main: `こんしゅうは ${studyDays}にち がくしゅう したよ！`,
        sub: 'つづけることが だいじだよ。がんばろう！',
      };
    }
    return {
      emoji: '🌱',
      main: 'こんしゅうは まだ がくしゅう してないよ',
      sub: 'きょうから はじめてみよう！',
    };
  };

  // --- データ計算 ---
  const weekData = getWeekData();
  const subjectStats = getSubjectStats();
  const studyDays = weekData.filter(d => d.done).length;
  const encouragement = getEncouragement(studyDays, sessions.length);

  // ローディング
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F5F5F5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, animation: 'pulse 1.5s ease-in-out infinite' }}>👀</div>
          <div style={{ fontSize: 14, color: COLORS.textLight, marginTop: 8 }}>
            きろくを よみこんでいます...
          </div>
        </div>
      </div>
    );
  }

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
              {studyDays}<span style={{ fontSize: 16 }}>にち</span>
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
              {streak}<span style={{ fontSize: 16 }}>にち</span>
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
                  fontSize: 12, color: d.isToday ? COLORS.green : COLORS.textLight,
                  marginBottom: 8, fontWeight: d.isToday ? 800 : 600,
                }}>
                  {d.day}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                  background: d.done ? '#E8F5E9' : d.isFuture ? '#FAFAFA' : '#F5F5F5',
                  border: d.isToday
                    ? `2px solid ${COLORS.green}`
                    : d.done
                      ? `2px solid ${COLORS.green}`
                      : '2px solid #E0E0E0',
                  opacity: d.isFuture ? 0.4 : 1,
                }}>
                  {d.done ? '🌿' : d.isFuture ? '·' : '−'}
                </div>
                {d.done && (
                  <div style={{ fontSize: 10, color: COLORS.textLight, marginTop: 4 }}>
                    {d.sessionCount}かい
                  </div>
                )}
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
            📊 きょうかべつ せいせき
          </div>
          {subjectStats.length === 0 ? (
            <div style={{ textAlign: 'center', color: COLORS.textLight, fontSize: 14, padding: 16 }}>
              まだ きろくが ないよ。がくしゅう してみよう！
            </div>
          ) : (
            subjectStats.map((s, i) => (
              <div key={i} style={{ marginBottom: i < subjectStats.length - 1 ? 16 : 0 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 6,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                    {s.emoji} {s.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>
                    {s.totalScore}/{s.totalQuestions}もん せいかい（{s.accuracy}%）
                  </span>
                </div>
                <div style={{
                  height: 10, background: '#F5F5F5', borderRadius: 5, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', background: s.color, borderRadius: 5,
                    width: `${s.accuracy}%`, transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{
                  fontSize: 11, color: COLORS.textLight, marginTop: 4, textAlign: 'right',
                }}>
                  {s.sessionCount}かい ちょうせん
                </div>
              </div>
            ))
          )}
        </div>

        {/* 励ましメッセージ */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF8E1, #FFF3E0)',
          borderRadius: 16, padding: 20,
          border: '2px solid #FFE0B2',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{encouragement.emoji}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, lineHeight: 1.6 }}>
            {encouragement.main}
          </div>
          <div style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4 }}>
            {encouragement.sub}
          </div>
        </div>

        {/* 更新履歴 + バージョン情報 */}
        <div style={{
          marginTop: 24, textAlign: 'center', paddingBottom: 20,
        }}>
          <button
            onClick={() => window.open('/changelog.html', '_blank')}
            style={{
              background: 'none', border: '1px solid #E0E0E0',
              borderRadius: 20, padding: '8px 20px',
              fontSize: 13, color: COLORS.textLight,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            📋 こうしんりれき
          </button>
          <div style={{
            fontSize: 11, color: '#BDBDBD', marginTop: 8,
          }}>
            まなびの木 v{appVersion}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MimamoriScreen;
