import { PastEventOptions } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { CidStoredValues, StronglyTypedRegistry, CID_STORED } from './contracts/stronglyTypedRegistry';
import * as RegistryArtifacts from './contracts/registry.json';
import { Web3Manager } from './web3Manager';

/**
 * A manager for the Registry Smart Contract that provide simple abstraction of the basic functionality needed from that contract.
 */
export class RegistryManager {
  private web3Manager = new Web3Manager();
  private registryInstance: StronglyTypedRegistry;

  constructor() {
    this.registryInstance = new this.web3Manager.web3.eth.Contract(
      RegistryArtifacts.abi as AbiItem[],
      process.env.SMART_CONTRACT_ADDRESS!
    );
  }

  /**
   * Get the last (top) CID stored values according to the search options (default to check only latest block)
   * This is a helper function that is currently used inside a unit test
   */
  async getLastCidStored(
    options: PastEventOptions = {
      fromBlock: 'latest',
    },
    owner?: string
  ): Promise<CidStoredValues> {
    const events = await this.getPastCidStored(options, owner);
    return events[0] as CidStoredValues;
  }

  /**
   * Get the past CID stored values according to the search options
   */
  async getPastCidStored(options: PastEventOptions, owner?: string): Promise<CidStoredValues[]> {
    const pastEventOptions = owner ? { ...options, filter: { owner: owner } } : options;
    const events = await this.registryInstance.getPastEvents(CID_STORED, pastEventOptions);
    return events.map((ev) => ev.returnValues as CidStoredValues);
  }

  /**
   * Store the value of the CID on-chain
   */
  async store(value: string, owner?: string): Promise<any> {
    const from = owner ?? this.web3Manager.defaultAddress;
    return await this.registryInstance.methods?.store(value).send({ from });
  }
}
