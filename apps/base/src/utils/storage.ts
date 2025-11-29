// Upload utilities for IPFS storage

export async function uploadJson(data: any): Promise<string> {
  try {
    const response = await fetch('/api/uploadJson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload JSON: ${response.statusText}`);
    }

    const result = await response.json();
    return result.cid;
  } catch (error) {
    console.error('Error uploading JSON:', error);
    throw error;
  }
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const result = await response.json();
    return result.cid;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}