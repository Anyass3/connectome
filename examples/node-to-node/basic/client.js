import colors from 'colors';

import { printClientInfo } from '../exampleUtils.js';

import { connect, newKeypair } from '../../../index.js';

const address = 'localhost';

const port = 3500;
const protocol = 'test';
const protocolLane = 'fiber';
const verbose = false;

const keypair = newKeypair();
const { privateKeyHex, publicKeyHex } = keypair;

printClientInfo({ privateKeyHex, publicKeyHex });

let receivedCount = 0;

const connector = connect({ address, port, protocol, protocolLane, keypair, remotePubkey: undefined, verbose });

connector.on('ready', ({ sharedSecretHex }) => {
  console.log(`${colors.gray('Channel connected')} ${colors.green('✓')}`);
  console.log(colors.magenta(`Shared secret: ${colors.gray(sharedSecretHex)}`));
});

connector.on('disconnected', () => {
  console.log(`${colors.gray('Channel disconnected')} ${colors.red('✖')}`);
});

connector.on('receive', ({ jsonData }) => {
  console.log(jsonData);
  receivedCount += 1;
  if (receivedCount == 3) {
    console.log(`${colors.gray('Received 3/3 messages, disconnecting ...')}`);
    process.exit();
  }
});