import colors from 'colors';

import { printClientInfo } from '../exampleUtils.js';

import { connect, newClientKeypair } from '../../../src/client/index.js';

const address = 'localhost';

const port = 3500;
const protocol = 'test';

const verbose = false;

const keypair = newClientKeypair();
const { privateKeyHex, publicKeyHex } = keypair;

printClientInfo({ privateKeyHex, publicKeyHex });

const connector = connect({ address, port, protocol, keypair, remotePubkey: undefined, verbose });

connector.attachObject('ClientObject', { hello: () => 'world' });

connector.on('ready', ({ sharedSecretHex }) => {
  console.log(`${colors.gray('Channel connected')} ${colors.green('✓')}`);
  console.log(colors.magenta(`Shared secret: ${colors.gray(sharedSecretHex)}`));
});

connector.on('disconnect', () => {
  console.log(`${colors.gray('Channel disconnected')} ${colors.red('✖')}`);
});
