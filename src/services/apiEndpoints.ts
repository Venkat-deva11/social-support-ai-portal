
export const JSONPLACEHOLDER_API = {
  baseURL: 'https://jsonplaceholder.typicode.com',
  endpoints: {
    posts: '/posts',
    users: '/users',
  },
} as const;

/**
 * OpenAI API Configuration
 */
export const OPENAI_API = {
  baseURL: 'https://api.openai.com/v1',
  endpoints: {
    chatCompletions: '/chat/completions',
  },
  defaultModel: 'gpt-3.5-turbo',
  config: {
    temperature: 0.3,
    maxTokens: 200,
  },
} as const;

export default {
  JSONPLACEHOLDER_API,
  OPENAI_API,
};
