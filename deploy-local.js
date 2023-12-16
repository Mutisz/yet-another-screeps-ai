import copyfiles from 'copyfiles';
import { config } from 'dotenv';
import { rimraf } from 'rimraf';

const env = config();
if (env.error !== undefined) {
  throw new Error(env.error.message);
}

if (!process.env.GAME_SCRIPTS_DIRECTORY) {
  throw new Error('Missing copy path!');
}

rimraf(process.env.GAME_SCRIPTS_DIRECTORY + '/dist');
copyfiles(['./dist/**/*', process.env.GAME_SCRIPTS_DIRECTORY], (error) => {
  if (error !== undefined) {
    console.log(error.message);
  }
});
