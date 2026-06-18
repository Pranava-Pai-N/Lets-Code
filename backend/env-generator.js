import fs from "fs";
import path from "path";
import crypto from "crypto";

const ENV_PATH = path.join(process.cwd(), '.env');
const EXAMPLE_PATH = path.join(process.cwd(), '.env.example');

function generateHexValues(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}


function envGenerator() {
    if (fs.existsSync(ENV_PATH)) {
        console.log(".env file already exists.")
        return;
    }

    if (!fs.existsSync(EXAMPLE_PATH)) {
        console.log(".env.example file does not exists.")
        process.exit(1);
    }

    const content = fs.readFileSync(EXAMPLE_PATH, 'utf8');
    const lines = content.split(/\r?\n/);

    const updatedLines = lines.map(line => {
        if (!line || line.trim().startsWith('#') || !line.includes('=')) {
            return line;
        }

        const firstEqualsIndex = line.indexOf('=');
        const key = line.substring(0, firstEqualsIndex).trim();
        let value = line.substring(firstEqualsIndex + 1).trim();

        if (value.startsWith('YOUR_')) {
            value = generateHexValues();
        }

        if (value.includes('|')) {
            value = value.split('|')[0].trim();
        }

        return `${key}=${value}`;
    });


    fs.writeFileSync(ENV_PATH, updatedLines.join('\n'), 'utf8');
    console.log('Success: Created .env with auto-generated values');
}


envGenerator()