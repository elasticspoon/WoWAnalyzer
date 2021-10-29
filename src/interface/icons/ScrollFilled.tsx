import React from 'react';

type Props = Omit<React.ComponentPropsWithoutRef<'svg'>, 'xmlns' | 'viewBox' | 'className'>;

// https://thenounproject.com/jngll2/uploads/?i=1219368
// Created by jngll from the Noun Project
const Icon = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="icon" {...props}>
    <path d="M80.64,10.87l-.52,0-.26,0H30.64A11.24,11.24,0,0,0,19.42,21.94s0,.05,0,.08V66.66h-.64a3,3,0,0,0-.63.07,11.23,11.23,0,0,0,0,22.33,3,3,0,0,0,.63.07h45.4A11.25,11.25,0,0,0,75.41,77.9V33.34h5.23a11.23,11.23,0,1,0,0-22.47Zm-66.52,67a5.24,5.24,0,0,1,5.23-5.23H54.24a11.17,11.17,0,0,0,0,10.47H19.36A5.24,5.24,0,0,1,14.12,77.9Zm55.28,0a5.23,5.23,0,1,1-5.23-5.23,3,3,0,0,0,0-6H25.41V22.1a5.24,5.24,0,0,1,5.23-5.23H70.71a11.16,11.16,0,0,0-1.29,5.07s0,.05,0,.08ZM80.64,27.34H75.41V22.1a5.23,5.23,0,1,1,5.23,5.23Z" />
    <rect x="29.33" y="52.67" width="8" height="6" />
    <rect x="42.33" y="52.67" width="22" height="6" />
    <rect x="29.33" y="40.67" width="8" height="6" />
    <rect x="42.33" y="40.67" width="22" height="6" />
    <rect x="29.33" y="28.67" width="8" height="6" />
    <rect x="42.33" y="28.67" width="22" height="6" />
  </svg>
);

export default Icon;
