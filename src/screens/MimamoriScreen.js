// ============================================
// 👀 MimamoriScreen - 保護者向け学習分析
// v0.2.0: Supabase実データ対応
// v0.9.2: 保護者モード全面リニューアル
// v1.0.4: ★日付フォーマット機種依存バグ修正
//   - toLocaleDateString('sv-SE')を手動フォーマットに変更
//   - Android/一部ブラウザで日付がおかしくなる問題を解消
// ============================================

import React, { useState, useEffect } from 'react';
import { COLORS, SUBJECT_COLORS } from '../constants/colors';
import PinGate from '../components/PinGate';
import {
  getRecentSessions,
  getSubjectAccuracy,
  getDailyAccuracyTrend,
} from '../lib/storage';
import { supabase } from '../lib/supabase';

// 曜日名（日本語）
const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

// ★v1.0.4追加: 機種依存しない安全な日付フォーマット
const toSafeDateStr = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

// --- SVG折れ線グラフコンポーネント ---
const AccuracyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: COLORS.textLight, fontSize: 14, padding: 20 }}>
        まだ データが たまっていません
      </div>
    );
  }

  const width = 320;
  const height = 160;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const maxVal = 100;
  const points = data.map((d, i) => {
    const x = paddingX + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW);
    const y = paddingY + chartH - (d.accuracy / maxVal) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  // 塗りつぶし用パス
  const areaPath = linePath
    + ` L${points[points.length - 1].x},${paddingY + chartH}`
    + ` L${points[0].x},${paddingY + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxWidth: 360 }}>
      {/* 横線ガイド */}
      {[0, 25, 50, 75, 100].map(v => {
        const y = paddingY + chartH - (v / maxVal) * chartH;
        return (
          <g key={v}>
            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y}
              stroke="#E0E0E0" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x={paddingX - 6} y={y + 4} textAnchor="end"
              fill="#BDBDBD" fontSize="9">{v}%</text>
          </g>
        );
      })}
      {/* 塗りつぶしエリア */}
      <path d={areaPath} fill="url(#chartGradient)" opacity="0.3" />
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 折れ線 */}
      <path d={linePath} fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* データポイント + 日付ラベル */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#2E7D32" fontSize="9" fontWeight="700">
            {p.accuracy}%
          </text>
          {/* 日付（間引き表示） */}
          {(data.length <= 7 || i % 2 === 0) && (
            <text x={p.x} y={height - 4} textAnchor="middle" fill="#BDBDBD" fontSize="8">
              {p.date.slice(5)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const MimamoriScreen = ({ onBack, streak = 0, appVersion = '', onOpenLevelSettings, displayMode = 'hiragana', onChangeDisplayMode, user, userPlan, hasStripeCustomer, onOpenTerms, onOpenPrivacy, onOpenTokushoho, onLogout }) => {
  // ===== 🔐 PINゲート（Phase B）=====
  const [pinVerified, setPinVerified] = useState(false);

  // PIN未通過 → PinGate表示
  if (!pinVerified) {
    return (
      <PinGate
        user={user}
        onSuccess={() => setPinVerified(true)}
        onBack={onBack}
      />
    );
  }

  // ===== ここから通常のみまもり画面 =====
  return <MimamoriContent onBack={onBack} streak={streak} appVersion={appVersion} onOpenLevelSettings={onOpenLevelSettings} displayMode={displayMode} onChangeDisplayMode={onChangeDisplayMode} onOpenTerms={onOpenTerms} onOpenPrivacy={onOpenPrivacy} onOpenTokushoho={onOpenTokushoho} user={user} userPlan={userPlan} hasStripeCustomer={hasStripeCustomer} onLogout={onLogout} />;
};

// --- 既存のみまもり画面コンテンツ（PINゲート通過後に表示）---
const MimamoriContent = ({ onBack, streak = 0, appVersion = '', onOpenLevelSettings, displayMode = 'hiragana', onChangeDisplayMode, onOpenTerms, onOpenPrivacy, onOpenTokushoho, user, userPlan, hasStripeCustomer, onLogout }) => {
  const [sessions, setSessions] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [dailyTrend, setDailyTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  // 起動時にデータ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessData, subjectData, trendData] = await Promise.all([
          getRecentSessions(7),
          getSubjectAccuracy(30),
          getDailyAccuracyTrend(14),
        ]);
        setSessions(sessData);
        setSubjectStats(subjectData);
        setDailyTrend(trendData);
      } catch (err) {
        console.error('みまもりデータ取得エラー:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 週間カレンダーデータ ---
  const getWeekData = () => {
    const today = new Date();
    const monday = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(today.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = toSafeDateStr(date); // ★v1.0.4修正: toISOString()のUTCズレ解消

      const daySessions = sessions.filter(s => {
        // ★v1.0.4修正: toLocaleDateString('sv-SE')を廃止→機種依存しない手動フォーマット
        const sessionDate = toSafeDateStr(new Date(s.completed_at));
        return sessionDate === dateStr;
      });

      const totalScore = daySessions.reduce((sum, s) => sum + s.score, 0);
      const totalQ = daySessions.reduce((sum, s) => sum + s.total_questions, 0);
      const isFuture = date > today;

      week.push({
        day: DAY_NAMES[date.getDay()],
        done: daySessions.length > 0,
        sessionCount: daySessions.length,
        totalScore,
        totalQuestions: totalQ,
        isFuture,
        isToday: dateStr === toSafeDateStr(today), // ★v1.0.4修正: toISOString()のUTCズレ解消
      });
    }
    return week;
  };

  // --- 苦手ポイント検出 ---
  const getWeakPoints = () => {
    if (subjectStats.length === 0) return [];

    const weakPoints = [];
    subjectStats.forEach(s => {
      if (s.total >= 3 && s.accuracy < 60) {
        weakPoints.push({
          subject: s.subject,
          emoji: s.emoji,
          accuracy: s.accuracy,
          message: `${s.emoji} ${s.subject} が ちょっと むずかしそう（${s.accuracy}%）`,
          type: 'subject',
        });
      }
      Object.entries(s.levels).forEach(([lv, d]) => {
        if (d.total >= 2 && d.accuracy < 50) {
          weakPoints.push({
            subject: s.subject,
            emoji: s.emoji,
            level: Number(lv),
            accuracy: d.accuracy,
            message: `${s.emoji} ${s.subject} Lv${lv} が にがてかも（${d.accuracy}%）`,
            type: 'level',
          });
        }
      });
    });

    return weakPoints.sort((a, b) => a.accuracy - b.accuracy).slice(0, 4);
  };

  // --- データ計算 ---
  const weekData = getWeekData();
  const studyDays = weekData.filter(d => d.done).length;
  const weeklyQuestions = weekData.reduce((sum, d) => sum + d.totalQuestions, 0);
  const weakPoints = getWeakPoints();

  const getSubjectColor = (subject) => SUBJECT_COLORS[subject] || '#9E9E9E';

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F5F5F5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, animation: 'pulse 1.5s ease-in-out infinite' }}>📊</div>
          <div style={{ fontSize: 14, color: COLORS.textLight, marginTop: 8 }}>
            がくしゅう きろくを よみこんでいます...
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
          🛡️ ほごしゃ みまもり
        </div>
      </div>

      <div style={{ padding: 20 }}>

        {/* ① 週間サマリーカード */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div style={{
            background: 'white', borderRadius: 16, padding: '16px 8px',
            textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.green }}>
              {studyDays}
            </div>
            <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>
              がくしゅう日数
            </div>
          </div>
          <div style={{
            background: 'white', borderRadius: 16, padding: '16px 8px',
            textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#42A5F5' }}>
              {weeklyQuestions}
            </div>
            <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>
              こなした問題
            </div>
          </div>
          <div style={{
            background: 'white', borderRadius: 16, padding: '16px 8px',
            textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.orange }}>
              {streak}🔥
            </div>
            <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>
              れんぞく日数
            </div>
          </div>
        </div>

        {/* ② 週間カレンダー */}
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
                    {d.totalQuestions}もん
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ③ 教科別 正答率バー */}
        <div style={{
          background: 'white', borderRadius: 16, padding: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
            📊 きょうかべつ せいとうりつ
          </div>
          {subjectStats.length === 0 ? (
            <div style={{ textAlign: 'center', color: COLORS.textLight, fontSize: 14, padding: 16 }}>
              まだ きろくが ありません。がくしゅう してみよう！
            </div>
          ) : (
            subjectStats
              .sort((a, b) => b.accuracy - a.accuracy)
              .map((s, i) => (
                <div key={i} style={{ marginBottom: i < subjectStats.length - 1 ? 16 : 0 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 6,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                      {s.emoji} {s.subject}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: getSubjectColor(s.subject) }}>
                      {s.accuracy}%
                      {s.accuracy >= 80 && ' 🌟'}
                      <span style={{ fontSize: 11, fontWeight: 400, color: COLORS.textLight, marginLeft: 4 }}>
                        ({s.correct}/{s.total})
                      </span>
                    </span>
                  </div>
                  <div style={{
                    height: 12, background: '#F5F5F5', borderRadius: 6, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${getSubjectColor(s.subject)}, ${getSubjectColor(s.subject)}CC)`,
                      borderRadius: 6,
                      width: `${s.accuracy}%`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              ))
          )}
        </div>

        {/* ④ 苦手ポイント */}
        {weakPoints.length > 0 && (
          <div style={{
            background: 'white', borderRadius: 16, padding: 20,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20,
            border: '2px solid #FFF3E0',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
              🔍 にがて ポイント
            </div>
            <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 12 }}>
              もう すこし れんしゅうすると いいかも
            </div>
            {weakPoints.map((wp, i) => (
              <div key={i} style={{
                background: '#FFF8E1', borderRadius: 10, padding: '10px 14px',
                marginBottom: i < weakPoints.length - 1 ? 8 : 0,
                fontSize: 13, color: COLORS.text,
              }}>
                {wp.message}
              </div>
            ))}
          </div>
        )}

        {/* ⑤ 正答率の推移グラフ */}
        <div style={{
          background: 'white', borderRadius: 16, padding: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
            📈 せいとうりつの すいい（2しゅうかん）
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AccuracyChart data={dailyTrend} />
          </div>
        </div>

        {/* ⑥ 表示モード切り替え */}
        <div style={{
          background: 'white', borderRadius: 16, padding: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20,
          border: '2px solid #E3F2FD',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>
            🔤 もじの ひょうじ
          </div>
          <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 14 }}>
            おこさまの よみの ちからに あわせて きりかえ
          </div>
          <div style={{
            display: 'flex', borderRadius: 12, overflow: 'hidden',
            border: '2px solid #E0E0E0',
          }}>
            <button
              onClick={() => onChangeDisplayMode && onChangeDisplayMode('hiragana')}
              style={{
                flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Rounded Mplus 1c', sans-serif",
                background: displayMode === 'hiragana'
                  ? 'linear-gradient(135deg, #42A5F5, #1E88E5)'
                  : '#FAFAFA',
                color: displayMode === 'hiragana' ? 'white' : COLORS.textLight,
                transition: 'all 0.3s ease',
              }}
            >
              🌱 ていがくねん
              <div style={{
                fontSize: 10, marginTop: 2,
                color: displayMode === 'hiragana' ? 'rgba(255,255,255,0.8)' : '#BDBDBD',
              }}>
                ひらがな ちゅうしん
              </div>
            </button>
            <button
              onClick={() => onChangeDisplayMode && onChangeDisplayMode('kanji')}
              style={{
                flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Rounded Mplus 1c', sans-serif",
                background: displayMode === 'kanji'
                  ? 'linear-gradient(135deg, #FF9800, #F57C00)'
                  : '#FAFAFA',
                color: displayMode === 'kanji' ? 'white' : COLORS.textLight,
                transition: 'all 0.3s ease',
              }}
            >
              📚 こうがくねん
              <div style={{
                fontSize: 10, marginTop: 2,
                color: displayMode === 'kanji' ? 'rgba(255,255,255,0.8)' : '#BDBDBD',
              }}>
                かんじまじり
              </div>
            </button>
          </div>
        </div>

        {/* ⑦ レベル設定導線 */}
        {onOpenLevelSettings && (
          <div
            onClick={onOpenLevelSettings}
            style={{
              background: 'white', borderRadius: 16, padding: 20,
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 20,
              cursor: 'pointer', border: '2px solid #E8F5E9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>
                🎚️ きょうかべつ レベル設定
              </div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>
                とくいな きょうかは レベルを あげよう
              </div>
            </div>
            <div style={{ fontSize: 22, color: COLORS.green }}>›</div>
          </div>
        )}

        {/* 励ましメッセージ */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF8E1, #FFF3E0)',
          borderRadius: 16, padding: 20,
          border: '2px solid #FFE0B2',
          textAlign: 'center', marginBottom: 20,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>
            {studyDays >= 5 ? '🏆' : studyDays >= 3 ? '🌟' : studyDays >= 1 ? '🌿' : '🌱'}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, lineHeight: 1.6 }}>
            {studyDays >= 5
              ? `こんしゅうは ${studyDays}にちも がくしゅう！すごい！`
              : studyDays >= 3
                ? `こんしゅうは ${studyDays}にち がくしゅう できました！`
                : studyDays >= 1
                  ? `こんしゅうは ${studyDays}にち がくしゅう したよ！`
                  : 'こんしゅうは まだ がくしゅう してないよ'}
          </div>
          <div style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4 }}>
            {weeklyQuestions > 0
              ? `ぜんぶで ${weeklyQuestions}もんに ちょうせんしたよ！`
              : 'きょうから はじめてみよう！'}
          </div>
        </div>

        {/* ⑧ プラン管理 */}
        <div style={{
          background: 'white', borderRadius: 16, padding: '16px 20px',
          margin: '0 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.greenDark, marginBottom: 8 }}>
            💳 プラン管理
          </div>
          {userPlan === 'premium' ? (
            <div>
              <div style={{ fontSize: 13, color: COLORS.text, marginBottom: hasStripeCustomer ? 10 : 0 }}>
                ✅ <span style={{ fontWeight: 700, color: COLORS.green }}>プレミアムプラン</span> ご利用中
              </div>
              {hasStripeCustomer && (
                <>
                  <button
                    onClick={async () => {
                      if (!supabase) return;
                      try {
                        setPortalLoading(true);
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session?.access_token) {
                          alert('ログインセッションが切れています。再ログインしてください。');
                          return;
                        }
                        const res = await fetch(
                          `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/create-portal-session`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${session.access_token}`,
                              'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
                            },
                          }
                        );
                        const result = await res.json();
                        if (result?.url) {
                          window.open(result.url, '_blank');
                        } else {
                          alert(result?.error || 'ポータルの作成に失敗しました');
                        }
                      } catch (err) {
                        console.error('Portal error:', err);
                        alert('エラーが発生しました。しばらく待ってからお試しください。');
                      } finally {
                        setPortalLoading(false);
                      }
                    }}
                    disabled={portalLoading}
                    style={{
                      width: '100%', padding: '10px 0',
                      borderRadius: 20, border: '2px solid #E0E0E0',
                      background: 'white', color: COLORS.text,
                      fontSize: 13, fontWeight: 700,
                      cursor: portalLoading ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                      opacity: portalLoading ? 0.6 : 1,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {portalLoading ? '読み込み中...' : '📋 プランを管理する（解約・変更）'}
                  </button>
                  <div style={{ fontSize: 11, color: '#999', textAlign: 'center', marginTop: 6 }}>
                    Stripeの安全なページで手続きできます
                  </div>
                </>
              )}
            </div>
          ) : userPlan === 'trial' ? (
            <div>
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, marginBottom: 10 }}>
                🎫 トライアル期間中（全機能お試し中）
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => {
                    const url = 'https://buy.stripe.com/14A4gz3lY3vl2QZ8pt6AM00'
                      + (user?.id ? `?client_reference_id=${user.id}` : '');
                    window.open(url, '_blank');
                  }}
                  style={{
                    flex: 1, padding: '12px 6px', borderRadius: 14,
                    border: '2px solid #FFE0B2', background: 'white',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#FF9800' }}>月額プラン</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#333', marginTop: 2 }}>200<span style={{ fontSize: 11 }}>円/月</span></div>
                </button>
                <button
                  onClick={() => {
                    const url = 'https://buy.stripe.com/8x214n2hUaXNezHfRV6AM01'
                      + (user?.id ? `?client_reference_id=${user.id}` : '');
                    window.open(url, '_blank');
                  }}
                  style={{
                    flex: 1, padding: '12px 6px', borderRadius: 14,
                    border: '2px solid #FF5722', background: 'linear-gradient(180deg, #FFF3E0, #FFECB3)',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                    position: 'relative', boxShadow: '0 2px 8px rgba(255,87,34,0.15)',
                  }}
                >
                  <div style={{ position: 'absolute', top: -8, right: -4, background: 'linear-gradient(135deg, #FF5722, #FF9800)', color: 'white', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 8 }}>🉐 おトク</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#FF5722' }}>年間プラン</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#333', marginTop: 2 }}>2,100<span style={{ fontSize: 11 }}>円/年</span></div>
                  <div style={{ fontSize: 9, color: '#FF5722', fontWeight: 700, marginTop: 2 }}>1.5ヶ月ぶんおトク🧃</div>
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#999', textAlign: 'center', marginTop: 6 }}>
                トライアル終了を待たずにいつでも切り替えOK
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6, marginBottom: 12 }}>
                無料プランをご利用中です。プレミアム（月額200円）にアップグレードすると、全教科の学習モード・ふくしゅう・みまもり機能がすべて使えるようになります。
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    const url = 'https://buy.stripe.com/14A4gz3lY3vl2QZ8pt6AM00'
                      + (user?.id ? `?client_reference_id=${user.id}` : '');
                    window.open(url, '_blank');
                  }}
                  style={{
                    flex: 1, padding: '14px 6px', borderRadius: 16,
                    border: '2px solid #FFE0B2', background: 'white',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#FF9800' }}>月額プラン</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#333', marginTop: 4 }}>200<span style={{ fontSize: 12 }}>円/月</span></div>
                  <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>いつでも かいやくOK</div>
                </button>
                <button
                  onClick={() => {
                    const url = 'https://buy.stripe.com/8x214n2hUaXNezHfRV6AM01'
                      + (user?.id ? `?client_reference_id=${user.id}` : '');
                    window.open(url, '_blank');
                  }}
                  style={{
                    flex: 1, padding: '14px 6px', borderRadius: 16,
                    border: '2px solid #FF5722', background: 'linear-gradient(180deg, #FFF3E0, #FFECB3)',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                    position: 'relative', boxShadow: '0 2px 8px rgba(255,87,34,0.15)',
                  }}
                >
                  <div style={{ position: 'absolute', top: -10, right: -6, background: 'linear-gradient(135deg, #FF5722, #FF9800)', color: 'white', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 10, boxShadow: '0 2px 6px rgba(255,87,34,0.4)' }}>🉐 おトク！</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#FF5722' }}>年間プラン</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#333', marginTop: 4 }}>2,100<span style={{ fontSize: 12 }}>円/年</span></div>
                  <div style={{ fontSize: 10, color: '#FF5722', fontWeight: 700, marginTop: 4 }}>1.5ヶ月ぶん おトク！🧃</div>
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#999', textAlign: 'center', marginTop: 6 }}>
                いつでも解約OK
              </div>
            </div>
          )}
        </div>

        {/* ログアウト */}
        {onLogout && (
          <div style={{ textAlign: 'center', paddingBottom: 16 }}>
            <button
              onClick={onLogout}
              style={{
                background: 'none', border: '1px solid #E57373',
                borderRadius: 20, padding: '10px 28px',
                fontSize: 13, color: '#E57373',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              🔓 ログアウト
            </button>
            <div style={{ fontSize: 11, color: '#BDBDBD', marginTop: 6 }}>
              べつの アカウントに きりかえられます
            </div>
          </div>
        )}

        {/* 更新履歴 + バージョン */}
        <div style={{ textAlign: 'center', paddingBottom: 16 }}>
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
          <div style={{ fontSize: 11, color: '#BDBDBD', marginTop: 8 }}>
            まなびの木 v{appVersion}
          </div>
        </div>

        {/* 利用規約等リンク */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 8, paddingBottom: 40, flexWrap: 'wrap',
        }}>
          <button onClick={onOpenTerms} style={{
            background: 'none', border: 'none', fontSize: 11,
            color: '#AAAAAA', cursor: 'pointer', padding: '2px 4px',
            fontFamily: 'inherit', textDecoration: 'underline',
          }}>利用規約</button>
          <span style={{ fontSize: 11, color: '#DDDDDD' }}>|</span>
          <button onClick={onOpenPrivacy} style={{
            background: 'none', border: 'none', fontSize: 11,
            color: '#AAAAAA', cursor: 'pointer', padding: '2px 4px',
            fontFamily: 'inherit', textDecoration: 'underline',
          }}>プライバシーポリシー</button>
          <span style={{ fontSize: 11, color: '#DDDDDD' }}>|</span>
          <button onClick={onOpenTokushoho} style={{
            background: 'none', border: 'none', fontSize: 11,
            color: '#AAAAAA', cursor: 'pointer', padding: '2px 4px',
            fontFamily: 'inherit', textDecoration: 'underline',
          }}>特商法表記</button>
        </div>
      </div>
    </div>
  );
};

export default MimamoriScreen;
