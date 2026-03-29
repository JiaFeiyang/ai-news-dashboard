import { useState, useEffect } from 'react';
import { fetchAgentUpdates } from '../services/api';

const useAgentUpdates = () => {
  const [agentUpdates, setAgentUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAgentUpdates = async () => {
      setLoading(true);
      try {
        const data = await fetchAgentUpdates();
        setAgentUpdates(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching agent updates:', err);
      } finally {
        setLoading(false);
      }
    };

    getAgentUpdates();
  }, []);

  const refreshAgentUpdates = async () => {
    setLoading(true);
    try {
      const data = await fetchAgentUpdates();
      setAgentUpdates(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error refreshing agent updates:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    agentUpdates,
    loading,
    error,
    refreshAgentUpdates
  };
};

export default useAgentUpdates;