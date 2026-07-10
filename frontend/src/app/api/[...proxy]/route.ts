const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api';

export async function GET(request: Request, { params }: { params: { proxy: string[] } }) {
  const path = params.proxy.join('/');
  const response = await fetch(`${BACKEND_URL}/${path}`, {
    headers: request.headers,
  });
  return response;
}

export async function POST(request: Request, { params }: { params: { proxy: string[] } }) {
  const path = params.proxy.join('/');
  const body = await request.text();
  const response = await fetch(`${BACKEND_URL}/${path}`, {
    method: 'POST',
    headers: request.headers,
    body,
  });
  return response;
}

export async function PUT(request: Request, { params }: { params: { proxy: string[] } }) {
  const path = params.proxy.join('/');
  const body = await request.text();
  const response = await fetch(`${BACKEND_URL}/${path}`, {
    method: 'PUT',
    headers: request.headers,
    body,
  });
  return response;
}

export async function DELETE(request: Request, { params }: { params: { proxy: string[] } }) {
  const path = params.proxy.join('/');
  const response = await fetch(`${BACKEND_URL}/${path}`, {
    method: 'DELETE',
    headers: request.headers,
  });
  return response;
}
