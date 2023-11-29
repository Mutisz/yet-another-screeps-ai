import { ROLE_BUILDER, ROLE_HARVESTER, ROLE_UPGRADER } from '../config/config';

const ICON_NEGATE = '❌';

const ICON_BUILD = '🛠️';
const ICON_MINE = '⛏️';
const ICON_UPGRADE = '⏫';
const ICON_STORE = '⬇️';
const ICON_WITHDRAW = '⬆️';

const ICON_STORAGE = '📦';

const ICON_RESOURCE: { [k: string]: string } = {
  [RESOURCE_ENERGY]: '⚡',
};

const ICON_STRUCTURE: { [k: string]: string } = {
  [STRUCTURE_ROAD]: '🚘',
};

const ICON_ROLE: { [k: string]: string } = {
  [ROLE_BUILDER]: ICON_BUILD,
  [ROLE_HARVESTER]: ICON_MINE,
  [ROLE_UPGRADER]: ICON_UPGRADE,
};

export const sayBuild = (creep: Creep, structure: StructureConstant): number =>
  creep.say(`${ICON_BUILD} ${ICON_STRUCTURE[structure]}`);
export const sayMine = (creep: Creep, resource: ResourceConstant): number =>
  creep.say(`${ICON_MINE} ${ICON_RESOURCE[resource]}`);
export const sayUpgrade = (creep: Creep): number => creep.say(ICON_UPGRADE);
export const sayStore = (creep: Creep, resource: ResourceConstant): number =>
  creep.say(`${ICON_STORE} ${ICON_RESOURCE[resource]}`);
export const sayWithdraw = (creep: Creep, resource: string): number =>
  creep.say(`${ICON_WITHDRAW} ${ICON_RESOURCE[resource]}`);

export const sayCannotBuild = (creep: Creep): number => creep.say(`${ICON_NEGATE} ${ICON_BUILD}`);
export const sayCannotMine = (creep: Creep): number => creep.say(`${ICON_NEGATE} ${ICON_MINE}`);
export const sayCannotUpgrade = (creep: Creep): number => creep.say(`${ICON_NEGATE} ${ICON_UPGRADE}`);
export const sayCannotStoreOrWithdraw = (creep: Creep): number => creep.say(`${ICON_NEGATE} ${ICON_STORAGE}`);

export const sayChangeRole = (creep: Creep, role: string): number => creep.say(`${ICON_NEGATE} ${ICON_ROLE[role]}`);
