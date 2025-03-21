import React from 'react';

type Props = Omit<React.ComponentPropsWithoutRef<'svg'>, 'xmlns' | 'viewBox' | 'className'>;

// https://thenounproject.com/search/?q=people&i=1458757
// people by Manohara from the Noun Project
const Icon = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="icon" {...props}>
    <path d="M47.7,36.5A14.5,14.5,0,1,0,33.2,51,14.5,14.5,0,0,0,47.7,36.5Zm-24.9,0A10.5,10.5,0,1,1,33.2,47,10.5,10.5,0,0,1,22.7,36.5Z" />
    <path d="M90.4,68A20.5,20.5,0,0,0,69.9,47.5H63.7a20.4,20.4,0,0,0-17.3,9.6,20.3,20.3,0,0,0-10-2.6H30.1A20.5,20.5,0,0,0,9.6,75v10H56.8V78H90.4ZM52.8,80.9H13.6V75A16.5,16.5,0,0,1,30.1,58.5h6.3A16.5,16.5,0,0,1,52.8,75ZM86.4,74H56.8a20.4,20.4,0,0,0-7.2-14.6,16.4,16.4,0,0,1,14-7.9h6.3A16.5,16.5,0,0,1,86.4,68Z" />
    <path d="M81.3,29.5A14.5,14.5,0,1,0,66.8,44,14.5,14.5,0,0,0,81.3,29.5Zm-24.9,0A10.5,10.5,0,1,1,66.8,40,10.5,10.5,0,0,1,56.3,29.5Z" />
  </svg>
);

export default Icon;
