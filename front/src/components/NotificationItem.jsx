import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, slate, green } from '@radix-ui/colors';

export default ({title, description}) => {
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);
    React.useEffect(() => {
      return () => clearTimeout(timerRef.current);
    }, []);
  
    return (
        <>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription asChild>
            <time dateTime={eventDateRef.current.toISOString()}>
              {description}
            </time>
          </ToastDescription>
          
        </>

    );
  };

  
  const ToastTitle = styled(Toast.Title, {
    gridArea: 'title',
    marginBottom: 5,
    fontWeight: 500,
    color: slate.slate12,
    fontSize: 15,
  });
  
  const ToastDescription = styled(Toast.Description, {
    gridArea: 'description',
    margin: 0,
    color: slate.slate11,
    fontSize: 13,
    lineHeight: 1.3,
  });
  
  
  
  
  