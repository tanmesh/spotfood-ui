import React, { useState, useEffect } from 'react';

function About() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {isMobile ? (
        <p>This is a mobile view.</p>
      ) : (
        <p>This is a desktop view.</p>
      )}
    </div>
  );
}

export default About
