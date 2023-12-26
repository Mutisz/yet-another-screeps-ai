export const pruneCreepMemory = () => {
  for (const name in Memory.creeps) {
    const creepIsAlive = name in Game.creeps;
    if (!creepIsAlive) {
      delete Memory.creeps[name];
    }
  }
};
