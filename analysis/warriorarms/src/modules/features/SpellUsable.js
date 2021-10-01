import SPELLS from 'common/SPELLS';
import { EventType } from 'parser/core/Events';
import CoreSpellUsable from 'parser/shared/modules/SpellUsable';

class SpellUsable extends CoreSpellUsable {
  static dependencies = {
    ...CoreSpellUsable.dependencies,
  };

  onEvent(event) {
    super.onEvent(event);
    // Tactician passive: You have a 1.40% chance per Rage spent on damaging abilities to reset the remaining cooldown on Overpower.
    if (event.type === EventType.ApplyBuff || event.type === EventType.RefreshBuff) {
      if (event.ability.guid === SPELLS.TACTICIAN.id) {
        if (this.isOnCooldown(SPELLS.OVERPOWER.id)) {
          this.endCooldown(SPELLS.OVERPOWER.id);
        }
      }
    }
  }
}

export default SpellUsable;
