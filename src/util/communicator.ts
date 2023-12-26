import { ROLE_BUILDER, ROLE_HARVESTER, ROLE_UPGRADER } from '../creep/role/_const';

const ICON_NEGATE = '❌';

const ICON_MOVE = '🏃🏻';

const ICON_BUILD = '🛠️';
const ICON_DEPOSIT = '▶️📦';
const ICON_HARVEST = '⛏️';
const ICON_MAINTAIN = '🚧';
const ICON_UPGRADE = '🏆';
const ICON_WITHDRAW = '◀️📦';

const ICON_RESOURCE: { [k: string]: string } = {
  [RESOURCE_ENERGY]: '⚡',
};

const ICON_STRUCTURE: { [k: string]: string } = {
  [STRUCTURE_ROAD]: '🚘',
  [STRUCTURE_EXTENSION]: '📦',
};

const ICON_ROLE: { [k: string]: string } = {
  [ROLE_BUILDER]: ICON_BUILD,
  [ROLE_HARVESTER]: ICON_HARVEST,
  [ROLE_UPGRADER]: ICON_UPGRADE,
};

const negate = (icon: string): string => `${ICON_NEGATE} ${icon}`;

export const sayCannotMove = (creep: Creep): number => creep.say(negate(ICON_MOVE));

export const sayBuild = (creep: Creep, structure: StructureConstant): number =>
  creep.say(`${ICON_BUILD} ${ICON_STRUCTURE[structure]}`);
export const sayCannotBuild = (creep: Creep): number => creep.say(negate(ICON_BUILD));

export const sayDeposit = (creep: Creep, resource: ResourceConstant): number =>
  creep.say(`${ICON_DEPOSIT} ${ICON_RESOURCE[resource]}`);
export const sayCannotDeposit = (creep: Creep): number => creep.say(negate(ICON_DEPOSIT));

export const sayHarvest = (creep: Creep, resource: ResourceConstant): number =>
  creep.say(`${ICON_HARVEST} ${ICON_RESOURCE[resource]}`);
export const sayCannotHarvest = (creep: Creep): number => creep.say(negate(ICON_HARVEST));

export const sayMaintain = (creep: Creep, maintenance: StructureConstant): number =>
  creep.say(`${ICON_MAINTAIN} ${ICON_STRUCTURE[maintenance]}`);
export const sayCannotMaintain = (creep: Creep): number => creep.say(negate(ICON_MAINTAIN));

export const sayUpgrade = (creep: Creep): number => creep.say(ICON_UPGRADE);
export const sayCannotUpgrade = (creep: Creep): number => creep.say(negate(ICON_UPGRADE));

export const sayWithdraw = (creep: Creep, resource: string): number =>
  creep.say(`${ICON_WITHDRAW} ${ICON_RESOURCE[resource]}`);
export const sayCannotWithdraw = (creep: Creep): number => creep.say(negate(ICON_WITHDRAW));

export const sayChangeRole = (creep: Creep, role: string): number => creep.say(`I am a ${ICON_ROLE[role]}`);
