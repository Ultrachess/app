import { styled } from '@stitches/react';
import { violet, mauve } from '@radix-ui/colors';
import * as Separator from "@radix-ui/react-separator"

const SeparatorComponent = styled(Separator.Root, {
    backgroundColor: mauve.mauve5,
    '&[data-orientation=horizontal]': { height: 0.5, width: '100%' },
    '&[data-orientation=vertical]': { height: '100%', width: 1 },
    variants: {
      variant: {
        horizontal : { height: 0.5, width: '80%' },
        vertical: { height: '50%', width: 1 },
      }

    }
  });

export default SeparatorComponent;