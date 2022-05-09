#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import * as figlet from 'figlet';

import 'dotenv/config';

import { IpfsManager } from './ipfsManager';
import { RegistryManager } from './registryManager';

console.log(chalk.blue(figlet.textSync('IPFS-OnChain', { horizontalLayout: 'full' })));

program
  .version('0.0.1')
  .description('Uploading local files to IPFS and anchoring it on Ethereum chain')
  .option('-u, --upload <file>', 'Add the specified file to be added to IPFS and then anchored on Ethereum network')
  .option('-l, --list', 'List all CIDs that is anchored at Ethereum smart contract address')
  .option(
    '-o, --owner <address>',
    '(optional) an owner address to filter the CIDs based on. If not provided, all files registered in the smart contract will be listed'
  )
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}

const options = program.opts();

console.log("The used Registry smart contract's address is `%s`", process.env.SMART_CONTRACT_ADDRESS);

const registryManager = new RegistryManager();

if (options.upload) {
  (async () => {
    console.log('You choose to upload the file `%s` to IPFS and anchoring it on chain.', options.upload);
    const ipfsManager = new IpfsManager();
    const cdi = await ipfsManager.uploadFile(options.upload);
    console.log('... The file has been uploaded to IPFS:');
    console.log('... \tCID : %s', cdi);
    await ipfsManager.stop();

    const receipt = await registryManager.store(cdi.toString());
    console.log('... The file CID has been anchored on-chain:');
    console.log('... \tTransaction hash: %s', receipt.transactionHash);
    console.log('... \tBlocknumber: %s', receipt.blockNumber);
    console.log('... \tBy: %s', receipt.events.CIDStored.returnValues.owner);
    console.log('... \tWith hashed CID: %s', receipt.events.CIDStored.returnValues.owner);
    process.exit();
  })();
} else if (options.list) {
  console.log('You choose to list all CID of the files stored at IPFS...');
  (async () => {
    const eventsValues = await registryManager.getPastCidStored({ fromBlock: 0 }, options.owner);
    console.log(
      `A collection of ${eventsValues.length} files has been registered ${
        options.owner ? `for the specified owner (${options.owner})` : 'from all owners'
      }`
    );
    eventsValues.forEach((value) => {
      console.log(` - Owner: ${value.owner}, Hashed CID: ${value.cid}`);
    });
    process.exit();
  })();
} else {
  console.log(
    chalk.yellow(`You should provide a file path or chose to list all events. Kindly check your provided options.`)
  );
  process.exit();
}
