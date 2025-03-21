import React from 'react';

interface Props
  extends Omit<React.ComponentPropsWithoutRef<'svg'>, 'xmlns' | 'viewBox' | 'className'> {
  colored?: boolean;
}

// From the Patreon branding page
const Icon = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 96" className="icon" {...props}>
    <g fillRule="evenodd">
      <path
        fill={props.colored ? '#ffffff' : undefined}
        d="M64.1102,0.1004 C44.259,0.1004 28.1086,16.2486 28.1086,36.0986 C28.1086,55.8884 44.259,71.989 64.1102,71.989 C83.9,71.989 100,55.8884 100,36.0986 C100,16.2486 83.9,0.1004 64.1102,0.1004"
      />
      <polygon
        fill={props.colored ? '#F96854' : undefined}
        points=".012 95.988 17.59 95.988 17.59 .1 .012 .1"
      />
    </g>
  </svg>
);

export default Icon;
