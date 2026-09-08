import React, { useRef, useState } from 'react';
import MameCharacter from '../components/MameCharacter';
import RobotCharacter from '../components/RobotCharacter';
export default function NamingScreen({
  onNameDecided
}) {
  const [mameName, setMameName] = useState('まめ'),
    [robotName, setRobotName] = useState('ロボちゃん');
  const submitted = useRef(false);
  return <main className="mn-page mn-naming"><h1>せんせいの なまえ</h1><p>すきな なまえで よんでね！</p><form onSubmit={e => {
      e.preventDefault();
      if (submitted.current || !mameName.trim() || !robotName.trim()) return;
      submitted.current = true;
      onNameDecided(mameName.trim(), robotName.trim());
    }}>
    <div className="mn-name-pair"><label><MameCharacter size={100} enableTap={false} />まめの なまえ<input value={mameName} onChange={e => setMameName(e.target.value)} maxLength={10} required autoComplete="off" /></label><label><RobotCharacter size={100} enableTap={false} />ロボちゃんの なまえ<input value={robotName} onChange={e => setRobotName(e.target.value)} maxLength={10} required autoComplete="off" /></label></div>
    <p className="mn-note">１０もじまで。ほんみょうは いれないでね。</p><button className="reward-primary" disabled={!mameName.trim() || !robotName.trim()}>このなまえで いこう！ <span aria-hidden="true">›</span></button>
  </form></main>;
}
