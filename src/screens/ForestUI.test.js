import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LearningScreen from './LearningScreen';
import HarvestScreen from './HarvestScreen';
import GohoubiScreen from './GohoubiScreen';
import HomeScreen from './HomeScreen';
import GardenVisitors from '../components/GardenVisitors';
import { getTodayQuestions } from '../lib/questionLoader';
import { recordAnswer, equipItem, unequipAll } from '../lib/storage';
jest.mock('../lib/questionLoader', () => ({
  getTodayQuestions: jest.fn(),
  getQuestionsByCategory: jest.fn(),
  getQuestionsBySubject: jest.fn()
}));
jest.mock('../lib/storage', () => ({
  recordAnswer: jest.fn(),
  loadPuzzleData: () => ({
    currentPuzzleId: 'spring',
    collected: 4,
    completedIds: []
  }),
  loadCostumeData: () => ({
    unlockedItems: ['ribbon'],
    equippedItems: {}
  }),
  equipItem: jest.fn(() => ({
    unlockedItems: ['ribbon'],
    equippedItems: {
      head: 'ribbon'
    }
  })),
  unequipAll: jest.fn(() => ({
    unlockedItems: ['ribbon'],
    equippedItems: {}
  }))
}));
jest.mock('../components/CharacterDisplay', () => () => <div>せんせい</div>);
jest.mock('../components/MameCharacter', () => () => <div>まめ</div>);
jest.mock('../lib/supabase', () => ({
  supabase: null
}));
let host, root;
const buttons = () => [...host.querySelectorAll('button')];
const button = text => buttons().find(b => b.textContent.includes(text));
const click = async node => {
  await act(async () => node.click());
};
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  window.scrollTo = jest.fn();
  window.matchMedia = jest.fn(() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }));
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  jest.clearAllMocks();
  equipItem.mockImplementation(() => ({
    unlockedItems: ['ribbon'],
    equippedItems: {
      head: 'ribbon'
    }
  }));
  unequipAll.mockImplementation(() => ({
    unlockedItems: ['ribbon'],
    equippedItems: {}
  }));
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test('森の動物は１匹ずつ現れ、ランダムな次の訪問と停止・再開を扱う', async () => {
  jest.useFakeTimers();
  const schedule = jest.spyOn(global, 'setTimeout');
  const cancel = jest.spyOn(global, 'clearTimeout');
  const random = jest.spyOn(Math, 'random').mockReturnValue(0);
  await act(async () => root.render(<GardenVisitors />));
  await act(async () => jest.advanceTimersByTime(1800));
  expect(host.querySelector('.garden-traveler.butterfly')).not.toBeNull();
  random.mockReturnValue(0.9);
  await act(async () => jest.advanceTimersByTime(9000));
  expect(host.querySelector('.garden-traveler')).toBeNull();
  await act(async () => jest.advanceTimersByTime(10300));
  expect(host.querySelectorAll('.garden-traveler')).toHaveLength(1);
  expect(host.querySelector('.garden-traveler.squirrel')).not.toBeNull();
  await click(button('うごきを とめる'));
  await act(async () => jest.advanceTimersByTime(30000));
  expect(host.querySelector('.garden-traveler')).toBeNull();
  random.mockReturnValue(0);
  await click(button('うごかす'));
  await act(async () => jest.advanceTimersByTime(3000));
  expect(host.querySelector('.garden-traveler.butterfly')).not.toBeNull();
  random.mockReturnValue(0.6);
  await act(async () => jest.advanceTimersByTime(9000 + 8200));
  expect(host.querySelector('.garden-traveler.bird')).not.toBeNull();
  const birdTimerIndex = schedule.mock.calls.findIndex(call => call[1] === 5500);
  const birdTimer = schedule.mock.results[birdTimerIndex].value;
  await act(async () => root.render(null));
  expect(cancel).toHaveBeenCalledWith(birdTimer);
});

test('端末の動きを減らす設定を反映し、タブが非表示なら動物とタイマーを止める', async () => {
  jest.useFakeTimers();
  let onMotion;
  const media = { matches: true, addEventListener: (type, callback) => { onMotion = callback; }, removeEventListener: jest.fn() };
  window.matchMedia.mockReturnValue(media);
  await act(async () => root.render(<GardenVisitors />));
  expect(button('うごきは おやすみ').disabled).toBe(true);
  await act(async () => jest.advanceTimersByTime(30000));
  expect(host.querySelector('.garden-traveler')).toBeNull();
  await act(async () => { media.matches = false; onMotion(); });
  await act(async () => jest.advanceTimersByTime(3000));
  expect(host.querySelector('.garden-traveler')).not.toBeNull();
  jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  await act(async () => document.dispatchEvent(new Event('visibilitychange')));
  expect(host.querySelector('.garden-traveler')).toBeNull();
  await act(async () => jest.advanceTimersByTime(30000));
  expect(host.querySelector('.garden-traveler')).toBeNull();
});
test('８問を手動で進め、各回答と完了を一度だけ通知する', async () => {
  jest.useFakeTimers();
  getTodayQuestions.mockResolvedValue(Array.from({
    length: 8
  }, (_, i) => ({
    id: 'q' + i,
    question: 'もんだい' + i,
    options: ['正しいこたえ', '別のこたえ'],
    correct: 0,
    hint: 'ヒント本文',
    explanation: '解説本文',
    subject: 'さんすう'
  })));
  const complete = jest.fn();
  await act(async () => root.render(<LearningScreen onComplete={complete} onBack={jest.fn()} />));
  expect(host.querySelector('#question-hint').hidden).toBe(true);
  await click(button('ヒントを みる'));
  expect(host.querySelector('#question-hint').hidden).toBe(false);
  for (let i = 0; i < 8; i++) {
    const answer = host.querySelectorAll('.mn-answer')[i === 0 ? 1 : 0];
    await act(async () => {
      answer.click();
      answer.click();
    });
    expect(recordAnswer).toHaveBeenCalledTimes(i + 1);
    expect(host.querySelector('.mn-feedback').textContent).toContain('解説本文');
    await act(async () => jest.advanceTimersByTime(10000));
    expect(host.querySelector('.mn-question h2').textContent).toBe('もんだい' + i);
    await click(button(i === 7 ? 'けっかを みる' : 'つぎの もんだいへ'));
  }
  const finish = button('ホームに もどる');
  await act(async () => {
    finish.click();
    finish.click();
  });
  expect(complete).toHaveBeenCalledTimes(1);
  expect(complete).toHaveBeenCalledWith(7, 8);
});
test('収穫の通常演出は段階的に進み、図鑑への完了通知は一度だけ', async () => {
  jest.useFakeTimers();
  const close = jest.fn(),
    collection = jest.fn();
  await act(async () => root.render(<HarvestScreen fruit={{
    id: 'apple',
    name: 'りんご',
    rarity: 'normal',
    image: '/apple.png'
  }} isNew onClose={close} onCollection={collection} />));
  expect(host.querySelector('dialog').dataset.phase).toBe('ready');
  await click(host.querySelector('.mystery-fruit'));
  expect(host.querySelector('dialog').dataset.phase).toBe('shake');
  await act(async () => jest.advanceTimersByTime(1300));
  expect(host.querySelector('dialog').dataset.phase).toBe('glow');
  await act(async () => jest.advanceTimersByTime(1400));
  expect(host.querySelector('dialog').dataset.phase).toBe('done');
  const finish = button('ずかんで みる');
  await act(async () => {
    finish.click();
    finish.click();
  });
  expect(collection).toHaveBeenCalledTimes(1);
  expect(close).not.toHaveBeenCalled();
});
test('スキップ後に古いタイマーが結果を戻さず、動きをひかえる設定では即時表示', async () => {
  jest.useFakeTimers();
  await act(async () => root.render(<HarvestScreen fruit={{
    id: 'apple',
    name: 'りんご',
    rarity: 'normal',
    image: '/apple.png'
  }} onClose={jest.fn()} />));
  await click(host.querySelector('.mystery-fruit'));
  await click(button('すぐに みる'));
  await act(async () => jest.advanceTimersByTime(10000));
  expect(host.querySelector('dialog').dataset.phase).toBe('done');
  await act(async () => root.render(<HarvestScreen key="quiet" fruit={{
    id: 'apple',
    name: 'りんご',
    rarity: 'normal',
    image: '/apple.png'
  }} onClose={jest.fn()} />));
  await click(host.querySelector('input[type=checkbox]'));
  await click(host.querySelector('.mystery-fruit'));
  expect(host.querySelector('dialog').dataset.phase).toBe('done');
  expect(host.querySelector('dialog').className).toContain('motion-quiet');
});
test('図鑑は所有数を表示し、ロック中の着せ替えは装着せず、解除は保存関数につなぐ', async () => {
  await act(async () => root.render(<GohoubiScreen collection={{
    items: {
      apple: {
        count: 3
      }
    },
    totalHarvests: 3
  }} fruits={0} onBack={jest.fn()} onMission={jest.fn()} />));
  expect(host.querySelector('.treasure-card').textContent).toContain('りんご3こ');
  await click(button('きせかえ'));
  await click(button('おうかん'));
  expect(equipItem).not.toHaveBeenCalled();
  expect(host.querySelector('#unlock-title').textContent).toBe('おうかん');
  await click(button('きせかえに もどる'));
  await click(button('ピンクリボン'));
  expect(equipItem).toHaveBeenCalledWith('ribbon');
  expect(button('ピンクリボン').getAttribute('aria-pressed')).toBe('true');
  await click(button('ぜんぶ はずす'));
  expect(unequipAll).toHaveBeenCalledTimes(1);
  await click(button('パズル'));
  expect(host.querySelectorAll('.mn-puzzle .found')).toHaveLength(4);
});

test('パズルを直接開き、完了済みミッションは開始せず、未完了なら開始できる', async () => {
  const onMission = jest.fn();
  await act(async () => root.render(<GohoubiScreen initialTab="puzzle" todayDone onMission={onMission} />));
  expect(host.querySelector('.mn-puzzle')).not.toBeNull();
  expect(host.querySelector('.treasure-card')).toBeNull();
  const doneButton = button('きょうは クリア！');
  expect(doneButton.disabled).toBe(true);
  await click(doneButton);
  expect(onMission).not.toHaveBeenCalled();
  await act(async () => root.render(<GohoubiScreen initialTab="puzzle" todayDone={false} onMission={onMission} />));
  await click(button('ミッションへ いこう！'));
  expect(onMission).toHaveBeenCalledTimes(1);
});

test.each([[0, 0, 4], [1, 0, 3], [0, 1, 2], [1, 1, 1], [4, 0, 2], [4, 1, 1]])('葉%s・花%sから次の実までのミッション数は%s回', async (leaves, flowers, expected) => {
  await act(async () => root.render(<HomeScreen leaves={leaves} flowers={flowers} fruits={0} streak={0} todayDone selectedCharacter="mame" petName="まめ" rawPetName="まめ" />));
  expect(host.querySelector('.mn-growth-next').textContent).toContain('ミッション あと ' + expected + 'かい！');
  expect(host.querySelector('.mn-growth-next').textContent).toContain('つづきは あした');
});
