import { sayCannotWithdraw, sayWithdraw } from '../../util/communicator';
import { StructureWithStorage, findClosestStorageMostUsed } from '../../util/structureFinder';
import { move } from './move';

const logWithdrawResult = (creep: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayWithdraw(creep, RESOURCE_ENERGY);
      break;
    default:
      sayCannotWithdraw(creep);
      console.log(`Creep ${creep.name} failed withdrawing with ${result} error code!`);
  }
};

export const withdraw = (creep: Creep): void => {
  const target = creep.memory.action.target as Id<StructureWithStorage>;
  const storage = Game.getObjectById(target) ?? findClosestStorageMostUsed(creep);
  if (storage === null) {
    sayCannotWithdraw(creep);
    return;
  }

  const result = creep.withdraw(storage, RESOURCE_ENERGY);
  if (result === ERR_NOT_IN_RANGE) {
    move(creep, storage);
  } else {
    logWithdrawResult(creep, result);
  }
};
