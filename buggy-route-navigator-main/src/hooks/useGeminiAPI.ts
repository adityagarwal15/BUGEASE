
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { API_BASE_URL } from '@/config';

export const useGeminiAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const generateResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/chat/gemini/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        },
        body: JSON.stringify({
          message: userMessage
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setIsLoading(false);
      return data.response;
      
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      setIsLoading(false);
      
      toast({
        title: "AI Error",
        description: "Failed to generate response. Using fallback responses.",
        variant: "destructive"
      });
      
      // Return a fallback response when API fails
      return generateFallbackResponse(userMessage);
    }
  };
  
  const generateFallbackResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    // Simple fallback responses
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! How can I help you with campus buggies today?";
    }
    
    if (message.includes('book') || message.includes('ride')) {
      return "You can book a ride by clicking the 'Book a Ride' button in the main navigation.";
    }
    
    if (message.includes('buggy') || message.includes('location')) {
      return "You can check the current locations of buggies on the tracking map page.";
    }
    
    if (message.includes('history') || message.includes('past')) {
      return "Your ride history can be viewed in the 'Ride History' section.";
    }
    
    // Default fallback
    return "I'm having trouble connecting to my AI system right now. Could you try asking something about our campus buggies, booking a ride, or checking the buggy status?";
  };
  
  return {
    generateResponse,
    isLoading
  };
};
