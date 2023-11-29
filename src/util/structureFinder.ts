interface StructureWithStorage extends Structure {
  store: StoreDefinition;
}

const MAIN_STORAGE_STRUCTURE_LIST: StructureConstant[] = [STRUCTURE_SPAWN, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTENSION];

const isMainStorage = (structure: Structure): boolean =>
  'store' in structure && MAIN_STORAGE_STRUCTURE_LIST.includes(structure.structureType);

const compareStorage = (storage1: StructureWithStorage, storage2: StructureWithStorage): number =>
  storage1.store.getUsedCapacity(RESOURCE_ENERGY) - storage2.store.getUsedCapacity(RESOURCE_ENERGY);

const listMainStorage = (creep: Creep): StructureWithStorage[] =>
  creep.room.find(FIND_MY_STRUCTURES, { filter: isMainStorage }) as StructureWithStorage[];

const listMainStorageByUsedCapacityAscending = (creep: Creep): StructureWithStorage[] => {
  return listMainStorage(creep).sort(compareStorage);
};

const listMainStorageByUsedCapacityDescending = (creep: Creep): StructureWithStorage[] => {
  return listMainStorage(creep).sort(compareStorage).reverse();
};

export const findClosestRallyPoint = (creep: Creep, name: string): RoomPosition => {
  let rallyPoint = creep.pos.findClosestByPath(FIND_FLAGS, { filter: { name } })?.pos;
  if (rallyPoint === null) {
    rallyPoint = creep.pos.findClosestByPath(FIND_MY_SPAWNS)?.pos;
  }

  if (!rallyPoint) {
    throw new Error(`Creep ${creep.id} doesn\t have a rally point!`);
  }

  return rallyPoint;
};

export const findClosestStorageLeastUsed = (creep: Creep): StructureWithStorage | null => {
  const storageList = listMainStorageByUsedCapacityAscending(creep);

  return creep.pos.findClosestByPath(storageList, {
    filter: (storage) => storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
  });
};

export const findClosestStorageMostUsed = (creep: Creep): StructureWithStorage | null => {
  const storageList = listMainStorageByUsedCapacityDescending(creep);

  return creep.pos.findClosestByPath(storageList, {
    filter: (storage) => storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
  });
};

export const findClosestSourceActive = (creep: Creep): Source | null =>
  creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

export const findClosestConstruction = (creep: Creep): ConstructionSite | null =>
  creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
