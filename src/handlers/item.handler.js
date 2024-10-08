import { getGameAssets } from '../init/assets.js';
import { addCollectedItem } from '../models/item.model.js';
import { getCurrentStageId, getStage } from '../models/stage.model.js';

export const getItemHandler = (uuid, payload) => {
  const { itemId } = payload;
  const { items, itemUnlocks } = getGameAssets();

  // 아이템 존재 여부 확인
  const item = items.data.find((item) => item.id === itemId);
  if (!item) {
    return { status: 'fail', message: 'Invalid item Id' };
  }

  // 유저의 현재 스테이지 정보
  const currentStages = getStage(uuid);
  if (!Object.keys(currentStages).length === 0) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  const currentStageId = getCurrentStageId(uuid);

  // 현재 스테이지에서 유저가 획득한 아이템이 언락 됐는지 확인
  const unlockItems = itemUnlocks.data.filter((unlock) => unlock.stage_id <= currentStageId);
  if (!unlockItems.some((unlock) => unlock.item_id === itemId)) {
    return { status: 'fail', message: 'Item not unlocked for current Stage' };
  }

  // 획득한 아이템 정보 추가
  addCollectedItem(uuid, itemId);

  return {
    status: 'success',
    message: 'Item collected successfully',
  };
};
