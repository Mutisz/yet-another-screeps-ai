import { CreepRoleConstant, MAIN_SPAWN_NAME } from './config/config';

declare global {
  interface RoomMemory {
    stopUpgrade: boolean;
  }
  interface CreepMemory {
    role: CreepRoleConstant;
  }
}

export const loop = () => {
  const spawn = Game.spawns[MAIN_SPAWN_NAME];
  console.log(spawn.id);
  // constructionManager.manage(spawn);
  // creepManager.manage(spawn);
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
