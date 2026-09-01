import React from 'react';
import { HttpMethod } from '../../types/api';

interface MethodBadgeProps {
  method: HttpMethod;
  size?: 'sm' | 'md' | 'lg';
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method, size = 'sm' }) => {
  const methodUpper = method.toUpperCase() as HttpMethod;
  
  return (
    <span className={`method-badge method-${methodUpper.toLowerCase()} size-${size}`}>
      {methodUpper}
    </span>
  );
};
