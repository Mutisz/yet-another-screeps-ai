import { first, uniq } from 'lodash';
import { StructurePosition } from '../manager';

const findPath = (room: Room, positionList: RoomPosition[]): StructurePosition[] => {
  let path: PathStep[] = [];
  for (let i = 0; i < positionList.length; i++) {
    const position = positionList[i];
    const nextPosition = i in positionList ? positionList[i] : null;
    if (nextPosition !== null) {
      path = path.concat(room.findPath(position, nextPosition, { ignoreCreeps: true }));
    }
  }

  return uniq(path).map(({ x, y }) => ({ x, y }));
};

export const plan = (positionList: RoomPosition[]): void => {
  const positionFirst = first(positionList);
  if (positionFirst === undefined) {
    return;
  }

  const room = Game.rooms[positionFirst.roomName];
  room.memory.structureList.push({
    type: STRUCTURE_WALL,
    lastMaintenance: 0,
    positionIterator: 0,
    positionList: findPath(room, positionList),
  });
};
