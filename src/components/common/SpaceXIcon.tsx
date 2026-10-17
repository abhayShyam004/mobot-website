import React from 'react';

interface SpaceXIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const SpaceXIcon: React.FC<SpaceXIconProps> = ({
  className = 'h-auto w-[51px]',
  width = 63,
  height = 24
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="40 0 2176 831"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M352 522 57 305H308L490 436Q417 478 352 522ZM766 831 545 668Q619 612 670 576L1018 831ZM294 831H40L70 803Q208 668 450.5 506.5Q693 345 1145.5 190Q1598 35 2216 0Q1995 19 1684.5 88.5Q1374 158 989 339Q604 520 294 831Z" />
    </svg>
  );
};
