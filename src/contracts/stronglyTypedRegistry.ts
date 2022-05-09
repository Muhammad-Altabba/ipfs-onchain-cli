import { StronglyTypedContract } from './stronglyTypedContract';

/**
 * The smart contract event name that is emitter after the `store(owner, cid)` is called
 */
export const CID_STORED = 'CIDStored';

/**
 * An interface for the types of the values emitted by the event `CIDStored`
 */
export interface CidStoredValues {
  owner: string;
  cid: string;
}

/**
 * Provide some strongly-type features to Web3 Eth Contracts for the Registry smart contract
 */
export interface StronglyTypedRegistry<T extends string = 'store', E extends string = 'CIDStored'>
  extends StronglyTypedContract<T, E> {}
