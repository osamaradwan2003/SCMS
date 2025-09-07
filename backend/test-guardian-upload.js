// Test script for Guardian creation with file uploads
// This is a simple test to verify the file upload functionality works

const fs = require('fs');
const path = require('path');

// Create test directory structure
const testDir = path.join(__dirname, 'test-uploads');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

// Create sample test files
const profilePhotoContent = 'fake-image-data-for-profile-photo';
const documentsContent = 'fake-document-data-for-guardian-docs';

const profilePhotoPath = path.join(testDir, 'test-profile.jpg');
const documentsPath = path.join(testDir, 'test-document.pdf');

fs.writeFileSync(profilePhotoPath, profilePhotoContent);
fs.writeFileSync(documentsPath, documentsContent);

console.log('Test files created:');
console.log('- Profile photo:', profilePhotoPath);
console.log('- Documents:', documentsPath);

console.log('\nTo test Guardian creation with file uploads, use the following curl command:');
console.log(`
curl -X POST http://localhost:3000/api/guardians \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -F "name=John Doe" \\
  -F "phone=+1234567890" \\
  -F "relationship=Father" \\
  -F "profile_photo=@${profilePhotoPath}" \\
  -F "documents=@${documentsPath}"
`);

console.log('\nTo test file upload to existing guardian:');
console.log(`
curl -X POST http://localhost:3000/api/guardians/GUARDIAN_ID/upload \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -F "profile_photo=@${profilePhotoPath}" \\
  -F "documents=@${documentsPath}"
`);

console.log('\nTest files will be uploaded to the uploads/ directory organized by file extension.');
