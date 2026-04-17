#!/usr/bin/env node

/**
 * Validation script to verify DNS fix is working
 * Run this AFTER restarting Vite dev server
 * It checks that environment variables are properly configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔍 ACAD-Assist DNS Resolution Fix Validation\n');

const checks = [];

// Check 1: .env file contains correct values
console.log('Check 1: Environment Configuration');
const envPath = 'd:\\ACAD-Assist\\.env';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasLocalhost = envContent.includes('VITE_PROXY_API_TARGET=http://localhost:8000');
  const hasNoWeb = !envContent.includes('VITE_PROXY_API_TARGET=http://web:8000');
  
  if (hasLocalhost && hasNoWeb) {
    console.log('  ✅ .env correctly set to localhost:8000');
    checks.push(true);
  } else {
    console.log('  ❌ .env not properly configured');
    checks.push(false);
  }
} else {
  console.log('  ❌ .env file not found');
  checks.push(false);
}

// Check 2: vite.config.js uses loadEnv
console.log('\nCheck 2: Vite Configuration');
const viteConfigPath = 'd:\\ACAD-Assist\\frontend\\vite.config.js';
if (fs.existsSync(viteConfigPath)) {
  const viteContent = fs.readFileSync(viteConfigPath, 'utf8');
  const usesLoadEnv = viteContent.includes('loadEnv');
  const hasProxyConfig = viteContent.includes('"/api"');
  
  if (usesLoadEnv && hasProxyConfig) {
    console.log('  ✅ vite.config.js properly configured');
    checks.push(true);
  } else {
    console.log('  ❌ vite.config.js missing loadEnv or proxy');
    checks.push(false);
  }
} else {
  console.log('  ❌ vite.config.js not found');
  checks.push(false);
}

// Check 3: env.js has localhost defaults
console.log('\nCheck 3: Environment Defaults');
const envJsPath = 'd:\\ACAD-Assist\\frontend\\src\\config\\env.js';
if (fs.existsSync(envJsPath)) {
  const envJsContent = fs.readFileSync(envJsPath, 'utf8');
  const hasDefault = envJsContent.includes('http://localhost:8000');
  
  if (hasDefault) {
    console.log('  ✅ env.js has localhost:8000 defaults');
    checks.push(true);
  } else {
    console.log('  ❌ env.js missing localhost default');
    checks.push(false);
  }
} else {
  console.log('  ❌ env.js not found');
  checks.push(false);
}

// Check 4: axios.js has proper export
console.log('\nCheck 4: HTTP Client Setup');
const axiosPath = 'd:\\ACAD-Assist\\frontend\\src\\shared\\lib\\http\\axios.js';
if (fs.existsSync(axiosPath)) {
  const axiosContent = fs.readFileSync(axiosPath, 'utf8');
  const exportsApiClient = axiosContent.includes('export const apiClient');
  const hasDebugLog = axiosContent.includes('console.debug');
  
  if (exportsApiClient && hasDebugLog) {
    console.log('  ✅ axios.js properly exports apiClient with debug logging');
    checks.push(true);
  } else {
    console.log('  ❌ axios.js missing export or debug logging');
    checks.push(false);
  }
} else {
  console.log('  ❌ axios.js not found');
  checks.push(false);
}

// Summary
console.log('\n' + '='.repeat(50));
const passed = checks.filter(c => c).length;
const total = checks.length;

if (passed === total) {
  console.log(`✅ All checks passed (${passed}/${total})`);
  console.log('\nDNS fix is properly configured!');
  console.log('Restart Vite: npm run dev');
  console.log('Then test creating a note in the browser.');
} else {
  console.log(`❌ ${total - passed} check(s) failed (${passed}/${total} passed)`);
  console.log('\nSome configuration issues detected. Review the failures above.');
}
console.log('='.repeat(50) + '\n');

process.exit(passed === total ? 0 : 1);
