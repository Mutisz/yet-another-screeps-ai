import { sayCannotMove } from '../../util/communicator';

export const move = (creep: Creep, target: RoomPosition | { pos: RoomPosition }): void => {
  const moveResult = creep.moveTo(target);
  if (moveResult !== OK) {
    sayCannotMove(creep);
  }
};
