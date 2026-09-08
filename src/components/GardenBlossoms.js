import React from 'react';

// 保存済みの花と、実になる直前の２輪を木に重ねる表示専用の部品。
export default function GardenBlossoms({ flowers = 0, phase = null }) {
  const changing = phase === 'pair' || phase === 'ripen';
  const count = Math.max(0, Math.floor(Number(flowers) || 0));
  return <div className="mn-blossoms" aria-hidden="true">
    {Array.from({ length: count + (changing ? 2 : 0) }, (_, i) => {
      const transient = changing && i >= count;
      const opening = (phase === 'flower' && i === count - 1) || (phase === 'pair' && i === count + 1);
      return <div key={i} className={'mn-blossom-position blossom-slot-' + i % 4}>
        <div className={'mn-blossom' + (opening ? ' is-opening' : '') + (transient && phase === 'ripen' ? ' is-ripening' : '')}>
          <svg viewBox="0 0 64 64" focusable="false">
            <path d="M32 43q-19 12-23-1 13-4 23 1m0 0q12-16 24-8-6 13-24 8" fill="#87a84c" stroke="#557b36" strokeWidth="1.5" />
            <g className="mn-blossom-petals">
              {[0, 72, 144, 216, 288].map(angle => <g key={angle} transform={'rotate(' + angle + ' 32 31)'}><path d="M32 32C12 19 19 3 28 9q4-7 9-2 14 9-5 25Z" fill="#ffd6df" stroke="#cc8197" strokeWidth="1.3" /><path d="M31 26q-4-7-3-10" stroke="#fff5ed" strokeWidth="3" strokeLinecap="round" fill="none" /></g>)}
              <circle cx="32" cy="31" r="6" fill="#efc361" stroke="#bf9148" strokeWidth="1.3" /><circle cx="30" cy="29" r="2" fill="#fff3ba" />
            </g>
            {opening && <path className="mn-blossom-bud" d="M32 41C10 24 23 14 32 24c10-12 24 1 0 17Z" fill="#e997b0" stroke="#bd748e" strokeWidth="1.5" />}
          </svg>
        </div>
      </div>;
    })}
    {phase === 'ripen' && <span className="mn-bloom-glimmer">✦</span>}
  </div>;
}
