import { readFile } from 'fs/promises';
import { CID, create, IPFS } from 'ipfs-core';

/**
 * A class to deal with IPFS by performing the initialization (at constructor), uploading a file and releasing the resources allocated for IPFS.
 */
export class IpfsManager {
  private ipfsPromise: Promise<IPFS>;

  constructor() {
    // when creating, silencing IPFS logs to not interfere with other console logs
    this.ipfsPromise = create({ silent: true });
  }

  /**
   * Uploading a file to IPFS
   * @param filePath the file path to read the content from
   * @param encoding the file's encoding (default to 'utf8')
   * @returns the CID of the file saved on IPFS
   */
  async uploadFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<CID> {
    const [ipfs, fileContent] = await Promise.all([this.ipfsPromise, await readFile(filePath, encoding)]);
    const { cid } = await ipfs.add(fileContent);
    return cid;
  }

  /**
   * this method has to be called by the end of this class usage, in order to release the allocated resources.
   */
  async stop() {
    await (await this.ipfsPromise).stop();
  }
}
