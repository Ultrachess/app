import { useToaster } from 'react-hot-toast/headless';
import ActionView from './ActionView';

export default () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,
        right: 200,
        zIndex: 100000
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast) => {
        const offset = -calculateOffset(toast, {
          reverseOrder: false,
          gutter: 8,
        });

        const ref = (el) => {
          if (el && !toast.height) {
            const height = el.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };
        return (
          <div
            key={toast.id}
            ref={ref}
            style={{
              position: 'absolute',
              width: '200px',
              background: 'white',
              transition: 'all 0.5s ease-out',
              opacity: toast.visible ? 1 : 0,
              transform: `translateY(${offset}px)`,
            }}
            {...toast.ariaProps}
          >
            <ActionView
              id={toast.message}
              pauseToast = {startPause}
              freeToast = {endPause}
            />
          </div>
        );
      })}
    </div>
  );
};