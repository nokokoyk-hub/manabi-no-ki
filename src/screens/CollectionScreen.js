// ============================================
// 📦 CollectionScreen.js - たからものずかん（ごほうびの森の「ずかん」タブ）
// 2026-11-02: レアリティ別グループ・最初からシルエット表示・収集ゲージを復活
//   （9月の森デザインはそのまま、9/8以前の「どれだけ集めたか一目でわかる」見せ方に戻した）
// データは collection（fruitCollection.js）を読むだけ。保存・ガチャには触れない。
// ============================================
import React, { useRef, useState } from 'react';
import { FRUITS, RARITY, RARITY_INFO, TOTAL_FRUITS } from '../lib/gachaData';
import { getCollectedCount } from '../lib/fruitCollection';

// 強い順に上から並べる（レジェンド → スーパーレア → レア → ノーマル）
export const RARITY_ORDER = [RARITY.LEGEND, RARITY.SUPER_RARE, RARITY.RARE, RARITY.NORMAL];

const KINDS = [['all', 'すべて'], ['fruit', 'かじつ'], ['character', 'なかま']];

const matchesKind = (item, kind) => kind === 'all' || (kind === 'character' ? item.type === 'character' : item.type !== 'character');

export default function CollectionScreen({
  collection
}) {
  const [kind, setKind] = useState('all'),
    [selected, setSelected] = useState(null);
  const detail = useRef(null),
    owned = (collection && collection.items) || {};
  const collectedCount = getCollectedCount({ items: owned });
  const rate = TOTAL_FRUITS ? Math.round(collectedCount / TOTAL_FRUITS * 100) : 0;
  const complete = collectedCount >= TOTAL_FRUITS;
  const show = item => {
    setSelected(item);
    detail.current?.showModal?.();
  };
  const groups = RARITY_ORDER.map(rarity => {
    const all = FRUITS.filter(f => f.rarity === rarity);
    return {
      rarity,
      info: RARITY_INFO[rarity],
      items: all.filter(f => matchesKind(f, kind)),
      got: all.filter(f => owned[f.id]).length,
      total: all.length
    };
  }).filter(g => g.items.length > 0);
  return <>
    <section className={'zukan-progress' + (complete ? ' is-complete' : '')} aria-label="ずかんの あつまりぐあい">
      <div className="zukan-progress-head"><h2>あつめた たからもの</h2><span><b>{collectedCount}</b> / {TOTAL_FRUITS}しゅるい</span></div>
      <progress value={collectedCount} max={TOTAL_FRUITS} aria-label={'ずかん ' + rate + 'パーセント'} />
      <p className="zukan-progress-rate">{complete ? '👑 コンプリート！ おめでとう！ 🎉' : rate + '% コンプリート'}</p>
    </section>
    <div className="reward-kinds" role="group" aria-label="ずかんのしゅるい">{KINDS.map(([id, label]) => <button key={id} aria-pressed={kind === id} onClick={() => setKind(id)}>{label}</button>)}</div>
    {groups.map(g => <section className={'zukan-group ' + g.rarity} key={g.rarity} aria-labelledby={'zukan-' + g.rarity}>
      <div className="zukan-group-head"><h3 id={'zukan-' + g.rarity}><span aria-hidden="true">{g.info.emoji}</span> {g.info.label}</h3><span className={g.got === g.total ? 'is-done' : ''}>{g.got} / {g.total}{g.got === g.total && ' ✅'}</span></div>
      <div className="reward-grid">{g.items.map(f => {
          const have = owned[f.id];
          const count = (have && have.count) || 0;
          return <button className={'treasure-card ' + f.rarity + (have ? '' : ' undiscovered')} key={f.id} onClick={() => show(f)} aria-label={have ? f.name + ' ' + count + 'こ' : 'まだ であっていない たからもの'}>
            {count > 1 && <span className="treasure-count" aria-hidden="true">×{count}</span>}
            <img src={f.image} alt="" loading="lazy" />
            <strong>{have ? f.name : '？？？'}</strong>
          </button>;
        })}</div>
    </section>)}
    <p className="mn-note">🌳 これまでの しゅうかく：{(collection && collection.totalHarvests) || 0}かい</p>
    <dialog className="mn-dialog" ref={detail} aria-labelledby="treasure-title"><h2 id="treasure-title">{selected && owned[selected.id] ? selected.name : 'まだ であっていないよ'}</h2>{selected && owned[selected.id] ? <div className={'treasure-detail ' + selected.rarity}><img className="detail-art" src={selected.image} alt={selected.name} /><span className="rarity-pill">{RARITY_INFO[selected.rarity].label}</span><p>{owned[selected.id].count}こ あつまったよ！</p></div> : <div className={'treasure-detail ' + (selected ? selected.rarity : '')}>{selected && <span className="rarity-pill">{RARITY_INFO[selected.rarity].label}</span>}<p>木の みのりを しゅうかくすると、<br />かじつや なかまに であえるよ。</p></div>}<button className="reward-primary" onClick={() => detail.current?.close?.()}>ずかんに もどる</button></dialog>
  </>;
}
