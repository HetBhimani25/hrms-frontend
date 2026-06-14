import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const TopLoader = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    
    // Add request interceptor
    const reqInterceptor = api.interceptors.request.use((config) => {
      setVisible(true);
      setProgress(30);
      timer = setInterval(() => {
        setProgress((old) => {
          if (old > 85) {
            clearInterval(timer);
            return 90;
          }
          return old + Math.random() * 10;
        });
      }, 200);
      return config;
    });

    // Add response interceptor
    const resInterceptor = api.interceptors.response.use(
      (response) => {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => setProgress(0), 300);
        }, 300);
        return response;
      },
      (error) => {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => setProgress(0), 300);
        }, 300);
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
      clearInterval(timer);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '3px', 
        zIndex: 9999999,
        pointerEvents: 'none'
      }}
    >
      <div 
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #3b82f6, #ec4899)',
          width: `${progress}%`,
          transition: 'width 0.2s ease, opacity 0.3s ease',
          opacity: visible ? 1 : 0,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
        }}
      />
    </div>
  );
};

export default TopLoader;
