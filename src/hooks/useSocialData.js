import { useState, useEffect } from 'react';
import { fetchSocialFeeds } from '../services/api';

const useSocialData = () => {
  const [socialPosts, setSocialPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSocialFeeds = async () => {
      setLoading(true);
      try {
        const data = await fetchSocialFeeds();
        setSocialPosts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching social feeds:', err);
      } finally {
        setLoading(false);
      }
    };

    getSocialFeeds();
  }, []);

  const refreshSocialFeeds = async () => {
    setLoading(true);
    try {
      const data = await fetchSocialFeeds();
      setSocialPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error refreshing social feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    socialPosts,
    loading,
    error,
    refreshSocialFeeds
  };
};

export default useSocialData;