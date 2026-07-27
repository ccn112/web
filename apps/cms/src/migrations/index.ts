import * as migration_20260720_011627_initial from './20260720_011627_initial';
import * as migration_20260724_123320_add_editorial_solution_fields from './20260724_123320_add_editorial_solution_fields';
import * as migration_20260725_060131_add_lead_consultation from './20260725_060131_add_lead_consultation';
import * as migration_20260727_022037_add_payload_jobs from './20260727_022037_add_payload_jobs';
import * as migration_99999999_999999_seed_content from './99999999_999999_seed_content';

export const migrations = [
  {
    up: migration_20260720_011627_initial.up,
    down: migration_20260720_011627_initial.down,
    name: '20260720_011627_initial',
  },
  {
    up: migration_20260724_123320_add_editorial_solution_fields.up,
    down: migration_20260724_123320_add_editorial_solution_fields.down,
    name: '20260724_123320_add_editorial_solution_fields',
  },
  {
    up: migration_20260725_060131_add_lead_consultation.up,
    down: migration_20260725_060131_add_lead_consultation.down,
    name: '20260725_060131_add_lead_consultation',
  },
  {
    up: migration_20260727_022037_add_payload_jobs.up,
    down: migration_20260727_022037_add_payload_jobs.down,
    name: '20260727_022037_add_payload_jobs',
  },
  {
    up: migration_99999999_999999_seed_content.up,
    down: migration_99999999_999999_seed_content.down,
    name: '99999999_999999_seed_content'
  },
];
