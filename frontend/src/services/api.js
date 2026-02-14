const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * API Service Layer
 * Centralizes all backend communication
 */
class APIService {
  /**
   * Fetch news feed with optional sector filter
   * @param {string} sector - Optional sector filter (e.g., "Tech", "Finance")
   * @returns {Promise<Array>} Array of news items
   */
  static async getFeed(sector = null) {
    try {
      // Ensure sector is treated correctly (null/undefined/General -> no param)
      const url = (sector && sector !== 'General' && sector !== 'null')
        ? `${API_BASE_URL}/feed?sector=${encodeURIComponent(sector)}`
        : `${API_BASE_URL}/feed`;
      
      console.log('Fetching feed from:', url); 
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching feed:', error);
      return [];
    }
  }

  /**
   * Perform semantic search using Pinecone
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of search results
   */
  static async search(query) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      const data = await response.json();
      return data.hits || [];
    } catch (error) {
      console.error('Error performing search:', error);
      return [];
    }
  }

  /**
   * Get all groups from Supabase
   * @returns {Promise<Array>} Array of groups
   */
  static async getGroups() {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`);
      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }

  // AI Summarization
  static async summarize(text) {
    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('Failed to summarize');
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Error summarizing:', error);
      throw error;
    }
  }

  // AI Chat
  static async chat(history, message, context = "") {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, message, context })
      });
      if (!response.ok) throw new Error('Failed to chat');
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw error;
    }
  }

  static async createGroup(groupData) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
      });
      if (!response.ok) throw new Error('Failed to create group');
      return await response.json();
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  static async shareToGroup(groupId, newsId, userId = 'User') {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: groupId, news_id: newsId, user_id: userId }),
      });
      if (!response.ok) {
        throw new Error(`Failed to share to group: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error sharing to group:', error);
      throw error;
    }
  }

  // Group Chat Methods
  static async getGroupMessages(groupId, limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/messages?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async sendMessage(groupId, userId, content, newsId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId, user_id: userId, content, news_id: newsId })
      });
      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

export default APIService;
