# Anchored IPFS On-chain

This repo is a simple sample CLI that save a file to IPFS, and anchor its CID hash on-chain using a [`Registry` contract](https://goerli.etherscan.io/address/0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3#code).

Getting Started
This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

## Prerequisites

This repo has been developed while using Node v16.13.1. Please consider using the same version if you run into some issues.

Additionally, IPFS is required to be installed. If you do not already have it, then run `npm install -g ipfs`.

Lastly, update the `.env` file to whatever configuration you would like to have:

- `PROVIDER_URL` should contain the url of your remote or local node. (I use Ganache at http://localhost:7545)
- `MNEMONIC_PHRASE` the seed word for the Ether account that you will use to register the file CID on-chain.
- `SMART_CONTRACT_ADDRESS` the address on which the smart contract is already deployed
- (if you use Ganache, you need to deploy the contract to it before running the tests. If you use Goerli, the smart contract address is here: https://goerli.etherscan.io/address/0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3 )

## Testing

### Install dependencies

`npm i`

### Run tests

Build the script and run the tests using:
`npm run build-and-test`

You should then see something like:

```sh
  saving on IPFS and anchoring on Registry contract
... the file has been uploaded to IPFS with the CID QmRUnoL9nfbxEAGjzEJJbqooXfPAur8KceQUKH3HyXqBBi
    ✔ ...should store the provided file on IPFS and get its CID (2753ms)
    ✔ ...should store the file CID onchain (123ms)
    ✔ ...should the last 2 registered CIDs match their corresponding values (103ms)

  3 passing (3s)
```

(if you run into issues, please consider changing your Node version as mentioned above)

## Experiment

### Upload a file to IPFS and anchor it on-chain

`npm run upload-sample-file`

### List all pervious CIDs (hashed) and their owners

`npm run list-cids-all`

### List all pervious CIDs (hashed) filtered by some owner (please update the owner address at the command inside `package.json` as needed)

`npm run list-cids-filtered`

## Install CLI and Use it

### Install globally on your machine

To install the CLI on your machine run
`npm run install-cli`
You should now see something like:

```
  ___   ____    _____   ____             ___             ____   _               _
 |_ _| |  _ \  |  ___| / ___|           / _ \   _ __    / ___| | |__     __ _  (_)  _ __
  | |  | |_) | | |_    \___ \   _____  | | | | | '_ \  | |     | '_ \   / _` | | | | '_ \
  | |  |  __/  |  _|    ___) | |_____| | |_| | | | | | | |___  | | | | | (_| | | | | | | |
 |___| |_|     |_|     |____/           \___/  |_| |_|  \____| |_| |_|  \__,_| |_| |_| |_|

Usage: ipfs-onchain [options]

Uploading local files to IPFS and anchoring it on Ethereum chain

Options:
  -V, --version        output the version number
  -u, --upload <file>  Add the specified file to be added to IPFS and then anchored on Ethereum network
  -l, --list           List all CIDs that is anchored at Ethereum smart contract address
  -h, --help           display help for command
```

### Calling CLI

As noted above, after installation globally, the command line could be used like this:
`ipfs-onchain [options]`

Fast test the functionality, you can chose to list the files registered at the deployed Registry contract at Görli testnet:

`PROVIDER_URL=https://goerli.infura.io/v3/40861e6a38424fdeaf9888d011aa284c SMART_CONTRACT_ADDRESS=0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3 ipfs-onchain -l`

> Note: The next commands would use the values from the local default `.env` file. Which is pointing to a local node (tested with Ganache). However, you can override the variables similar to the last command above. if a fast try is intended.

So, to list all file anchored on-chain:

(The following command will use variable values from your local `.env` files)

`ipfs-onchain -l`

And the output would be something like:

```
  ___   ____    _____   ____             ___             ____   _               _
 |_ _| |  _ \  |  ___| / ___|           / _ \   _ __    / ___| | |__     __ _  (_)  _ __
  | |  | |_) | | |_    \___ \   _____  | | | | | '_ \  | |     | '_ \   / _` | | | | '_ \
  | |  |  __/  |  _|    ___) | |_____| | |_| | | | | | | |___  | | | | | (_| | | | | | | |
 |___| |_|     |_|     |____/           \___/  |_| |_|  \____| |_| |_|  \__,_| |_| |_| |_|

The Registry smart contract address is `0x6bAC211c3F9E668DCD394dc996D7bA9Ccc02bF56`
You choose to list all CID of the files stored at IPFS...
A collection of 52 files has been registered from all owners
 - Owner: 0x145B54D3A4bd66E8Cf7AB04144B296B539cCae88, Hashed CID: 0x9443b74014e2cde536460f8a54a0ae165f471d9445ea970f7ae2d011e849b836
 - Owner: 0xF9043c8FDC7760C0D3A8AEa78044DBC66Bd50876, Hashed CID: 0x800debd7449e3fcd14afd10622f0503cbcb7300b79d728574f2919a0434df5be
 - Owner: 0xe66D0556C8a103adfa6C9a60018CD4D8AD78044C, Hashed CID: 0x9443b74014e2cde536460f8a54a0ae165f471d9445ea970f7ae2d011e849b836
 - Owner: 0xDe95aC8cbDF0AbAd9140e63b07De519efaDD6Fed, Hashed CID: 0x800debd7449e3fcd14afd10622f0503cbcb7300b79d728574f2919a0434df5be
 - Owner: 0xb69DB7b7B3aD64d53126DCD1f4D5fBDaea4fF578, Hashed CID: 0x9443b74014e2cde536460f8a54a0ae165f471d9445ea970f7ae2d011e849b836
 - ...
```

And, to list files that is related to a specific owner Ethereum address:

(The following command will use variable values from your local `.env` files)

`ipfs-onchain -l -o 0xDe95aC8cbDF0AbAd9140e63b07De519efaDD6Fed`

And the output would be something like:

```
  ___   ____    _____   ____             ___             ____   _               _
 |_ _| |  _ \  |  ___| / ___|           / _ \   _ __    / ___| | |__     __ _  (_)  _ __
  | |  | |_) | | |_    \___ \   _____  | | | | | '_ \  | |     | '_ \   / _` | | | | '_ \
  | |  |  __/  |  _|    ___) | |_____| | |_| | | | | | | |___  | | | | | (_| | | | | | | |
 |___| |_|     |_|     |____/           \___/  |_| |_|  \____| |_| |_|  \__,_| |_| |_| |_|

The Registry smart contract address is `0x6bAC211c3F9E668DCD394dc996D7bA9Ccc02bF56`
You choose to list all CID of the files stored at IPFS...
A collection of 3 files has been registered for the specified owner (0xDe95aC8cbDF0AbAd9140e63b07De519efaDD6Fed)
 - Owner: 0xDe95aC8cbDF0AbAd9140e63b07De519efaDD6Fed, Hashed CID: 0x9443b74014e2cde536460f8a54a0ae165f471d9445ea970f7ae2d011e849b836
 - Owner: 0xDe95aC8cbDF0AbAd9140e63b07De519efaDD6Fed, Hashed CID: 0x800debd7449e3fcd14afd10622f0503cbcb7300b79d728574f2919a0434df5be
 - Owner: 0xDe95aC8cbDF0AbAd9140e63b07De519efaDD6Fed, Hashed CID: 0x9443b74014e2cde536460f8a54a0ae165f471d9445ea970f7ae2d011e849b836
```

However, to upload a file (the file `dummyFiles/simple.txt` exists at the project folder for testing. Feel free to specify another file):

(The following command will use variable values from your local `.env` files)

`ipfs-onchain -u dummyFiles/simple.txt`

And the output would be something like:

```
  ___   ____    _____   ____             ___             ____   _               _
 |_ _| |  _ \  |  ___| / ___|           / _ \   _ __    / ___| | |__     __ _  (_)  _ __
  | |  | |_) | | |_    \___ \   _____  | | | | | '_ \  | |     | '_ \   / _` | | | | '_ \
  | |  |  __/  |  _|    ___) | |_____| | |_| | | | | | | |___  | | | | | (_| | | | | | | |
 |___| |_|     |_|     |____/           \___/  |_| |_|  \____| |_| |_|  \__,_| |_| |_| |_|

The Registry smart contract address is `0x6bAC211c3F9E668DCD394dc996D7bA9Ccc02bF56`
You choose to upload the file `dummyFiles/simple.txt` to IPFS and anchoring it on chain.
... The file has been uploaded to IPFS:
...     CID : QmRUnoL9nfbxEAGjzEJJbqooXfPAur8KceQUKH3HyXqBBi
... The file CID has been anchored on-chain:
...     Transaction hash: 0x64f373cdc906f9214341d2d67aaf59d9977441095c49f4094872a977121a609b
...     Blocknumber: 80
...     By: 0xDe95aC8cbDF0AbAd9140e63b07De519efaDD6Fed
...     With hashed CID: 0xDe95aC8cbDF0AbAd9140e63b07De519efaDD6Fed
```
