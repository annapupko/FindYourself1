import { COUNT_DOWN1, COUNT_UP1 } from './Types';

export const countUp = () => ({
  type: COUNT_UP1,
  payload: {},
});
export const countDown = () => ({
  type: COUNT_DOWN1,
  payload: {},
});
