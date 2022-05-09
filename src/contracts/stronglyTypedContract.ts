import { EventEmitter } from 'stream';
import { Contract, ContractSendMethod } from 'web3-eth-contract';

/**
 * An interface that provide some strongly-type features to Web3 Eth Contracts
 */
export interface StronglyTypedContract<T extends string, E extends string> extends Contract {
  methods: { [key in T]: (...args: any[]) => ContractSendMethod };
  events: { [key in E]: (...args: any[]) => EventEmitter };
}
