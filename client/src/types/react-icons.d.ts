/**
 * React Icons Type Fix
 * Type declarations to fix react-icons compatibility with React 19
 */

declare module 'react-icons/fi' {
  import { ComponentType, SVGProps } from 'react';
  export type IconType = ComponentType<SVGProps<SVGSVGElement>>;
  export const FiSearch: IconType;
  export const FiX: IconType;
  export const FiCpu: IconType;
  export const FiDatabase: IconType;
  export const FiCheckCircle: IconType;
  export const FiAlertCircle: IconType;
  export const FiActivity: IconType;
  export const FiHeart: IconType;
  export const FiTrendingUp: IconType;
  export const FiZap: IconType;
  export const FiUser: IconType;
  export const FiAlertTriangle: IconType;
  export const FiInfo: IconType;
  export const FiCopy: IconType;
  export const FiCheck: IconType;
  export const FiRefreshCw: IconType;
  export const FiDownload: IconType;
  export const FiArrowUp: IconType;
  export const FiArrowDown: IconType;
  export const FiInbox: IconType;
  export const FiSun: IconType;
  export const FiMoon: IconType;
  export const FiGithub: IconType;
}

declare module 'react-icons/bi' {
  import { ComponentType, SVGProps } from 'react';
  export type IconType = ComponentType<SVGProps<SVGSVGElement>>;
  export const BiLeaf: IconType;
}

declare module 'react-icons' {
  import { ComponentType, SVGProps } from 'react';
  export type IconType = ComponentType<SVGProps<SVGSVGElement>>;
}
