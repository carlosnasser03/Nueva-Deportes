import { beforeAll, afterEach } from 'vitest';
import { startTestServer, resetDatabase, getServerPort } from './test-server';

let testPrisma: any;

// Global variable to store the API URL
declare global {
  var TEST_API_URL: string;
}

beforeAll(async () => {
  const result = await startTestServer();
  testPrisma = result.prisma;
  // Set the global API URL for tests
  global.TEST_API_URL = `http://localhost:${getServerPort()}/api`;
  // Reset database before running tests
  await resetDatabase(testPrisma);
});

afterEach(async () => {
  // Clean up after each test
  if (testPrisma) {
    await resetDatabase(testPrisma);
  }
});
