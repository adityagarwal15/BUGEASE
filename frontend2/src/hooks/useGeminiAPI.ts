
import { useState, useCallback } from 'react';
import { API_BASE_URL } from '@/config';
import { useToast } from '@/components/ui/use-toast';

export const useGeminiAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateResponse = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // For demo purposes, return a friendly message for non-authenticated users
        setIsLoading(false);
        return "Please log in to use the full chatbot features. I can still provide general information about campus buggies.";
      }
      
      const response = await fetch(`${API_BASE_URL}/chatbot/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error generating response:', error);
      
      toast({
        title: "Communication Error",
        description: "Failed to reach the AI assistant. Please try again later.",
        variant: "destructive"
      });
      
      return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { generateResponse, isLoading };
};
