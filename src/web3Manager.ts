import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

/**
 * A simple class that initialize and expose a configured Web3 instance and the default ethereum address.
 * It uses `HDWalletProvider` and initialize it with the help of the environment variables: `MNEMONIC_PHRASE` and `PROVIDER_URL`.
 */
export class Web3Manager {
  /**
   * the instance of Web3 that is connected to a provider
   */
  public readonly web3: Web3;

  /**
   * the default address to be used for sending transactions.
   * If not provided at the constructor, the first address of the current provider will be used.
   */
  public defaultAddress: string;

  constructor(defaultAddress?: string) {
    this.web3 = new Web3(
      new HDWalletProvider({
        mnemonic: {
          phrase: process.env.MNEMONIC_PHRASE!,
        },
        providerOrUrl: process.env.PROVIDER_URL!,
      })
    );
    if (defaultAddress) {
      this.defaultAddress = defaultAddress;
    } else {
      this.defaultAddress = (<HDWalletProvider>this.web3.currentProvider).getAddress(0);
    }
  }
}
