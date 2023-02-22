import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { styled } from '@stitches/react';
import { violet, mauve, blackA } from '@radix-ui/colors';

const List = ({items}) => (
  <ScrollAreaRoot>
    <ScrollAreaViewport>
      <Box>
        {items.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </Box>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar orientation="vertical">
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar orientation="horizontal">
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
);

const SCROLLBAR_SIZE = 10;

const ScrollAreaRoot = styled(ScrollArea.Root, {
  borderRadius: 4,
  overflow: 'hidden',
  height: "100%",
});

const ScrollAreaViewport = styled(ScrollArea.Viewport, {
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
});

const ScrollAreaScrollbar = styled(ScrollArea.Scrollbar, {
  display: 'flex',
  // ensures no selection
  userSelect: 'none',
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: 'none',
  padding: 2,
  background: blackA.blackA6,
  transition: 'background 160ms ease-out',
  '&:hover': { background: blackA.blackA8 },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: SCROLLBAR_SIZE,
  },
});

const ScrollAreaThumb = styled(ScrollArea.Thumb, {
  flex: 1,
  background: mauve.mauve10,
  borderRadius: SCROLLBAR_SIZE,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
});

const ScrollAreaCorner = styled(ScrollArea.Corner, {
  background: blackA.blackA8,
});

const Box = styled('div', {});
const Text = styled('div', {
  color: violet.violet11,
  fontSize: 15,
  lineHeight: '18px',
  fontWeight: 500,
});
const ListItem = styled('div', {
  color: mauve.mauve12,
  fontSize: 13,
  lineHeight: '18px',
  marginTop: 10,
  borderTop: `1px solid ${mauve.mauve6}`,
  padding: "20px 0px"
});

export default List;