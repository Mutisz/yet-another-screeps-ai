import { CreepRoleConstant, MAIN_SPAWN_NAME } from './config/config';
import { onTick as constructionManagerOnTick, RoadStatus } from './construction/manager';
import { manage as creepManagerOnTick } from './creep/manager';

declare global {
  interface RoomMemory {
    stopUpgrade: boolean;
    roadList: RoadStatus[];
  }
  interface CreepMemory {
    role: CreepRoleConstant;
  }
}

export const loop = () => {
  const spawn = Game.spawns[MAIN_SPAWN_NAME];
  constructionManagerOnTick(spawn.room);
  creepManagerOnTick(spawn);
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
