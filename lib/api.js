const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://stnp.co.id/wp-json/wp/v2';

async function fetchAPI(endpoint, params = {}) {
  const url = new URL(`${API_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url.toString(), { 
    next: { revalidate: 3600 },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) {
    console.error(`WP API Error: ${res.status} for ${url.toString()}`);
    return null;
  }

  // Check if we actually got JSON (Cloudflare might return 200 OK with an HTML verification page)
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error(`WP API Error: Expected JSON but received ${contentType} for ${url.toString()}. Likely blocked by Cloudflare/WAF.`);
    return null;
  }

  try {
    const data = await res.json();
    const totalPages = res.headers.get('X-WP-TotalPages');
    const total = res.headers.get('X-WP-Total');
    return { data, totalPages: parseInt(totalPages || '1'), total: parseInt(total || '0') };
  } catch (error) {
    console.error(`WP API Parse Error: ${error.message} for ${url.toString()}`);
    return null;
  }
}

export async function getPosts({ page = 1, perPage = 10, category, search } = {}) {
  const params = {
    page,
    per_page: perPage,
    _embed: '',
  };
  if (category) params.categories = category;
  if (search) params.search = search;

  const result = await fetchAPI('/posts', params);
  return result || { data: [], totalPages: 1, total: 0 };
}

export async function getPostBySlug(slug) {
  const result = await fetchAPI('/posts', { slug, _embed: '' });
  if (!result || !result.data || result.data.length === 0) return null;
  return result.data[0];
}

export async function getCategories() {
  const result = await fetchAPI('/categories', { per_page: 100 });
  return result ? result.data : [];
}

export async function getMedia(id) {
  if (!id) return null;
  const result = await fetchAPI(`/media/${id}`);
  return result ? result.data : null;
}
