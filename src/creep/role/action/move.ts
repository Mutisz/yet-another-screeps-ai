import { WORKER_RALLY_POINT_NAME } from '../../../config/config';
import { sayCannotMove } from '../../../util/communicator';
import { findClosestRallyPoint } from '../../../util/structureFinder';

export const move = (creep: Creep, target: RoomPosition | { pos: RoomPosition }): void => {
  const moveResult = creep.moveTo(target);
  if (moveResult === ERR_NO_PATH) {
    sayCannotMove(creep);
  }
};

export const moveToWorkerRallyPoint = (worker: Creep): void => {
  const rallyPoint = findClosestRallyPoint(worker, WORKER_RALLY_POINT_NAME);

  move(worker, rallyPoint);
};
