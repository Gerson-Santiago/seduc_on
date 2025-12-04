
const fs = require('fs');
const path = require('path');

const backendEnvPath = path.join(__dirname, '../backend/.env');
const frontendEnvPath = path.join(__dirname, '../frontend/.env');

function getEnvValue(filePath, key) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : null;
}

function validate() {
    console.log('🔍 Validating Google Login Configuration...');

    const backendClientId = getEnvValue(backendEnvPath, 'GOOGLE_CLIENT_ID');
    const frontendClientId = getEnvValue(frontendEnvPath, 'VITE_GOOGLE_CLIENT_ID');

    console.log(`\nBackend GOOGLE_CLIENT_ID: ${backendClientId}`);
    console.log(`Frontend VITE_GOOGLE_CLIENT_ID: ${frontendClientId}`);

    if (!backendClientId || !frontendClientId) {
        console.error('\n❌ Missing environment variables!');
        process.exit(1);
    }

    if (backendClientId !== frontendClientId) {
        console.error('\n❌ MISMATCH DETECTED!');
        console.error('The Frontend and Backend Google Client IDs do not match.');
        console.error('Please fix the .env files to ensure they are identical.');
        process.exit(1);
    }

    console.log('\n✅ Configuration is VALID. Client IDs match.');
}

validate();
