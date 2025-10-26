/**
 * Icon Wrapper
 * Wrapper pour corriger les problèmes de types avec React 19 et react-icons
 */

import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
  className?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, className }) => {
  return <Icon className={className} />;
};
