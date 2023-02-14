import { styled } from '@stitches/react';
import { violet } from '@radix-ui/colors';
import * as Separator from "@radix-ui/react-separator"

const SeparatorComponent = styled(Separator.Root, {
    backgroundColor: violet.violet6,
    '&[data-orientation=horizontal]': { height: 0.5, width: '80%' },
    '&[data-orientation=vertical]': { height: '50%', width: 1 },
  });

export default SeparatorComponent;