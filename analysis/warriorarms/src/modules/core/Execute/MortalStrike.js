import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import calculateMaxCasts from 'parser/core/calculateMaxCasts';
import Events from 'parser/core/Events';
import Abilities from 'parser/core/modules/Abilities';
import { ThresholdStyle } from 'parser/core/ParseResults';
import Enemies from 'parser/shared/modules/Enemies';
import React from 'react';

import ExecuteRange from './ExecuteRange';

class MortalStrikeAnalyzer extends Analyzer {
  get goodMortalStrikeThresholds() {
    const cd = this.abilities.getAbility(SPELLS.MORTAL_STRIKE.id).cooldown;
    const max = calculateMaxCasts(
      cd,
      this.enduringBlow
        ? this.owner.fightDuration
        : this.owner.fightDuration - this.executeRange.executionPhaseDuration(),
    );
    const maxCast = this.goodMortalStrikes / max > 1 ? this.goodMortalStrikes : max;

    return {
      actual: this.goodMortalStrikes / maxCast,
      isLessThan: {
        minor: 0.95,
        average: 0.85,
        major: 0.75,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  // You want to keep Deep wounds active on your target when in execution phase, without overcasting Mortal Strike
  get notEnoughMortalStrikeThresholds() {
    const cd = 12000; //Deep wounds duration
    const max = calculateMaxCasts(cd, this.executeRange.executionPhaseDuration());
    const maxCast = this.badMortalStrikes / max > 1 ? this.badMortalStrikes : max;

    return {
      actual: this.badMortalStrikes / maxCast,
      isLessThan: {
        minor: 0.9,
        average: 0.8,
        major: 0.6,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  get tooMuchMortalStrikeThresholds() {
    const cd = 12000; //Deep wounds duration
    const max = calculateMaxCasts(cd, this.executeRange.executionPhaseDuration());
    const maxCast = this.badMortalStrikes / max > 1 ? this.badMortalStrikes : max;

    return {
      actual: 1 - this.badMortalStrikes / maxCast,
      isGreaterThan: {
        minor: 1,
        average: 1.15,
        major: (maxCast + 1) / maxCast,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  static dependencies = {
    abilities: Abilities,
    executeRange: ExecuteRange,
    enemies: Enemies,
  };
  goodMortalStrikes = 0;
  badMortalStrikes = 0;
  enduringBlow = this.selectedCombatant.hasLegendaryByBonusID(SPELLS.ENDURING_BLOW.bonusID);

  constructor(...args) {
    super(...args);
    this.addEventListener(
      Events.cast.by(SELECTED_PLAYER).spell(SPELLS.MORTAL_STRIKE),
      this._onMortalStrikeCast,
    );
  }

  isBadMortalStrikeCast(event) {
    if (this.executeRange.isTargetInExecuteRange(event)) {
      const battlelord = this.selectedCombatant.getBuff(SPELLS.BATTLELORD.id);

      const overpower = this.selectedCombatant.getBuff(SPELLS.OVERPOWER.id);
      const exploiter = this.enemies.enemies[event.targetID].hasBuff(
        SPELLS.EXPLOITER.id,
        null,
        0,
        0,
        event.sourceID,
      );

      const exploiter2Stack = exploiter && exploiter.stacks === 2;
      const overpower2Stack = overpower && overpower.stacks === 2;

      //mortal strike should only be cast in execute if:
      //enduring blow legenadry
      //battlelord buff is up
      //target has 2 exploiter stacks and you have 2 overpower stacks (ill figure this out later prolly)
      if (battlelord || this.enduringBlow || (exploiter2Stack && overpower2Stack)) {
        return false;
      }
      return true;
    }
    return false;
  }

  _onMortalStrikeCast(event) {
    if (this.isBadMortalStrikeCast(event)) {
      this.badMortalStrikes += 1;
    } else {
      this.goodMortalStrikes += 1;
    }
  }

  suggestions(when) {
    when(this.tooMuchMortalStrikeThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Try to avoid using <SpellLink id={SPELLS.MORTAL_STRIKE.id} icon /> too much on a target in{' '}
          <SpellLink id={SPELLS.EXECUTE.id} icon /> range, as{' '}
          <SpellLink id={SPELLS.MORTAL_STRIKE.id} /> is less rage efficient than{' '}
          <SpellLink id={SPELLS.EXECUTE.id} />.
        </>,
      )
        .icon(SPELLS.MORTAL_STRIKE.icon)
        .actual(
          t({
            id: 'warrior.arms.suggestions.mortalStrike.efficiency',
            message: `Mortal Strike was cast ${
              this.badMortalStrikes
            } times accounting for ${formatPercentage(
              actual,
            )}% of the total possible casts of Mortal Strike during a time a target was in execute range.`,
          }),
        )
        .recommended(`${formatPercentage(recommended)}% is recommended`),
    );
    when(this.goodMortalStrikeThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Try to cast <SpellLink id={SPELLS.MORTAL_STRIKE.id} icon /> more often when the target is
          outside execute range.
        </>,
      )
        .icon(SPELLS.MORTAL_STRIKE.icon)
        .actual(
          t({
            id: 'warrior.arms.suggestions.motalStrike.outsideExecute',
            message: `Mortal Strike was used ${formatPercentage(
              actual,
            )}% of the time on a target outside execute range.`,
          }),
        )
        .recommended(`${formatPercentage(recommended)}% is recommended`),
    );
  }
}

export default MortalStrikeAnalyzer;
