#!/usr/bin/env node

/**
 * Quick verification script to check if environment variables are properly configured
 * Run this after restarting the dev server to verify the fix
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ACAD-Assist Frontend Configuration Verification\n');

// Check .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

console.log('📋 Environment Variables Status:\n');

// Check critical variables
const requiredVars = [
  'VITE_API_BASE_URL',
  'VITE_PROXY_API_TARGET',
  'VITE_AI_SERVICE_URL',
  'VITE_RAG_SERVICE_URL'
];

let allGood = true;

requiredVars.forEach(varName => {
  const line = envLines.find(l => l.startsWith(varName + '='));
  if (line) {
    const value = line.split('=')[1];
    const isLocalhost = value.includes('localhost');
    const isWeb = value.includes('web:');
    
    console.log(`${varName}=${value}`);
    
    if (varName === 'VITE_PROXY_API_TARGET' && isWeb) {
      console.log('  ⚠️  WARNING: Using web:8000 - this only works in Docker!\n');
      allGood = false;
    } else if (varName === 'VITE_PROXY_API_TARGET' && isLocalhost) {
      console.log('  ✅ Correct for local development\n');
    } else if (isLocalhost) {
      console.log('  ✅ OK\n');
    }
  } else {
    console.log(`${varName}=NOT SET`);
    console.log('  ❌ Missing!\n');
    allGood = false;
  }
});

// Check vite.config.js
const viteConfigPath = path.join(__dirname, 'vite.config.js');
const viteContent = fs.readFileSync(viteConfigPath, 'utf8');

console.log('\n📝 Vite Configuration Check:\n');

if (viteContent.includes('loadEnv')) {
  console.log('✅ vite.config.js uses loadEnv() - GOOD');
} else {
  console.log('❌ vite.config.js does NOT use loadEnv() - NEEDS FIX');
  allGood = false;
}

if (viteContent.includes('process.env.VITE_PROXY_API_TARGET || process.env.VITE_API_BASE_URL')) {
  console.log('❌ vite.config.js still uses process.env - OLD VERSION');
  allGood = false;
}

// Check env.js
const envJsPath = path.join(__dirname, 'src/config/env.js');
const envJsContent = fs.readFileSync(envJsPath, 'utf8');

console.log('\n📝 Environment Configuration Check:\n');

if (envJsContent.includes('http://localhost:8000')) {
  console.log('✅ env.js has proper localhost default');
} else if (envJsContent.includes('normalizedApiBaseUrl || "/"')) {
  console.log('❌ env.js defaults to "/" - OLD VERSION');
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ Configuration looks GOOD! Restart dev server and test.');
} else {
  console.log('❌ Configuration needs attention. See warnings above.');
}
console.log('='.repeat(50) + '\n');

process.exit(allGood ? 0 : 1);
