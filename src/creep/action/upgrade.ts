import { sayCannotUpgrade, sayUpgrade } from '../../util/communicator';
import { move } from './move';

const logUpgradeResult = (creep: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayUpgrade(creep);
      break;
    default:
      sayCannotUpgrade(creep);
      console.log(`Creep ${creep.name} failed upgrading controller with ${result} error code!`);
  }
};

export const upgrade = (creep: Creep): void => {
  const target = creep.memory.action.target as Id<StructureController>;
  const controller = Game.getObjectById(target) ?? creep.room.controller ?? null;
  if (controller === null) {
    sayCannotUpgrade(creep);
    return;
  }

  const result = creep.upgradeController(controller);
  if (result === ERR_NOT_IN_RANGE) {
    move(creep, controller);
  } else {
    logUpgradeResult(creep, result);
  }
};
