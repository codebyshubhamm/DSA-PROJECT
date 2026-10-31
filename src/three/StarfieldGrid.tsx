import React from 'react';

export const StarfieldGrid: React.FC = () => {
  return (
    <group>
      {/* Warm architectural grid floor */}
      <gridHelper
        args={[30, 30, '#D8CBC0', '#EFE7DF']}
        position={[0, -4.5, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};
