// 給 JavaScriptCore 命令列（Safari 的引擎）執行的重播入口：輸入重播 JSON，輸出最後狀態摘要。
import { runReplay, type Replay } from '../../../src/sim';

(globalThis as unknown as { runIt: (json: string) => string }).runIt = (json: string) => {
  const g = runReplay(JSON.parse(json) as Replay);
  return `${g.stateHash()}|${JSON.stringify(g.result)}`;
};
