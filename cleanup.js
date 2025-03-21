import fs from 'fs'
import path from 'path';

const log = path.resolve('./peeps.txt')
if (fs.existsSync(log)) {
    fs.unlinkSync(log);
    console.log('Deleted old log file');
} else {
    console.log(`No existing log file found.`);
}
