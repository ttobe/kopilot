import axios from 'axios';

export async function axiosPost(
  url: string,
  data: any,
  headers: any,
): Promise<any> {
  try {
    return await axios.post(url, data, { headers: headers });
  } catch (err) {
    console.error(err);
    throw new Error(`[axios] Failed to request '${url}'`);
  }
}

export async function fetchPost(
  url: string,
  data: any,
  headers: any,
): Promise<any> {
  try {
    return await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error(err);
    throw new Error(`[fetch] Failed to request '${url}'`);
  }
}
