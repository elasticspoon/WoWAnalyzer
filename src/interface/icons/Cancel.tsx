import React from 'react';

type Props = Omit<React.ComponentPropsWithoutRef<'svg'>, 'xmlns' | 'viewBox' | 'className'>;

// https://thenounproject.com/search/?q=circled%20cross&i=1144421
// Created by johartcamp from the Noun Project
const Icon = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="icon" {...props}>
    <path d="M 50 5 C 25.18272 5 5 25.1827 5 50 C 5 74.8173 25.18272 95 50 95 C 74.81728 95 95 74.8173 95 50 C 95 25.1827 74.81728 5 50 5 z M 50 11 C 71.57464 11 89 28.42534 89 50 C 89 71.5746 71.57464 89 50 89 C 28.42536 89 11 71.5746 11 50 C 11 28.42534 28.42536 11 50 11 z M 31.65625 28.96875 A 3.0003 3.0003 0 0 0 29.875 34.09375 L 45.75 50 L 29.875 65.875 A 3.0003 3.0003 0 1 0 34.125 70.09375 L 50 54.21875 L 65.875 70.09375 A 3.0003 3.0003 0 1 0 70.125 65.875 L 54.25 50 L 70.125 34.09375 A 3.0003 3.0003 0 0 0 67.65625 28.96875 A 3.0003 3.0003 0 0 0 65.875 29.875 L 50 45.75 L 34.125 29.875 A 3.0003 3.0003 0 0 0 31.65625 28.96875 z " />
  </svg>
);

export default Icon;
