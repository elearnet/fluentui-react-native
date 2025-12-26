import type { IComposeSettings } from '@eluifabricshared/foundation-compose';

import type { IPersonaType } from './Persona.types';
import { personaName } from './Persona.types';

export const settings: IComposeSettings<IPersonaType> = [
  {
    tokens: {
      verticalGap: 4,
    },
  },
  personaName,
];
