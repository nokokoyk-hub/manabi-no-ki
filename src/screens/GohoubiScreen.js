import React, { useEffect, useRef, useState } from 'react';
import MameCharacter from '../components/MameCharacter';
import { PageHeader, RewardTabs, Orchard } from '../components/ForestUI';
import CollectionScreen from './CollectionScreen';
import { loadPuzzleData, loadCostumeData, equipItem, unequipAll } from '../lib/storage';
import { getPuzzleById } from '../data/puzzles';
import COSTUME_ITEMS, { CATEGORY_ORDER, CATEGORY_TO_SLOT, SLOT_LABELS } from '../data/costumeItems';
export default function GohoubiScreen({
  onBack,
  petName,
  puzzleData: propsPuzzleData,
  costumeData: propsCostumeData,
  onEquipChange,
  collection,
  fruits,
  onHarvest,
  onMission,
  initialTab = 'collection'
}) {
  const [tab, setTab] = useState(initialTab),
    [slot, setSlot] = useState('head');
  const [costumeData, setCostumeData] = useState(() => propsCostumeData || loadCostumeData());
  useEffect(() => {
    if (propsCostumeData) setCostumeData(propsCostumeData);
  }, [propsCostumeData]);
  const [lockedItem, setLockedItem] = useState(null),
    unlockDialog = useRef(null);
  const puzzleData = propsPuzzleData || loadPuzzleData(),
    puzzle = getPuzzleById(puzzleData.currentPuzzleId);
  const collected = puzzleData.collected || 0,
    completed = puzzleData.completedIds || [],
    equipment = costumeData.equippedItems || {};
  const changeEquipment = updated => {
    setCostumeData(updated);
    onEquipChange?.(updated.equippedItems);
  };
  return <main className="mn-page mn-rewards">
    <PageHeader title="ごほうびの森" onBack={onBack} /><p className="reward-subtitle">🌱 がんばった たからもの 🌱</p><RewardTabs value={tab} onChange={setTab} />
    {tab === 'collection' && <><Orchard fruits={fruits} onHarvest={onHarvest} /><CollectionScreen collection={collection} /></>}
    {tab === 'puzzle' && <><section className="puzzle-card"><span className="reward-eyebrow">いま つくっている パズル</span><h2>{puzzle.title}</h2>
      <div className="mn-puzzle" aria-label={'９ピースのうち' + collected + 'ピースが見えるパズル'}>{Array.from({
            length: 9
          }, (_, i) => <div key={i} aria-hidden="true" className={i < collected ? 'found' : ''} style={i < collected ? {
            backgroundImage: 'url(' + puzzle.image + ')',
            backgroundPosition: i % 3 * 50 + '% ' + Math.floor(i / 3) * 50 + '%'
          } : {}}>{i < collected ? '' : '✿'}</div>)}</div>
      <div className="puzzle-progress"><strong>{collected}<span> / ９ ピース</span></strong><span>{collected >= 9 ? 'かんせい！' : 'あと ' + (9 - collected) + 'こ！'}</span></div><progress value={collected} max="9" aria-label="パズルの進みぐあい" />
      <p>ミッションを クリアすると<br />ピースが １こ もらえるよ。</p><button className="reward-primary" onClick={onMission}>ミッションへ いこう！ <span aria-hidden="true">›</span></button></section>
      <div className="reward-section-title"><h2>かんせいした パズル</h2><span>{completed.length}まい</span></div>{completed.length ? <div className="mn-archive">{completed.map(id => {
          const p = getPuzzleById(id);
          return <figure key={id}><img src={p.image} alt={p.title} loading="lazy" /><figcaption>{p.title}</figcaption></figure>;
        })}</div> : <div className="reward-empty small"><p>さいしょの １まいが たのしみ！</p></div>}</>}
    {tab === 'costume' && <><section className="dress-card"><MameCharacter pose="happy" size={160} petName={petName} equippedItems={equipment} enableTap={true} /><h2>まめの おきがえ</h2><p>すきな かざりを つけてみよう！</p><button className="reward-secondary" disabled={!Object.values(equipment).some(Boolean)} onClick={() => changeEquipment(unequipAll())}>ぜんぶ はずす</button></section>
      <div className="reward-kinds dress-slots" role="group" aria-label="かざる ばしょ">{CATEGORY_ORDER.map(id => <button key={id} aria-pressed={slot === id} onClick={() => setSlot(id)}>{SLOT_LABELS[id].label}</button>)}</div>
      <div className="costume-grid">{COSTUME_ITEMS.filter(i => CATEGORY_TO_SLOT[i.category] === slot).map(item => {
          const unlocked = costumeData.unlockedItems.includes(item.id);
          return <button key={item.id} className={'costume-card' + (unlocked ? '' : ' locked')} aria-pressed={equipment[slot] === item.id} onClick={() => {
            if (unlocked) changeEquipment(equipItem(item.id));else {
              setLockedItem(item);
              unlockDialog.current.showModal();
            }
          }}><span aria-hidden="true">{item.emoji}</span><strong>{item.name}</strong><small>{equipment[slot] === item.id ? '✓ つけているよ' : unlocked ? 'つけてみる' : '🔒 もらいかたを みる'}</small></button>;
        })}</div></>}
    <dialog className="mn-dialog" ref={unlockDialog} aria-labelledby="unlock-title"><h2 id="unlock-title">{lockedItem?.name}</h2><p className="costume-detail-icon" aria-hidden="true">{lockedItem?.emoji}</p><p>もらえるのは…<br /><strong>{lockedItem?.unlockLabel}</strong></p><button className="reward-primary" onClick={() => unlockDialog.current.close()}>きせかえに もどる</button></dialog>
  </main>;
}
