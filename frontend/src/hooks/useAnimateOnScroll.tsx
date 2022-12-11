import { useEffect, useRef } from 'react';

type AnimationProps = {
  [key: string]: any;
} | void;

/**
 * @onScroll the event handler triggerd on scroll, which returns
 * the properties that will be used to calculate the animation
 * @animateCallback the callback be used inside rAF, takes in the
 * timestamp from rAF and animation properties returned from onScroll
 */
const useAnimateOnScroll = (
  onScroll: (e: Event) => AnimationProps,
  animateCallback: (timestamp: number, animationProps: AnimationProps) => void,
) => {
  const tickingRef = useRef(false); // recording if a tick is scheduled

  /**
   * Request a tick to perform the animation
   * @param animationProps properties that will be used to calculate the animation
   */
  const requestTick = (animationProps: AnimationProps) => {
    if (!tickingRef.current) {
      // request a frame if no tick is scheduled
      requestAnimationFrame((timestamp) => {
        animateCallback(timestamp, animationProps);
        tickingRef.current = false; // reset tickingRef after the animation is finished
      });
    }
    tickingRef.current = true; // if a tick is scheduled, keep it and do nothing
  };

  /**
   * Call the onScroll handler and then request a tick with properties
   * that are needed to perform the animation
   * @param e the native scrolling event
   */
  const animateOnScroll = (e: Event) => {
    const animationProps = onScroll(e); // receive animation properties from onScroll handler
    requestTick(animationProps); // request a tick
  };

  // add scroll event listener when the component mounted
  useEffect(() => {
    window.addEventListener('scroll', animateOnScroll);
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);
};

export default useAnimateOnScroll;
