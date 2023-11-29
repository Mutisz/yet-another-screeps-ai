export const loop = () => {
  console.log(`Current game tick is ${Game.time}`);
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
