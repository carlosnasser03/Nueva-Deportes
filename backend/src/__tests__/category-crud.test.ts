import { describe, it, expect } from 'vitest';

declare global {
  var TEST_API_URL: string;
}

// Get API URL from global or use default
const getApiUrl = () => global.TEST_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
  status: number;
  headers: Headers;
  data: T;
}

async function makeRequest<T>(
  method: string,
  endpoint: string,
  body?: any,
): Promise<ApiResponse<T>> {
  const url = `${getApiUrl()}${endpoint}`;

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
    const data = method === 'DELETE' && response.status === 204 ? null : await response.json();

    return {
      status: response.status,
      headers: response.headers,
      data,
    };
  } catch (error) {
    throw new Error(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

describe('Category CRUD Operations', () => {
  let createdCategoryId: string;

  it('should create a valid category with 201 status', async () => {
    const categoryData = {
      name: `Test Category ${Date.now()}`,
      color: '#FF5733',
    };

    const response = await makeRequest('POST', '/categories', categoryData);

    expect(response.status).toBe(201);
    expect(response.data).toBeDefined();
    expect(response.data.id).toBeDefined();
    expect(response.data.name).toBe(categoryData.name);
    expect(response.data.color).toBe(categoryData.color);

    // Store for later tests
    createdCategoryId = response.data.id;
  });

  it('should reject invalid category data with 400 status', async () => {
    // Missing name
    const response1 = await makeRequest('POST', '/categories', {
      color: '#FF5733',
    });
    expect(response1.status).toBe(400);

    // Missing color
    const response2 = await makeRequest('POST', '/categories', {
      name: 'Test Category',
    });
    expect(response2.status).toBe(400);

    // Empty strings
    const response3 = await makeRequest('POST', '/categories', {
      name: '',
      color: '',
    });
    expect(response3.status).toBe(400);
  });

  it('should update category with valid data and return 200 status', async () => {
    // First create a category
    const categoryData = {
      name: `Category to Update ${Date.now()}`,
      color: '#AABBCC',
    };

    const createResponse = await makeRequest('POST', '/categories', categoryData);
    const categoryId = createResponse.data.id;

    // Update it
    const updateData = {
      name: `Updated Category ${Date.now()}`,
      color: '#112233',
    };

    const updateResponse = await makeRequest('PUT', `/categories/${categoryId}`, updateData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.id).toBe(categoryId);
    expect(updateResponse.data.name).toBe(updateData.name);
    expect(updateResponse.data.color).toBe(updateData.color);

    // Clean up
    await makeRequest('DELETE', `/categories/${categoryId}`);
  });

  it('should reject invalid update data with 400 status', async () => {
    // Create a category first
    const categoryData = {
      name: `Category for Invalid Update ${Date.now()}`,
      color: '#DDEEFF',
    };

    const createResponse = await makeRequest('POST', '/categories', categoryData);
    const categoryId = createResponse.data.id;

    // Try to update with empty object (should fail because at least one field is required)
    const updateResponse = await makeRequest('PUT', `/categories/${categoryId}`, {});

    expect(updateResponse.status).toBe(400);

    // Clean up
    await makeRequest('DELETE', `/categories/${categoryId}`);
  });

  it('should list all categories and return 200 status', async () => {
    // Create a category first
    const categoryData = {
      name: `Category for List ${Date.now()}`,
      color: '#FF00FF',
    };

    const createResponse = await makeRequest('POST', '/categories', categoryData);
    const categoryId = createResponse.data.id;

    // List categories
    const listResponse = await makeRequest<any[]>('GET', '/categories');

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.data)).toBe(true);
    expect(listResponse.data.length).toBeGreaterThan(0);

    // Verify structure of response items
    listResponse.data.forEach((category: any) => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('color');
      expect(typeof category.id).toBe('string');
      expect(typeof category.name).toBe('string');
      expect(typeof category.color).toBe('string');
    });

    // Verify our created category is in the list
    const foundCategory = listResponse.data.find((c: any) => c.id === categoryId);
    expect(foundCategory).toBeDefined();
    expect(foundCategory.name).toBe(categoryData.name);

    // Clean up
    await makeRequest('DELETE', `/categories/${categoryId}`);
  });

  it('should delete a category and return 204 status', async () => {
    // Create a category
    const categoryData = {
      name: `Category to Delete ${Date.now()}`,
      color: '#00FF00',
    };

    const createResponse = await makeRequest('POST', '/categories', categoryData);
    const categoryId = createResponse.data.id;

    // Delete it
    const deleteResponse = await makeRequest('DELETE', `/categories/${categoryId}`);

    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.data).toBeNull();

    // Verify it's gone by trying to get it
    const listResponse = await makeRequest<any[]>('GET', '/categories');
    const foundCategory = listResponse.data.find((c: any) => c.id === categoryId);
    expect(foundCategory).toBeUndefined();
  });

  it('should return 404 when trying to delete non-existent category', async () => {
    const fakeId = 'non-existent-id-' + Date.now();

    const deleteResponse = await makeRequest('DELETE', `/categories/${fakeId}`);

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.data).toBeDefined();
    expect(deleteResponse.data.message).toBeDefined();
  });

  it('should validate response has correct structure for all operations', async () => {
    // Create
    const createPayload = {
      name: `Structure Test ${Date.now()}`,
      color: '#123456',
    };

    const createResponse = await makeRequest<any>('POST', '/categories', createPayload);
    expect(createResponse.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        color: expect.any(String),
      }),
    );

    const categoryId = createResponse.data.id;

    // Get (via list)
    const listResponse = await makeRequest<any[]>('GET', '/categories');
    const category = listResponse.data.find((c) => c.id === categoryId);
    expect(category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        color: expect.any(String),
      }),
    );

    // Update
    const updateResponse = await makeRequest<any>('PUT', `/categories/${categoryId}`, {
      name: `Updated ${Date.now()}`,
    });
    expect(updateResponse.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        color: expect.any(String),
      }),
    );

    // Clean up
    await makeRequest('DELETE', `/categories/${categoryId}`);
  });

  it('should handle concurrent operations safely', async () => {
    // Create multiple categories concurrently
    const categoryPromises = Array.from({ length: 5 }, (_, i) =>
      makeRequest('POST', '/categories', {
        name: `Concurrent Category ${i} ${Date.now()}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      }),
    );

    const results = await Promise.all(categoryPromises);

    // Verify all were created
    results.forEach((result) => {
      expect(result.status).toBe(201);
      expect(result.data.id).toBeDefined();
    });

    const createdIds = results.map((r) => r.data.id);

    // Verify all exist in list
    const listResponse = await makeRequest<any[]>('GET', '/categories');
    createdIds.forEach((id) => {
      expect(listResponse.data.some((c: any) => c.id === id)).toBe(true);
    });

    // Clean up
    const deletePromises = createdIds.map((id) => makeRequest('DELETE', `/categories/${id}`));
    await Promise.all(deletePromises);
  });
});
