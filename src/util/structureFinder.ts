export interface StructureWithStorage extends Structure {
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
  let rallyPoint: Flag | Structure | null = creep.pos.findClosestByPath(FIND_FLAGS, { filter: { name } });
  if (rallyPoint === null) {
    rallyPoint = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
  }

  if (rallyPoint === null) {
    throw new Error(`Creep ${creep.id} doesn\t have a rally point!`);
  }

  return rallyPoint.pos;
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

export const findClosestMaintenance = (creep: Creep): Structure | null => {
  const maintenanceList = creep.room.memory.maintenanceList
    .map((id) => Game.getObjectById(id)?.pos)
    .filter((position) => position !== undefined) as RoomPosition[];
  const maintenance = creep.pos
    .findClosestByPath(maintenanceList, { ignoreCreeps: true })
    ?.look()
    .find((object) => object.structure !== undefined)?.structure;

  return maintenance ?? null;
};
