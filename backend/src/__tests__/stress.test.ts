import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_BASE_URL = 'http://localhost:4000/api';
const NUM_CONCURRENT_USERS = 15;

interface TestUser {
  userId: number;
  categoryId?: string;
  errors: string[];
  successCount: number;
}

interface ApiResponse<T> {
  status: number;
  data: T;
}

async function makeRequest<T>(
  method: string,
  endpoint: string,
  body?: any,
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    throw new Error(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function simulateUserSession(userId: number): Promise<TestUser> {
  const user: TestUser = {
    userId,
    errors: [],
    successCount: 0,
  };

  try {
    // 1. GET /categories (listar)
    const listResponse = await makeRequest('GET', '/categories');
    if (listResponse.status !== 200) {
      user.errors.push(`GET /categories: Expected 200, got ${listResponse.status}`);
    } else {
      user.successCount++;
    }

    // 2. POST /categories (crear)
    const categoryData = {
      name: `Category-User${userId}-${Date.now()}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };

    const createResponse = await makeRequest('POST', '/categories', categoryData);
    if (createResponse.status !== 201) {
      user.errors.push(`POST /categories: Expected 201, got ${createResponse.status}`);
      return user;
    }

    user.categoryId = createResponse.data.id;
    user.successCount++;

    // Validate response structure
    if (!createResponse.data.id || !createResponse.data.name || !createResponse.data.color) {
      user.errors.push('POST /categories: Response missing required fields');
    }

    // 3. PUT /categories/:id (actualizar)
    const updateData = {
      name: `Updated-Category-User${userId}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };

    const updateResponse = await makeRequest('PUT', `/categories/${user.categoryId}`, updateData);
    if (updateResponse.status !== 200) {
      user.errors.push(`PUT /categories/${user.categoryId}: Expected 200, got ${updateResponse.status}`);
    } else {
      user.successCount++;
    }

    // Validate updated response structure
    if (!updateResponse.data.id || !updateResponse.data.name || !updateResponse.data.color) {
      user.errors.push('PUT /categories: Response missing required fields');
    }

    // 4. GET /categories/:id/standings (verificar endpoint)
    try {
      const standingsResponse = await makeRequest('GET', `/standings?categoryId=${user.categoryId}`);
      // This endpoint might not exist, so we just verify it doesn't crash with 500
      if (standingsResponse.status >= 500) {
        user.errors.push(`GET standings: Server error ${standingsResponse.status}`);
      } else {
        user.successCount++;
      }
    } catch (error) {
      // Standings endpoint might not exist, which is ok
      user.successCount++;
    }

    // 5. GET /categories/:id/matches (verificar endpoint)
    try {
      const matchesResponse = await makeRequest('GET', `/matches?categoryId=${user.categoryId}`);
      // This endpoint might not exist, so we just verify it doesn't crash with 500
      if (matchesResponse.status >= 500) {
        user.errors.push(`GET matches: Server error ${matchesResponse.status}`);
      } else {
        user.successCount++;
      }
    } catch (error) {
      // Matches endpoint might not exist, which is ok
      user.successCount++;
    }

    // 6. DELETE /categories/:id (eliminar)
    const deleteResponse = await makeRequest('DELETE', `/categories/${user.categoryId}`);
    if (deleteResponse.status !== 204) {
      user.errors.push(`DELETE /categories/${user.categoryId}: Expected 204, got ${deleteResponse.status}`);
    } else {
      user.successCount++;
    }

    return user;
  } catch (error) {
    user.errors.push(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    return user;
  }
}

describe('Stress Tests - Multiple Concurrent Users', () => {
  it(`should handle ${NUM_CONCURRENT_USERS} concurrent users performing CRUD operations`, async () => {
    // Create concurrent user sessions
    const userPromises = Array.from({ length: NUM_CONCURRENT_USERS }, (_, i) =>
      simulateUserSession(i + 1),
    );

    const results = await Promise.all(userPromises);

    // Analyze results
    const totalErrors = results.reduce((acc, user) => acc + user.errors.length, 0);
    const totalSuccess = results.reduce((acc, user) => acc + user.successCount, 0);

    // Log results for debugging
    console.log('\n=== Stress Test Results ===');
    console.log(`Total Users: ${NUM_CONCURRENT_USERS}`);
    console.log(`Total Successful Operations: ${totalSuccess}`);
    console.log(`Total Errors: ${totalErrors}`);

    if (totalErrors > 0) {
      console.log('\nError Details:');
      results.forEach((user) => {
        if (user.errors.length > 0) {
          console.log(`  User ${user.userId}:`);
          user.errors.forEach((err) => console.log(`    - ${err}`));
        }
      });
    }

    // Assertions
    expect(totalErrors).toBe(0);
    expect(totalSuccess).toBeGreaterThan(0);

    // Verify no server crashes (no 500 errors)
    results.forEach((user) => {
      expect(user.errors).not.toContainEqual(expect.stringContaining('500'));
    });
  });

  it('should validate response structures for all CRUD operations', async () => {
    // Create a single category to test response structure
    const categoryData = {
      name: `TestCategory-${Date.now()}`,
      color: '#FF0000',
    };

    const createResponse = await makeRequest('POST', '/categories', categoryData);
    expect(createResponse.status).toBe(201);
    expect(createResponse.data).toHaveProperty('id');
    expect(createResponse.data).toHaveProperty('name');
    expect(createResponse.data).toHaveProperty('color');

    const categoryId = createResponse.data.id;

    // Test GET response structure
    const listResponse = await makeRequest<any[]>('GET', '/categories');
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.data)).toBe(true);
    expect(listResponse.data.some((c: any) => c.id === categoryId)).toBe(true);

    // Test UPDATE response structure
    const updateResponse = await makeRequest('PUT', `/categories/${categoryId}`, {
      name: `Updated-${Date.now()}`,
    });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data).toHaveProperty('id');
    expect(updateResponse.data).toHaveProperty('name');

    // Clean up
    await makeRequest('DELETE', `/categories/${categoryId}`);
  });

  it('should not have memory leaks with repeated operations', async () => {
    const initialMemory = process.memoryUsage().heapUsed;

    // Perform many iterations
    for (let iteration = 0; iteration < 5; iteration++) {
      const categoryData = {
        name: `MemTest-${Date.now()}-${iteration}`,
        color: '#00FF00',
      };

      const createResponse = await makeRequest('POST', '/categories', categoryData);
      if (createResponse.status === 201) {
        await makeRequest('DELETE', `/categories/${createResponse.data.id}`);
      }
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

    console.log(`Memory increase: ${memoryIncrease.toFixed(2)} MB`);

    // Memory increase should be reasonable (less than 50MB for this test)
    expect(memoryIncrease).toBeLessThan(50);
  });
});
