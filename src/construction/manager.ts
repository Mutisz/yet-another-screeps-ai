import { curry, pull } from 'lodash';

type StructureType = STRUCTURE_ROAD | STRUCTURE_WALL;

export interface StructureStatus {
  type: StructureType;
  lastMaintenance: number;
  positionIterator: number;
  positionList: StructurePosition[];
}

export interface StructurePosition {
  x: number;
  y: number;
}

const COLOR: { [k: string]: string } = {
  STRUCTURE_ROAD: '#D3D3D3',
  STRUCTURE_WALL: '#FFA3A3',
};
const HITS_FRACTION_MIN: { [k: string]: number } = {
  STRUCTURE_ROAD: 0.2,
  STRUCTURE_WALL: 0.4,
};
const HITS_FRACTION_MAX: { [k: string]: number } = {
  STRUCTURE_ROAD: 0.4,
  STRUCTURE_WALL: 0.6,
};
const MAINTENANCE_FREQUENCY: { [k: string]: number } = {
  STRUCTURE_ROAD: 1000,
  STRUCTURE_WALL: 2000,
};

const findStructure = (room: Room, status: StructureStatus) => {
  const position = status.positionList[status.positionIterator];

  return (
    room
      .lookForAt(LOOK_STRUCTURES, position.x, position.y)
      .find((structure) => structure.structureType === status.type) ?? null
  );
};

const findConstruction = (room: Room, status: StructureStatus) => {
  const position = status.positionList[status.positionIterator];

  return (
    room
      .lookForAt(LOOK_CONSTRUCTION_SITES, position.x, position.y)
      .find((construction) => construction.structureType === status.type) ?? null
  );
};

const drawPathBuild = (room: Room, status: StructureStatus): void =>
  status.positionList.forEach((position) => room.visual.circle(position.x, position.y, { fill: COLOR[status.type] }));

const drawPathMaintain = (room: Room, status: StructureStatus): void =>
  status.positionList.forEach((position) =>
    room.visual.rect(position.x - 0.2, position.y - 0.2, 0.3, 0.3, { fill: COLOR[status.type] }),
  );

const drawPath = (room: Room, status: StructureStatus): void => {
  if (status.lastMaintenance === 0) {
    drawPathBuild(room, status);
  } else {
    drawPathMaintain(room, status);
  }
};

const isCompleted = (status: StructureStatus) => status.positionIterator >= status.positionList.length;

const resetPositionIteratorIfMaintenanceRequired = (status: StructureStatus): void => {
  if (isCompleted(status) && Game.time - status.lastMaintenance > MAINTENANCE_FREQUENCY[status.type]) {
    status.positionIterator = 0;
  }
};

const build = (room: Room, status: StructureStatus): void => {
  const position = status.positionList[status.positionIterator];
  room.createConstructionSite(position.x, position.y, status.type);
};

const maintain = (structure: Structure, status: StructureStatus): void => {
  const hitsFraction = structure.hits / structure.hitsMax;
  if (hitsFraction < HITS_FRACTION_MIN[status.type]) {
    structure.room.memory.maintenanceList.push(structure.id);
  } else if (hitsFraction > HITS_FRACTION_MAX[status.type]) {
    pull(structure.room.memory.maintenanceList, structure.id);
    status.positionIterator++;
  }

  if (isCompleted(status)) {
    status.lastMaintenance = Game.time;
  }
};

const buildOrMaintain = (room: Room, status: StructureStatus): void => {
  resetPositionIteratorIfMaintenanceRequired(status);
  if (isCompleted(status)) {
    return;
  }

  const structure = findStructure(room, status);
  const construction = structure === null ? findConstruction(room, status) : null;

  drawPath(room, status);
  if (structure === null && construction === null) {
    build(room, status);
  } else if (structure !== null) {
    maintain(structure, status);
  }
};

export const onTick = (room: Room): void => {
  room.memory.structureList.forEach(curry(buildOrMaintain)(room));
};
