import { write } from '../database/grakn';
import { createIndexes } from '../database/elasticSearch';

const fs = require('fs');

createIndexes();

const schema = fs.readFileSync('./src/stix2.gql', 'utf8');
write(schema).then(() => {
  process.exit(0);
});
