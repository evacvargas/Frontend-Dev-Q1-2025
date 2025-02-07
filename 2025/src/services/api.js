const BASE_URL = "https://5fb46367e473ab0016a1654d.mockapi.io/";

export async function fetchArticles() {
  try {
      const response = await fetch(`${BASE_URL}/articles`);
      
      if (!response.ok) {
          throw new Error("Error al obtener los artículos");
      }
      return await response.json();
  } catch (error) {
      console.error("Error en fetchArticles:", error);
      return [];
  }
}


export async function fetchArticleById(id) {
  try {
    const response = await fetch(`${BASE_URL}/articles/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener el artículo");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchArticleById(${id}):`, error);
    return null;
  }
}
export async function fetchAuthorById(id) {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`);

    if (!response.ok) {
      throw new Error("Error al obtener el author");
    }

    const authorData = await response.json();

    if (authorData.avatar) {
      authorData.avatar = authorData.avatar.replace("cloudflare-ipfs.com", "ipfs.io");
    }

    return authorData;

  } catch (error) {
    console.error(`Error en userId (${id}):`, error);
    return null;
  }
}

