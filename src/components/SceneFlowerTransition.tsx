import React from 'react';
import { FlowerGardenTransition } from './flower/FlowerGardenTransition';
import { SiteConfig } from '../types';

interface SceneFlowerTransitionProps {
  config: SiteConfig;
  onTransitionComplete: () => void;
}

export const SceneFlowerTransition: React.FC<SceneFlowerTransitionProps> = ({
  config,
  onTransitionComplete,
}) => {
  return (
    <FlowerGardenTransition config={config} onTransitionComplete={onTransitionComplete} />
  );
};
