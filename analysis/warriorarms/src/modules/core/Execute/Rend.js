import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';
import { ThresholdStyle } from 'parser/core/ParseResults';
import { encodeTargetString } from 'parser/shared/modules/EnemyInstances';
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
  rendCasts = [];
  dotApplications = [];

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.REND_TALENT.id);
    this.addEventListener(
      Events.cast.by(SELECTED_PLAYER).spell(SPELLS.REND_TALENT),
      this._onRendCast,
    );
    this.addEventListener(
      Events.removedebuff.by(SELECTED_PLAYER).spell(SPELLS.REND_TALENT),
      this._onRendExpire,
    );
    this.addEventListener(
      Events.refreshdebuff.by(SELECTED_PLAYER).spell(SPELLS.REND_TALENT),
      this._onRefreshRend,
    );
    this.addEventListener(
      Events.applydebuff.by(SELECTED_PLAYER).spell(SPELLS.REND_TALENT),
      this._onApplyRend,
    );
  }

  //in execute rend should be applied if:
  // 4 seconds or less remain on colossus smash or warbreaker cd - done
  // the target will live 12 seconds - not sure how to implment yet.
  _onRendCast(event) {
    this.rendCasts[event.timestamp] = { rend: event, duration: 0 };
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

  // labels rend cast as bad if rend did not stay up a combined 12s
  _onRendExpire(event) {
    try {
      const dotApp = this.dotApplications[encodeTargetString(event.targetID, event.targetInstance)];
      const rendCast = this.rendCasts[dotApp.timestamp];
      const duration = (event.timestamp - rendCast.rend.timestamp) / 1000;
      rendCast.duration += duration;
      if (!rendCast.rend.meta && rendCast.duration < 12) {
        rendCast.rend.meta = rendCast.rend.meta || {};
        rendCast.rend.meta.isInefficientCast = true;
        rendCast.rend.meta.inefficientCastReason = `Target lived ${duration}s. Try not to cast Rend on targets that will not live its full duration.`;
      } else if (rendCast.rend.meta.inefficientCastReason.toString().includes('Target lived')) {
        if (rendCast.duration < 12) {
          rendCast.rend.meta.inefficientCastReason = `Target lived ${duration}s. Try not to cast Rend on targets that will not live its full duration.`;
        } else {
          rendCast.rend.meta = {};
        }
      }
    } catch (err) {
      if (err instanceof TypeError) {
        return 0;
      } else {
        throw err;
      }
    }
  }

  _onApplyRend(event) {
    if (this.rendCasts[event.timestamp]) {
      this.dotApplications[
        encodeTargetString(event.targetID, event.targetInstance)
      ] = this.rendCasts[event.timestamp].rend;
    }
  }

  _onRefreshRend(event) {
    try {
      const rendCast = this.rendCasts[event.timestamp].rend;
      if (rendCast.meta.inefficientCastReason.toString().includes('Target lived')) {
        rendCast.meta = {};
      }
    } catch (err) {
      if (err instanceof TypeError) {
        return 0;
      } else {
        throw err;
      }
    }
    this._onApplyRend(event);
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
