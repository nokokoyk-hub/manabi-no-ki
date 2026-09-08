import React, { useEffect, useRef, useState } from 'react';
import { RARITY_INFO } from '../lib/gachaData';

// Drawing and persistence remain in App; this component only presents its result.
export default function HarvestScreen({
  fruit,
  isNew,
  onClose,
  onCollection
}) {
  const [phase, setPhase] = useState('ready');
  const [quiet, setQuiet] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dialog = useRef(null),
    title = useRef(null),
    opening = useRef(false),
    closed = useRef(false),
    timers = useRef([]);
  const done = phase === 'done',
    info = RARITY_INFO[fruit.rarity];
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => {
    const previous = document.activeElement,
      node = dialog.current;
    node.showModal();
    return () => {
      clearTimers();
      node.close();
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setQuiet(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (done) title.current?.focus();
  }, [done]);
  useEffect(() => {
    if (quiet && opening.current) {
      clearTimers();
      setPhase('done');
    }
  }, [quiet]);
  const reveal = () => {
    opening.current = true;
    clearTimers();
    setPhase('done');
  };
  const open = () => {
    if (opening.current) return;
    opening.current = true;
    if (quiet) {
      reveal();
      return;
    }
    setPhase('shake');
    timers.current = [setTimeout(() => setPhase('glow'), 1300), setTimeout(reveal, 2700)];
  };
  const close = (collection = false) => {
    if (closed.current) return;
    closed.current = true;
    clearTimers();
    if (collection && onCollection) onCollection();else onClose();
  };
  return <dialog ref={dialog} className={'harvest-dialog ' + fruit.rarity + (quiet ? ' motion-quiet' : '')} data-phase={phase} aria-labelledby="harvest-title" onCancel={e => {
    e.preventDefault();
    close();
  }}>
    <div className="reveal-top"><span>もりからの おくりもの</span><button className="reward-back" aria-label="とじる" onClick={() => close()}>×</button></div>
    <h2 id="harvest-title" ref={title} tabIndex={-1}>{done ? fruit.type === 'character' ? 'なかまに であえた！' : 'しゅうかく できた！' : 'なにが でるかな？'}</h2>
    <div className="reveal-stage"><div className="forest-floor" aria-hidden="true" /><div className="reveal-halo" aria-hidden="true" /><div className="reveal-ring" aria-hidden="true" />
      <div className="reveal-particles" aria-hidden="true">{Array.from({
          length: 18
        }, (_, i) => <span key={i} style={{
          '--dx': Math.round(Math.cos(i * Math.PI / 9) * 115) + 'px',
          '--dy': Math.round(Math.sin(i * Math.PI / 9) * 100) + 'px',
          '--delay': i % 6 * .12 + 's'
        }}>{['✦', '✧', '●'][i % 3]}</span>)}</div>
      {done ? <img className="reveal-prize" src={fruit.image} alt={fruit.name} /> : <button className="mystery-fruit" disabled={phase !== 'ready'} onClick={open} aria-label="ふしぎな実を あける" autoFocus><img src="/public/images/fruits/fruit_apple.png" alt="" /><span aria-hidden="true">？</span></button>}
    </div>
    <div className="reveal-copy" role="status">{done ? <><span className="new-label">{isNew ? 'はじめて であったよ！' : 'もう１こ なかまいり！'}</span><h3>{fruit.name}</h3><span className="rarity-pill">{info.label}</span></> : <p>{phase === 'ready' ? 'ふしぎな実を タップしてね' : phase === 'shake' ? 'ぷるぷる… なにが でるかな？' : 'もりの ひかりが あつまった！'}</p>}</div>
    <div className="reveal-actions">{done ? <><button className="reward-primary" onClick={() => close(true)}>ずかんで みる <span aria-hidden="true">›</span></button><button className="reward-secondary" onClick={() => close()}>もどる</button></> : <button className="reward-secondary" onClick={reveal}>すぐに みる</button>}</div>
    {!done && <label className="mn-motion"><input type="checkbox" checked={quiet} onChange={e => setQuiet(e.target.checked)} />動きを ひかえる</label>}
  </dialog>;
}
