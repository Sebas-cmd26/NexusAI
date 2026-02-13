import dotenv from 'dotenv';
dotenv.config();

export const fetchAINews = async (sector = null) => {
  try {
    const keywords = [
      'artificial intelligence',
      'machine learning',
      'ChatGPT',
      'OpenAI',
      'Claude',
      'Gemini',
      'LLM',
      'deep learning'
    ];

    const query = keywords.join(' OR ');
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${process.env.NEWS_API_KEY}`;

    console.log('Fetching from:', url);
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'ok') {
      console.error('NewsAPI error:', data);
      return [];
    }

    // Transformar y eliminar duplicados
    const articlesMap = new Map();
    
    data.articles
      .filter(article => 
        article.title && 
        article.description && 
        article.url &&
        article.title !== '[Removed]' &&
        article.urlToImage
      )
      .forEach(article => {
        const id = generateId(article.url);
        
        // Solo agregar si no existe (elimina duplicados)
        if (!articlesMap.has(id)) {
          articlesMap.set(id, {
            id,
            title: article.title,
            summary: article.description,
            content: article.content || article.description,
            source_url: article.url,
            image_url: article.urlToImage,
            published_at: article.publishedAt,
            sector: categorizeSector(article.title + ' ' + article.description),
            impact_level: categorizeImpact(article.title + ' ' + article.description),
            source_name: article.source.name,
            author: article.author || 'Unknown'
          });
        }
      });

    const articles = Array.from(articlesMap.values());
    
    console.log(`Fetched ${articles.length} unique articles from NewsAPI`);
    return articles;

  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
};

// Función para generar ID único
function generateId(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `news_${Math.abs(hash)}`;
}

// Categorizar por sector
function categorizeSector(text) {
  const lowerText = text.toLowerCase();
  
  if (/(chip|gpu|hardware|semiconductor|nvidia|computing|processor)/i.test(lowerText)) {
    return 'Engineering';
  }
  if (/(health|medical|diagnosis|patient|healthcare|radiology|disease)/i.test(lowerText)) {
    return 'Health';
  }
  if (/(finance|trading|bank|crypto|stock|market|investment)/i.test(lowerText)) {
    return 'Finance';
  }
  if (/(education|learning|school|university|student|teacher)/i.test(lowerText)) {
    return 'Education';
  }
  if (/(law|legal|regulation|policy|government|court)/i.test(lowerText)) {
    return 'Legal';
  }
  
  return 'General';
}

// Categorizar impacto
function categorizeImpact(text) {
  const lowerText = text.toLowerCase();
  
  const highImpactKeywords = [
    'breakthrough', 'revolutionary', 'major', 'significant',
    'unprecedented', 'landmark', 'game-changing', 'critical'
  ];
  
  const mediumImpactKeywords = [
    'important', 'notable', 'announces', 'launches',
    'introduces', 'updates', 'improves'
  ];

  if (highImpactKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'High';
  }
  
  if (mediumImpactKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'Medium';
  }
  
  return 'Low';
}
