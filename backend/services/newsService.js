import dotenv from 'dotenv';
dotenv.config();

export const fetchAINews = async (sector = null) => {
  try {
    // Expanded AI-focused keywords to ensure only AI news
    const keywords = [
      'artificial intelligence',
      'machine learning',
      'ChatGPT',
      'OpenAI',
      'Claude',
      'Gemini',
      'LLM',
      'deep learning',
      'neural network',
      'AI model',
      'generative AI',
      'transformer',
      'GPT',
      'AI technology',
      'computer vision',
      'natural language processing',
      'NLP',
      'AI system',
      'AI algorithm',
      'AI research'
    ];

    const query = keywords.join(' OR ');
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${process.env.NEWS_API_KEY}`;

    console.log('Fetching AI-focused news from NewsAPI...');
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
        article.urlToImage &&
        // Additional AI validation filter
        isAIRelated(article.title + ' ' + article.description)
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
    
    console.log(`Fetched ${articles.length} unique AI-focused articles from NewsAPI`);
    return articles;

  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
};

// Validar que el artículo sea realmente sobre IA
function isAIRelated(text) {
  const lowerText = text.toLowerCase();
  const aiKeywords = [
    'ai', 'artificial intelligence', 'machine learning', 'ml',
    'deep learning', 'neural', 'chatgpt', 'gpt', 'llm',
    'openai', 'claude', 'gemini', 'transformer', 'generative',
    'computer vision', 'nlp', 'natural language'
  ];
  
  // El artículo debe contener al menos uno de estos keywords
  return aiKeywords.some(keyword => lowerText.includes(keyword));
}

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

// Categorizar por sector (enfocado en IA en cada sector)
function categorizeSector(text) {
  const lowerText = text.toLowerCase();
  
  // AI in Engineering/Tech
  if (/(chip|gpu|hardware|semiconductor|nvidia|computing|processor|tech|software|robot)/i.test(lowerText)) {
    return 'Engineering';
  }
  // AI in Health
  if (/(health|medical|diagnosis|patient|healthcare|radiology|disease|hospital|clinical)/i.test(lowerText)) {
    return 'Health';
  }
  // AI in Finance
  if (/(finance|trading|bank|crypto|stock|market|investment|fintech|payment)/i.test(lowerText)) {
    return 'Finance';
  }
  // AI in Education
  if (/(education|learning|school|university|student|teacher|training|course)/i.test(lowerText)) {
    return 'Education';
  }
  // AI in Legal/Government
  if (/(law|legal|regulation|policy|government|court|compliance|ethics)/i.test(lowerText)) {
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
