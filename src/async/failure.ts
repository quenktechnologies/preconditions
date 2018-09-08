import * as Promise from 'bluebird';
import { Failure as SyncFailure } from '../failure';

export type Failure<A> = Promise<SyncFailure<A>>;
