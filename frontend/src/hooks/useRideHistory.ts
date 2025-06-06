
import { useState, useEffect } from 'react';
import { useAuth } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { API_BASE_URL } from '@/config';

export interface RideHistory {
  id: number;
  buggy_number: string;
  pickup_location: string;
  dropoff_location: string;
  request_time: string;
  status: string;
}

export const useRideHistory = () => {
  const [history, setHistory] = useState<RideHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/user/ride-history/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ride history');
        }

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching ride history:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        toast({
          title: 'Error',
          description: 'Failed to load ride history',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, [getToken, toast]);

  return { history, loading, error };
};
