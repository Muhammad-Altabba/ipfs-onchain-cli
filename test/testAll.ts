import assert from 'assert';
import { CID } from 'ipfs-core';

import 'dotenv/config';
import { IpfsManager } from '../src/ipfsManager';

import { RegistryManager } from '../src/registryManager';

import { Web3Manager } from '../src/web3Manager';
import Web3 from 'web3';

describe('saving on IPFS and anchoring on Registry contract', () => {
  const web3Manager = new Web3Manager();
  const registryManager = new RegistryManager();
  let cid: string;
  it('...should store the provided file on IPFS and get its CID', async () => {
    const ipfsManager = new IpfsManager();

    cid = (
      await (async () => {
        const cid = await ipfsManager.uploadFile('dummyFiles/simple.txt');
        console.log('... the file has been uploaded to IPFS with the CID %s', cid);
        await ipfsManager.stop();
        return cid;
      })()
    ).toString();

    // Assert that the CID is valid through parsing it
    assert.notEqual(CID.asCID(CID.parse(cid.toString())), null, 'The returned cid should be a valid one');
  });

  it('...should store the file CID on-chain', async () => {
    // store the value of the CID
    await registryManager.store(cid.toString());
    const eventValues = await registryManager.getLastCidStored();
    // Get stored values
    const owner = await eventValues.owner;
    const hashedCid = await eventValues.cid;

    assert.equal(
      owner.toString().toLowerCase(),
      web3Manager.defaultAddress,
      'the sender of the transaction was not emitted in the event as a the `owner`'
    );

    // Actually, the Keccak-256 hash is the actual value stored on-chain, for any indexed parameter of reference type string
    assert.equal(hashedCid, Web3.utils.keccak256(cid), 'The hash of the `cid` was not emitted in the last event');
  });

  it('...should the last 2 registered CIDs match their corresponding values', async () => {
    // store the value of a dummy CID
    const DUMMY_CID = 'DUMMY_CID';
    const { blockNumber } = await registryManager.store(DUMMY_CID);
    const eventsValues = await registryManager.getPastCidStored({
      filter: { owner: web3Manager.defaultAddress },
      fromBlock: blockNumber - 1,
    });
    assert.equal(eventsValues.length === 2, true);
    const lastEvent = eventsValues[eventsValues.length - 1];
    const pervOfLastEvent = eventsValues[eventsValues.length - 2];

    // Get stored values
    const pervOfLastCid = await pervOfLastEvent.cid;
    const lastCid = await lastEvent.cid;

    // Actually, the Keccak-256 hash is the actual value stored on-chain, for any indexed parameter of reference type string
    assert.equal(
      pervOfLastCid,
      Web3.utils.keccak256(cid),
      'The hash of the previous `cid` was not emitted in the last event'
    );
    assert.equal(
      lastCid,
      Web3.utils.keccak256(DUMMY_CID),
      'The hash of the last `cid` was not emitted in the last event'
    );
  });
});
