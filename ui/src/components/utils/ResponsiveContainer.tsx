import React from 'react';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '', 
  style = {} 
}) => {
  const screens = useBreakpoint();

  const getResponsiveStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      ...style,
    };

    if (screens.xs) {
      return {
        ...baseStyle,
        padding: '8px',
      };
    }

    if (screens.sm) {
      return {
        ...baseStyle,
        padding: '16px',
      };
    }

    if (screens.md) {
      return {
        ...baseStyle,
        padding: '24px',
      };
    }

    return {
      ...baseStyle,
      padding: '32px',
    };
  };

  return (
    <div 
      className={`responsive-container ${className}`}
      style={getResponsiveStyle()}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
