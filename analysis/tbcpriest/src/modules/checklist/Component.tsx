import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import { ResourceLink, SpellLink } from 'interface';
import { TooltipElement } from 'interface/Tooltip';
import Checklist from 'parser/shared/modules/features/Checklist';
import {
  AbilityRequirementProps,
  ChecklistProps,
} from 'parser/shared/modules/features/Checklist/ChecklistTypes';
import GenericCastEfficiencyRequirement from 'parser/shared/modules/features/Checklist/GenericCastEfficiencyRequirement';
import Requirement from 'parser/shared/modules/features/Checklist/Requirement';
import Rule from 'parser/shared/modules/features/Checklist/Rule';
import PreparationRule from 'parser/tbc/modules/features/Checklist/PreparationRule';
import React from 'react';

import * as SPELLS from '../../SPELLS';

const PriestChecklist = ({ thresholds, castEfficiency, combatant }: ChecklistProps) => {
  const AbilityRequirement = (props: AbilityRequirementProps) => (
    <GenericCastEfficiencyRequirement
      castEfficiency={castEfficiency.getCastEfficiencyForSpellId(props.spell)}
      {...props}
    />
  );

  return (
    <Checklist>
      <Rule
        name="Use core abilities as often as possible"
        description={
          <>
            Using your core abilities as often as possible will typically result in better
            performance. <SpellLink id={SPELLS.PRAYER_OF_MENDING} /> should be used on cooldown any
            time that you don't have 5 stacks up on a tank. Prayer of mending also gives any threat
            to the target it heals, so you can help your tanks generate more threat!
          </>
        }
      >
        <AbilityRequirement spell={SPELLS.PRAYER_OF_MENDING} />
      </Rule>
      <Rule
        name="Use cooldowns effectively"
        description={
          <>
            TBC doesn't have as many cooldowns as retails, but they still play an important part of
            optimizing your play. <SpellLink id={SPELLS.SHADOW_FIEND} /> should be used any time you
            are below 70% mana, and If you spec into <SpellLink id={SPELLS.PAIN_SUPPRESSION} />,{' '}
            <SpellLink id={SPELLS.POWER_INFUSION} />, or <SpellLink id={SPELLS.INNER_FOCUS} />, you
            should try and use them as often as possible.
          </>
        }
      >
        {combatant.talents[0] >= 11 && <AbilityRequirement spell={SPELLS.INNER_FOCUS} />}
        {combatant.talents[0] >= 31 && <AbilityRequirement spell={SPELLS.POWER_INFUSION} />}
        {combatant.talents[0] >= 41 && <AbilityRequirement spell={SPELLS.PAIN_SUPPRESSION} />}
        <AbilityRequirement spell={SPELLS.SHADOW_FIEND} />
      </Rule>
      <Rule
        name="Try to avoid being inactive for a large portion of the fight"
        description={
          <>
            High downtime is inexcusable, while it may be tempting to not cast and save mana,
            wanding is free. If you have a Paladin keeping <SpellLink id={20354} /> on an enemy,
            wanding can even give mana back! You can reduce your downtime by reducing the delay
            between casting spells, anticipating movement, moving during the GCD, and{' '}
            <TooltipElement content="You can ignore this while learning Holy, but contributing DPS whilst healing is a major part of becoming a better than average player.">
              when you're not healing try to contribute some damage.*
            </TooltipElement>
            .
          </>
        }
      >
        <Requirement
          name="Non healing time"
          thresholds={thresholds.nonHealingTimeSuggestionThresholds}
        />
        <Requirement name="Downtime" thresholds={thresholds.downtimeSuggestionThresholds} />
      </Rule>

      <Rule
        name={
          <>
            Use all of your <ResourceLink id={RESOURCE_TYPES.MANA.id} /> effectively
          </>
        }
        description="If you have a large amount of mana left at the end of the fight that's mana you could have turned into healing. Try to use all your mana during a fight. A good rule of thumb is to try to match your mana level with the boss's health."
      >
        <Requirement name="Mana left" thresholds={thresholds.manaLeft} />
      </Rule>

      <PreparationRule thresholds={thresholds} />
    </Checklist>
  );
};

export default PriestChecklist;
