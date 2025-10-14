const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export const searchImages = async (query, perPage = 8) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Unsplash API response:', data.results?.length || 0, 'images found');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
};

export const getRandomImage = async (query = 'event') => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching random image from Unsplash:', error);
    return null;
  }
};

export default {
  searchImages,
  getRandomImage
};