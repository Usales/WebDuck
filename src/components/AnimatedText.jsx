import { useState, useEffect } from 'react';

const AnimatedText = ({ text = 'ATIVO', speed = 60, className = '' }) => {
  const [displayText, setDisplayText] = useState('ABCDE');
  const [targetText] = useState(text.padEnd(5, ' ').substring(0, 5).toUpperCase());

  useEffect(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let iteration = 0;
    const maxIterations = 20;

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        setDisplayText(targetText);
        // Reiniciar a animação
        iteration = 0;
      } else {
        iteration += 0.5;
      }
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, speed]);

  return (
    <span 
      className={className} 
      style={{ 
        fontFamily: 'monospace', 
        letterSpacing: '3px',
        fontWeight: 'bold',
        fontSize: '0.75rem'
      }}
    >
      {displayText}
    </span>
  );
};

export default AnimatedText;

