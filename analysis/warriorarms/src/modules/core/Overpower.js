import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import { SpellIcon } from 'interface';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import calculateMaxCasts from 'parser/core/calculateMaxCasts';
import Events from 'parser/core/Events';
import Abilities from 'parser/core/modules/Abilities';
import Enemies from 'parser/shared/modules/Enemies';
import StatisticBox, { STATISTIC_ORDER } from 'parser/ui/StatisticBox';
import React from 'react';

import SpellUsable from '../features/SpellUsable';
import ExecuteRange from './Execute/ExecuteRange';
import TacticianProc from './TacticianProc';

/**
 * Logs used to test:
 *
 * 0 wasted buffs: https://www.warcraftlogs.com/reports/YF9MzcnWXd4ak7vC/#fight=1&source=25
 * 4/15 wasted: https://www.warcraftlogs.com/reports/qAK2R8kZg9DL1YFm/#fight=27&source=1113&type=summary&graph=true
 *
 */

/* 
Other bad casts to include:
overpower over free execute
overpower over ms with lego 
*/

class OverpowerAnalyzer extends Analyzer {
  get MissedOverpowerCastsThresholds() {
    return {
      actual: 1 - this.overpowerCasts / this.maxOverpowerCasts(),
      isGreaterThan: {
        minor: 0.05,
        average: 0.1,
        major: 0.2,
      },
      style: 'percentage',
    };
  }

  get WastedOverpowerBuffsThresholds() {
    return {
      actual: this.wastedProc / this.overpowerCasts,
      isGreaterThan: {
        minor: 0,
        average: 0.05,
        major: 0.1,
      },
      style: 'percentage',
    };
  }

  static dependencies = {
    executeRange: ExecuteRange,
    enemies: Enemies,
    spellUsable: SpellUsable,
    abilities: Abilities,
    tactitican: TacticianProc,
  };
  overpowerCasts = 0;
  wastedProc = 0;

  constructor(...args) {
    super(...args);
    this.addEventListener(
      Events.cast.by(SELECTED_PLAYER).spell(SPELLS.OVERPOWER),
      this._onOverpowerCast,
    );
  }

  maxOverpowerCasts() {
    const overpowerCd = this.abilities.getAbility(SPELLS.OVERPOWER.id).cooldown;
    const maxOverpowerCast =
      calculateMaxCasts(overpowerCd, this.owner.fightDuration) + this.tactitican.totalProcs;
    this.abilities.getAbility(SPELLS.OVERPOWER.id).maxCasts = (num) => maxOverpowerCast;
    return maxOverpowerCast;
  }

  _onOverpowerCast(event) {
    this.overpowerCasts += 1;
    const overpower = this.selectedCombatant.getBuff(SPELLS.OVERPOWER.id);

    if (
      !(
        overpower &&
        overpower.stacks === 2 &&
        this.spellUsable.isAvailable(SPELLS.MORTAL_STRIKE.id)
      )
    ) {
      return;
    }

    // if not in execute and stacks were at two when overpower was casted then a proc is considered wasted
    if (!this.executeRange.isTargetInExecuteRange(event)) {
      this.wastedProc += 1;
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason =
        'This Overpower was used while already at 2 stacks and Mortal Strike was available';
    }
  }

  suggestions(when) {
    when(this.WastedOverpowerBuffsThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Try to avoid using <SpellLink id={SPELLS.OVERPOWER.id} icon /> at 2 stacks when{' '}
          <SpellLink id={SPELLS.MORTAL_STRIKE.id} icon /> is available. Use your stacks of Overpower
          with Mortal Strike to avoid over stacking, which result in a loss of damage.
        </>,
      )
        .icon(SPELLS.OVERPOWER.icon)
        .actual(
          t({
            id: 'warrior.arms.suggestions.overpower.stacksWasted',
            message: `${formatPercentage(actual)}% of Overpower stacks were wasted.`,
          }),
        )
        .recommended(`${formatPercentage(recommended)}% is recommended.`),
    );

    when(this.MissedOverpowerCastsThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Try to cast <SpellLink id={SPELLS.OVERPOWER.id} icon /> more often.
        </>,
      )
        .icon(SPELLS.OVERPOWER.icon)
        .actual(
          t({
            id: 'warrior.arms.suggestions.overpower.castsMissed',
            message: `${formatPercentage(actual)}% of possible Overpower casts were missed.`,
          }),
        )
        .recommended(`Less than ${formatPercentage(recommended)}% is recommended.`),
    );
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.OVERPOWER.id} />}
        label="Overpower Buffs Wasted"
        position={STATISTIC_ORDER.OPTIONAL(6)}
        value={
          <>
            {this.wastedProc} <small>wasted buffs</small>
            <br />
            {this.overpowerCasts} <small>total casts</small>
          </>
        }
        tooltip={
          <>
            The overpower buff caps at two stacks. When at cap, casting Overpower will waste a buff
            stack. This is not important during execute phase as Mortal Strike is replaced with
            Execute which does not consume Overpower buff stacks.
          </>
        }
      />
    );
  }
}

export default OverpowerAnalyzer;
