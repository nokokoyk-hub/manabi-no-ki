import React, { useRef, useState } from 'react';
import { FRUITS, RARITY_INFO, TOTAL_FRUITS } from '../lib/gachaData';
import { getCollectedCount } from '../lib/fruitCollection';
export default function CollectionScreen({
  collection
}) {
  const [filter, setFilter] = useState('owned'),
    [kind, setKind] = useState('all'),
    [selected, setSelected] = useState(null);
  const detail = useRef(null),
    owned = collection.items || {};
  const items = FRUITS.filter(f => (filter === 'all' || owned[f.id]) && (kind === 'all' || (kind === 'character' ? f.type === 'character' : f.type !== 'character')));
  const show = fruit => {
    setSelected(fruit);
    detail.current.showModal();
  };
  return <>
    <div className="reward-section-title"><h2>あつめた たからもの</h2><span><b>{getCollectedCount(collection)}</b> / {TOTAL_FRUITS}しゅるい</span></div>
    <div className="reward-filters" role="group" aria-label="持っているもの">{[['owned', 'あつめた'], ['all', 'ぜんぶ']].map(([id, label]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <div className="reward-kinds" role="group" aria-label="ずかんのしゅるい">{[['all', 'すべて'], ['fruit', 'かじつ'], ['character', 'なかま']].map(([id, label]) => <button key={id} aria-pressed={kind === id} onClick={() => setKind(id)}>{label}</button>)}</div>
    <div className="reward-grid">{items.map(f => <button className={'treasure-card ' + f.rarity + (owned[f.id] ? '' : ' undiscovered')} key={f.id} onClick={() => show(f)}><img src={f.image} alt="" loading="lazy" /><strong>{owned[f.id] ? f.name : '？？？'}</strong><small>{owned[f.id] ? owned[f.id].count + 'こ' : 'まだ であってないよ'}</small></button>)}</div>
    {!items.length && <div className="reward-empty"><span aria-hidden="true">🌱</span><h3>これからの おたのしみ</h3><p>木の みのりを しゅうかくすると<br />たからものに であえるよ。</p><button className="reward-secondary" onClick={() => setFilter('all')}>ぜんぶの ずかんを みる</button></div>}
    <p className="mn-note">これまでの しゅうかく：{collection.totalHarvests || 0}かい</p>
    <dialog className="mn-dialog" ref={detail} aria-labelledby="treasure-title"><h2 id="treasure-title">{selected && owned[selected.id] ? selected.name : 'まだ であっていないよ'}</h2>{selected && owned[selected.id] ? <div className={'treasure-detail ' + selected.rarity}><img className="detail-art" src={selected.image} alt={selected.name} /><span className="rarity-pill">{RARITY_INFO[selected.rarity].label}</span><p>{owned[selected.id].count}こ あつまったよ！</p></div> : <p>木の みのりを しゅうかくすると、<br />かじつや なかまに であえるよ。</p>}<button className="reward-primary" onClick={() => detail.current.close()}>ずかんに もどる</button></dialog>
  </>;
}
