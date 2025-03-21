import { Juko8 } from 'CONTRIBUTORS';
import Expansion from 'game/Expansion';
import SPECS from 'game/SPECS';
import Config from 'parser/Config';
import React from 'react';

import CHANGELOG from './CHANGELOG';

const config: Config = {
  // The people that have contributed to this spec recently. People don't have to sign up to be long-time maintainers to be included in this list. If someone built a large part of the spec or contributed something recently to that spec, they can be added to the contributors list. If someone goes MIA, they may be removed after major changes or during a new expansion.
  contributors: [Juko8],
  expansion: Expansion.Shadowlands,
  // The WoW client patch this spec was last updated.
  patchCompatibility: '9.1',
  isPartial: false,
  // Explain the status of this spec's analysis here. Try to mention how complete it is, and perhaps show links to places users can learn more.
  // If this spec's analysis does not show a complete picture please mention this in the `<Warning>` component.
  description: (
    <>
      Hello! We have been working hard to make the Windwalker analyzer good, but there is always
      stuff to add or improve. We hope that the suggestions and statistics will be helpful in
      improving your overall performance. It takes time to learn the Windwalker resource and
      cooldown management, so be patient with yourself while getting used to it. <br /> <br />
      If you have any questions about the analyzer or Windwalker monks in general, join us in the{' '}
      <a href="https://discord.gg/0dkfBMAxzTkWj21F" target="_blank" rel="noopener noreferrer">
        Peak of Serenity discord server
      </a>{' '}
      and talk to us. You can reach me there as Juko8. Make sure to also check out our resources on
      the{' '}
      <a href="http://peakofserenity.com/windwalker/" target="_blank" rel="noopener noreferrer">
        Peak of Serenity website
      </a>{' '}
      as well, it has pretty much everything you need to know.
    </>
  ),
  // A recent example report to see interesting parts of the spec. Will be shown on the homepage.
  exampleReport: '/report/9MdLrxhnwbypYPJt/1-Mythic+Abyssal+Commander+Sivara+-+Kill+(4:19)/Jfunk',

  // Don't change anything below this line;
  // The current spec identifier. This is the only place (in code) that specifies which spec this parser is about.
  spec: SPECS.WINDWALKER_MONK,
  // The contents of your changelog.
  changelog: CHANGELOG,
  // The CombatLogParser class for your spec.
  parser: () =>
    import('./CombatLogParser' /* webpackChunkName: "WindwalkerMonk" */).then(
      (exports) => exports.default,
    ),
  // The path to the current directory (relative form project root). This is used for generating a GitHub link directly to your spec's code.
  path: __dirname,
};

export default config;
