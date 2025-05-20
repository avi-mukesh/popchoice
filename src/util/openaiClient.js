import OpenAI from 'openai'
import { supabase } from './supabaseClient';
export const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});
 

export const createEmbedding = async (text) => {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
    })
    return response.data[0].embedding;
}

export const findNearestMatches = async (embedding) => {
    const {data} = await supabase.rpc('match_movie_data', {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 3
    });
    return data.map(obj => obj.content).join('\n');
}