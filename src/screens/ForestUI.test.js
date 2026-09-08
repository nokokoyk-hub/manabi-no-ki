import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LearningScreen from './LearningScreen';
import HarvestScreen from './HarvestScreen';
import GohoubiScreen from './GohoubiScreen';
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
