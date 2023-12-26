import { sayCannotDeposit, sayDeposit } from '../../util/communicator';
import { StructureWithStorage, findClosestStorageLeastUsed } from '../../util/structureFinder';
import { move } from './move';

const logDepositResult = (creep: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayDeposit(creep, RESOURCE_ENERGY);
      break;
    default:
      sayCannotDeposit(creep);
      console.log(`Creep ${creep.name} failed storing with ${result} error code!`);
  }
};

export const deposit = (creep: Creep): void => {
  const target = creep.memory.action.target as Id<StructureWithStorage>;
  const storage = Game.getObjectById(target) ?? findClosestStorageLeastUsed(creep);
  if (storage === null) {
    sayCannotDeposit(creep);
    return;
  }

  const result = creep.transfer(storage, RESOURCE_ENERGY);
  if (result === ERR_NOT_IN_RANGE) {
    move(creep, storage);
  } else {
    logDepositResult(creep, result);
  }
};
