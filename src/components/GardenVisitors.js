import React, { useEffect, useRef, useState } from 'react';

const DURATIONS = { butterfly: 9000, bird: 5500, squirrel: 8500 };
const chooseVisitor = () => {
  const roll = Math.random();
  return roll < 0.5 ? 'butterfly' : roll < 0.8 ? 'bird' : 'squirrel';
};

function VisitorArt({ kind }) {
  if (kind === 'butterfly') return <svg viewBox="0 0 64 52" focusable="false">
    <g className="garden-butterfly-wings"><path d="M31 27C13-5 0 10 8 25c-12 17 9 27 23 5" fill="#f5b54e" stroke="#bc8041" strokeWidth="1.5" /><path d="M33 27C51-5 64 10 56 25c12 17-9 27-23 5" fill="#ffe09a" stroke="#bc8041" strokeWidth="1.5" /><path d="M13 17q8-7 13 7M51 17q-8-7-13 7" fill="none" stroke="#fff9dd" strokeWidth="4" strokeLinecap="round" /><circle cx="17" cy="34" r="4" fill="#ed947e" /><circle cx="47" cy="34" r="4" fill="#ed947e" /></g>
    <path d="M30 21q2-7-3-10m7 10q-2-7 3-10" fill="none" stroke="#735339" strokeWidth="1.5" strokeLinecap="round" /><ellipse cx="32" cy="29" rx="2.8" ry="12" fill="#735339" />
  </svg>;
  if (kind === 'bird') return <svg viewBox="0 0 72 52" focusable="false">
    <path d="m22 31-17-8 7 17 13-2" fill="#679daf" /><ellipse cx="37" cy="31" rx="20" ry="12" fill="#84b5bf" /><path d="M27 36q17 13 26-1" fill="#fff1ce" /><circle cx="52" cy="23" r="10" fill="#84b5bf" /><path d="m61 23 9 4-10 3" fill="#e6a750" /><circle cx="55" cy="22" r="2" fill="#3d5146" /><circle cx="55.7" cy="21.3" r="0.6" fill="white" /><path className="garden-bird-wing" d="M39 31Q19 29 21 4q20 7 25 25" fill="#a9ccd0" stroke="#6897a3" strokeWidth="1.5" />
  </svg>;
  return <svg viewBox="0 0 84 68" focusable="false">
    <path className="garden-squirrel-tail" d="M40 47C12 65 0 39 8 20 13 7 31 7 34 20c4 12-9 17-12 8 0 13 13 13 21 11" fill="#c98b56" stroke="#986342" strokeWidth="2" /><path d="M15 20q-7 18 9 25" fill="none" stroke="#e7b77d" strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="47" cy="46" rx="20" ry="14" fill="#c98b56" /><ellipse cx="56" cy="48" rx="10" ry="10" fill="#ffe5b6" /><path d="m52 24-1-16q12 2 11 18m1 0 7-14 5 18" fill="#bd7c4c" stroke="#986342" strokeWidth="1.5" /><ellipse cx="62" cy="32" rx="15" ry="13" fill="#d99c62" /><ellipse cx="70" cy="38" rx="9" ry="6" fill="#ffe5b6" /><circle cx="66" cy="29" r="3" fill="#44392d" /><circle cx="67" cy="28" r="1" fill="white" /><circle cx="78" cy="35" r="2.4" fill="#614534" /><path d="m62 43 7 6" stroke="#986342" strokeWidth="4" strokeLinecap="round" /><g className="garden-squirrel-feet" fill="#a97047"><ellipse cx="39" cy="60" rx="9" ry="4" /><ellipse cx="62" cy="60" rx="8" ry="4" /></g>
  </svg>;
}

export default function GardenVisitors() {
  const area = useRef(null);
  const firstVisit = useRef(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(() => !document.hidden);
  const [inView, setInView] = useState(true);
  const [visitor, setVisitor] = useState(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReduced(media.matches);
    const onVisibility = () => setVisible(!document.hidden);
    media.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer?.observe(area.current);
    return () => {
      media.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
    };
  }, []);
  useEffect(() => {
    setVisitor(null);
    if (paused || reduced || !visible || !inView) return;
    let timer;
    const arrive = () => {
      const kind = firstVisit.current ? 'butterfly' : chooseVisitor();
      firstVisit.current = false;
      setVisitor({ kind, reverse: Math.random() < 0.5, height: kind === 'squirrel' ? 65 : kind === 'bird' ? 8 + Math.random() * 12 : 25 + Math.random() * 15 });
      timer = setTimeout(() => {
        setVisitor(null);
        timer = setTimeout(arrive, 4000 + Math.random() * 7000);
      }, DURATIONS[kind]);
    };
    timer = setTimeout(arrive, 1800 + Math.random() * 1200);
    return () => clearTimeout(timer);
  }, [paused, reduced, visible, inView]);
  return <>
    <div ref={area} className="mn-garden-visitors" aria-hidden="true">
      {visitor && <div className={'garden-direction' + (visitor.reverse ? ' reverse' : '')}><div className={'garden-traveler ' + visitor.kind} style={{ top: visitor.height + '%', '--visit-duration': DURATIONS[visitor.kind] + 'ms' }}><div className="garden-animal"><VisitorArt kind={visitor.kind} /></div></div></div>}
    </div>
    <button className="mn-garden-motion" type="button" disabled={reduced} aria-pressed={!paused && !reduced} onClick={() => setPaused(value => !value)} title={reduced ? '端末の「動きを減らす」設定に合わせています' : 'もりの動物の動きを切り替える'}>{reduced ? 'うごきは おやすみ' : paused ? '▷ うごかす' : 'Ⅱ うごきを とめる'}</button>
  </>;
}
