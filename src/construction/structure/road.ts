import { StructurePosition } from '../manager';

const findPath = (origin: RoomPosition, destination: RoomPosition): StructurePosition[] =>
  Game.rooms[origin.roomName]
    .findPath(origin, destination, { ignoreCreeps: true, swampCost: 1, range: 1 })
    .map(({ x, y }) => ({ x, y }));

export const plan = (origin: RoomPosition, destination: RoomPosition): void => {
  const room = Game.rooms[origin.roomName];
  room.memory.structureList.push({
    type: STRUCTURE_ROAD,
    lastMaintenance: 0,
    positionIterator: 0,
    positionList: findPath(origin, destination),
  });
};
