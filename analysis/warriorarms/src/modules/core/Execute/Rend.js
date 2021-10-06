import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';
import { ThresholdStyle } from 'parser/core/ParseResults';
import React from 'react';

import SpellUsable from '../../features/SpellUsable';
import ExecuteRange from './ExecuteRange';

class RendAnalyzer extends Analyzer {
  get executeRendsThresholds() {
    return {
      actual: this.badRendsInExecuteRange / this.rends,
      isGreaterThan: {
        minor: 0,
        average: 0.05,
        major: 0.1,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  static dependencies = {
    executeRange: ExecuteRange,
    spellUsable: SpellUsable,
  };
  rends = 0;
  badRendsInExecuteRange = 0;
  rendTable = [];

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.REND_TALENT.id);
    this.addEventListener(
      Events.cast.by(SELECTED_PLAYER).spell(SPELLS.REND_TALENT),
      this._onRendCast,
    );
  }

  //in execute rend should be applied if:
  // 4 seconds or less remain on colossus smash or warbreaker cd - done
  // the target will live 12 seconds - not sure how to implment yet.
  _onRendCast(event) {
    this.rends += 1;
    if (this.executeRange.isTargetInExecuteRange(event)) {
      if (this.selectedCombatant.hasTalent(SPELLS.WARBREAKER_TALENT.id)) {
        if (
          this.spellUsable.isOnCooldown(SPELLS.WARBREAKER_TALENT.id) &&
          this.spellUsable.cooldownRemaining(SPELLS.WARBREAKER_TALENT.id) > 4000
        ) {
          this.badRendsInExecuteRange += 1;

          event.meta = event.meta || {};
          event.meta.isInefficientCast = true;
          event.meta.inefficientCastReason =
            'Rend in execute should only be used under 4s before Warbreaker.';
        }
      } else {
        if (
          this.spellUsable.isOnCooldown(SPELLS.COLOSSUS_SMASH.id) &&
          this.spellUsable.cooldownRemaining(SPELLS.COLOSSUS_SMASH.id) > 4000
        ) {
          this.badRendsInExecuteRange += 1;

          event.meta = event.meta || {};
          event.meta.isInefficientCast = true;
          event.meta.inefficientCastReason =
            'Rend in execute should only be used under 4s before Colossus Smash.';
        }
      }
    }
  }

  suggestions(when) {
    when(this.executeRendsThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          <SpellLink id={SPELLS.REND_TALENT.id} icon /> should only be used on a target in{' '}
          <SpellLink id={SPELLS.EXECUTE.id} icon /> range if it is applied less than 4 seconds
          before
          <SpellLink id={SPELLS.COLOSSUS_SMASH.id} icon /> or{' '}
          <SpellLink id={SPELLS.WARBREAKER_TALENT.id} icon />.
        </>,
      )
        .icon(SPELLS.REND_TALENT.icon)
        .actual(
          t({
            id: 'warrior.arms.suggestions.execute.rend.casts',
            message: `Rend was used early ${formatPercentage(
              actual,
            )}% of the time on a target in execute range.`,
          }),
        )
        .recommended(`${formatPercentage(recommended)}% is recommended`),
    );
  }
}

export default RendAnalyzer;
