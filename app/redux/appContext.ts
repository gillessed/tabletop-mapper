import { DispatchContext } from '../dispatcherProvider';
import { SagaContext } from '../sagaProvider';

export type AppContext = DispatchContext & SagaContext;

export function mergeContexts(t1: React.ValidationMap<any>, t2: React.ValidationMap<any>): React.ValidationMap<any> {
  return {
    ...t1,
    ...t2,
  };
}