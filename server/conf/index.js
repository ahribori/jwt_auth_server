import yaml from 'js-yaml';
import fs from 'fs';

const config = yaml.safeLoad(fs.readFileSync('_config.yml', 'utf8'));
console.log(config);

export default config;