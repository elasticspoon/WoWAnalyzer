import React from 'react';

type Props = Omit<React.ComponentPropsWithoutRef<'svg'>, 'xmlns' | 'viewBox' | 'className'>;

// https://thenounproject.com/search/?q=skull&i=1062204
// Created by Royyan Razka from the Noun Project
const Icon = (props: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 80 80" className="icon" {...props}>
    <path d="M49.97 10C31.72 10 17 24.577 17 42.656 17 53.46 22.305 63.056 30.5 69a2 2 0 0 1 .813 1.625V90h8.03v-6.062a2 2 0 0 1 1.97-2.032 2 2 0 0 1 2.03 2.032V90h13.438v-6.062a2 2 0 0 1 2-2.032 2 2 0 0 1 2 2.032V90h7.876V70.625A2 2 0 0 1 69.5 69C77.695 63.055 83 53.46 83 42.656 83 24.576 68.262 10 49.97 10zM33.5 47.97a2 2 0 0 1 .188 0 2 2 0 0 1 1.437.593l4.063 4.03 4.062-4.03a2 2 0 0 1 1.375-.594 2 2 0 0 1 1.438 3.436l-4.032 4 4.033 4a2 2 0 1 1-2.813 2.844l-4.062-4.03-4.063 4.03a2 2 0 1 1-2.812-2.844l4.03-4-4.03-4A2 2 0 0 1 33.5 47.97zm21.5 0a2 2 0 0 1 .188 0 2 2 0 0 1 1.437.593l4.063 4.03 4.062-4.03a2 2 0 0 1 1.375-.594 2 2 0 0 1 1.438 3.436l-4.032 4 4.033 4a2 2 0 1 1-2.813 2.844l-4.062-4.03-4.063 4.03a2 2 0 1 1-2.812-2.844l4.03-4-4.03-4A2 2 0 0 1 55 47.97z" />
  </svg>
);

export default Icon;
