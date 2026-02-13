import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const saveNewsToSupabase = async (articles) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .upsert(articles, { onConflict: 'id', ignoreDuplicates: false });
    
    if (error) throw error;
    
    console.log(`Saved ${articles.length} articles to Supabase.`);
    return data;
  } catch (error) {
    console.error('Error saving news:', error);
    return null;
  }
};

export const getNewsFromSupabase = async (sector = null, limit = 50) => {
  try {
    let query = supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (sector && sector !== 'General') {
      query = query.eq('sector', sector);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    console.log(`Fetched ${data?.length || 0} articles from Supabase`);
    return data || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const searchNewsInSupabase = async (queryText) => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .or(`title.ilike.%${queryText}%,summary.ilike.%${queryText}%,content.ilike.%${queryText}%`)
      .limit(20);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
};

export const getGroups = async () => {
  const { data, error } = await supabase.from('groups').select('*');
  if (error) throw error;
  return data || [];
};

export const createGroup = async (groupData) => {
  const { data, error } = await supabase.from('groups').insert([groupData]).select();
  if (error) throw error;
  return data;
};

export const getGroupMessages = async (groupId, limit = 50) => {
  const { data, error } = await supabase
    .from('group_messages')
    .select('*, news_articles(*)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
};

export const sendMessage = async (messageData) => {
  const { data, error } = await supabase.from('group_messages').insert([messageData]).select();
  if (error) throw error;
  return data;
};

export const shareArticleToGroup = async (groupId, newsId, userId) => {
  const { data, error } = await supabase.from('group_messages').insert([{
    group_id: groupId,
    user_id: userId,
    content: "Shared an article",
    news_id: newsId
  }]).select();
  
  if (error) throw error;
  return data;
};
