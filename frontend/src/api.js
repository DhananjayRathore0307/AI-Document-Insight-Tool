const API_URL = 'http://localhost:8000';

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload-resume`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function getInsights(id) {
  const res = await fetch(`${API_URL}/insights?id=${id}`);
  return res.json();
}
