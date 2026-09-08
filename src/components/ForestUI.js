import React from 'react';
export function PageHeader({
  title,
  onBack,
  backLabel = 'ホーム'
}) {
  return <header className="mn-heading"><button className="reward-back" onClick={onBack}>‹ {backLabel}</button><h1>{title}</h1></header>;
}
export function RewardTabs({
  value,
  onChange
}) {
  return <nav className="reward-tabs" aria-label="ごほうびのしゅるい">{[['collection', '📖', 'ずかん'], ['puzzle', '🧩', 'パズル'], ['costume', '👒', 'きせかえ']].map(([id, icon, label]) => <button key={id} aria-pressed={value === id} onClick={() => onChange(id)}><span aria-hidden="true">{icon}</span>{label}</button>)}</nav>;
}
export function Orchard({
  fruits,
  onHarvest
}) {
  return <section className={'reward-harvest orchard-card' + (fruits > 0 ? '' : ' is-harvested')}>
    <div className="orchard-art" aria-hidden="true"><img className="orchard-garden" src="/ui/garden.png" alt="" />{fruits > 0 && <><img className="orchard-fruit" src="/public/images/fruits/fruit_apple.png" alt="" /><span className="orchard-spark spark-one">✦</span><span className="orchard-spark spark-two">✧</span><span className="orchard-spark spark-three">✦</span></>}</div>
    <div className="orchard-caption"><span className="orchard-eyebrow">{fruits > 0 ? 'がんばりが みのったよ' : 'まいにち すこしずつ そだつよ'}</span><strong>{fruits > 0 ? <>みのりが <b>{fruits}こ</b> あるよ！</> : 'つぎの みのりを おたのしみに'}</strong>{fruits > 0 ? <button className="reward-primary" onClick={onHarvest}>しゅうかく <span aria-hidden="true">›</span></button> : <p className="mn-note">ミッションで 葉 → 花 → 実に そだつよ</p>}</div>
  </section>;
}
