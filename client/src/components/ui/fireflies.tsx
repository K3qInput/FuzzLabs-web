import { useEffect, useState } from 'react';

const Fireflies = () => {
  const [fireflies, setFireflies] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const createFireflies = () => {
      const newFireflies = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6
      }));
      setFireflies(newFireflies);
    };

    createFireflies();
  }, []);

  return (
    <div className="firefly-container">
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="firefly"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            animationDelay: `${firefly.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Fireflies;