import { CreepRoleConstant, MAIN_SPAWN_NAME } from './config/config';
import { onTick as constructionManagerOnTick, RoadStatus } from './construction/manager';
import { onTick as creepManagerOnTick } from './creep/manager';

declare global {
  interface RoomMemory {
    stopUpgrade: boolean;
    roadList: RoadStatus[];
  }
  interface CreepMemory {
    role: CreepRoleConstant;
  }
}

const initializeMemory = (room: Room): void => {
  room.memory.stopUpgrade = room.memory.stopUpgrade === undefined ? false : room.memory.stopUpgrade;
  room.memory.roadList = room.memory.roadList === undefined ? [] : room.memory.roadList;
};

export const loop = () => {
  const spawn = Game.spawns[MAIN_SPAWN_NAME];
  initializeMemory(spawn.room);
  constructionManagerOnTick(spawn.room);
  creepManagerOnTick(spawn);
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
