import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';
import Enemies from 'parser/shared/modules/Enemies';
import React from 'react';

import SpellUsable from '../features/SpellUsable';
import ExecuteRange from './Execute/ExecuteRange';

// Slam should be the lowest priority ability
// Analyzer should check that:
//  - Mortal Strike was not usable - done
//  - Execute was not usable - done
//  - Overpower was not usable
//  - Rend was not refreshable
// Ideally would also check rage value to see if should have been cast

class Slam extends Analyzer {
  get badCastSuggestionThresholds() {
    return {
      actual: this.badCast / this.totalCast || 0,
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
  };
  badCast = 0;
  totalCast = 0;
  skullSplitter = this.selectedCombatant.hasTalent(SPELLS.SKULLSPLITTER_TALENT.id);
  enduringBlow = this.selectedCombatant.hasLegendaryByBonusID(SPELLS.ENDURING_BLOW.bonusID);

  constructor(...args) {
    super(...args);

    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.SLAM), this._onSlamCast);
  }

  _onSlamCast(event) {
    this.totalCast += 1;
    const suddenDeath = this.selectedCombatant.getBuff(SPELLS.SUDDEN_DEATH_ARMS_TALENT_BUFF.id);
    const overpower = this.selectedCombatant.getBuff(SPELLS.OVERPOWER.id);

    /* if (
      this.spellUsable.isAvailable(SPELLS.MORTAL_STRIKE.id) &&
      !this.executeRange.isTargetInExecuteRange(event)
    ) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason =
        'This Slam was used on a target while Mortal Strike was off cooldown.';
      this.badCast += 1;
    } else if (this.executeRange.isTargetInExecuteRange(event) || suddenDeath) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target while Execute was usable.';
      this.badCast += 1;
    } */

    if (this.executeRange.isTargetInExecuteRange(event)) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target in Execute range.';
      this.badCast += 1;
    }
    // Slam used on target with no rend
    /* else if (false) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target while Rend was not applied.';
      this.badCast += 1;
    }  */
    // Slam was used instead of 2 stack overpower
    /* else if (overpower) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target while Overpower had 2 stacks.';
      this.badCast += 1;
    }  */
    // Slam was used instead of Mortal Strike with 2 stacks or lego
    else if (
      (this.enduringBlow || (overpower && overpower.stacks === 2)) &&
      this.spellUsable.isAvailable(SPELLS.MORTAL_STRIKE.id)
    ) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason =
        'This Slam was used on a target while Mortal Strike was usable with lego.';
      this.badCast += 1;
    }
    // Slam instead of execute /w SD
    else if (suddenDeath) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target while Execute was usable.';
      this.badCast += 1;
    }
    // Slam instead of skullsplitter
    /* else if (this.skullsplitter
             && this.spellUsable.isAvailable(SPELLS.SKULLSPLITTER_TALENT.id)) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target while Skullsplitter was usable.';
      this.badCast += 1;
    } */
    // Slam instead of bladestorm (idk if this one should be here)
    /* else if (false) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target while Mortal Strike was usable.';
      this.badCast += 1;
    }  */
    // Slam instead of overpower
    /* else if (overpower) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target while Mortal Strike was usable.';
      this.badCast += 1;
    }  */
    // Slam instead of mortal strike with no legos
    else if (this.spellUsable.isAvailable(SPELLS.MORTAL_STRIKE.id)) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason =
        'This Slam was used on a target while Mortal Strike was usable.';
      this.badCast += 1;
    }
    // Slam instead of rend
    /* else if (false) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'This Slam was used on a target while Mortal Strike was usable.';
      this.badCast += 1;
    }  */
  }

  suggestions(when) {
    when(this.badCastSuggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Try to avoid using <SpellLink id={SPELLS.SLAM.id} /> when{' '}
          <SpellLink id={SPELLS.MORTAL_STRIKE.id} /> or <SpellLink id={SPELLS.EXECUTE.id} /> is
          available as it is more rage efficient.
        </>,
      )
        .icon(SPELLS.SLAM.icon)
        .actual(
          t({
            id: 'warrior.arms.suggestions.slam.efficiency',
            message: `Slam was cast ${this.badCast} times accounting for ${formatPercentage(
              actual,
            )}% of total casts, while Mortal Strike or Execute was available.`,
          }),
        )
        .recommended(`${recommended}% is recommended`),
    );
  }
}

export default Slam;
