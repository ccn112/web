import * as migration_20260720_011627_initial from './20260720_011627_initial';

export const migrations = [
  {
    up: migration_20260720_011627_initial.up,
    down: migration_20260720_011627_initial.down,
    name: '20260720_011627_initial'
  },
];
