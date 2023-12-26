import { sayCannotMove } from '../../util/communicator';
import { move } from './move';

export const WORKER_RALLY_POINT_NAME = 'WorkerRallyPoint';

export const rally = (creep: Creep): void => {
  const target = creep.memory.action.target as Id<_HasId>;
  let rallyPoint: _HasId | Flag | null = Game.getObjectById(target);
  if (rallyPoint === null && target in Game.flags) {
    rallyPoint = Game.flags[target];
  }

  if (rallyPoint !== null && 'pos' in rallyPoint) {
    move(creep, rallyPoint.pos);
  } else {
    sayCannotMove(creep);
  }
};
