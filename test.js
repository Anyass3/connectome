const colors = require('colors');
const { newKeypair } = require('./crypto/index.js');
const { stores } = require('./stores/index.js');
const { ConnectionsAcceptor } = require('./server/index.js');

const store = new stores.proc.MirroringStore({});

function onConnect({ channel, store }) {
  console.log('New example/gui connection');

  channel.on('action', ({ action, namespace, payload }) => {
    if (namespace == 'svelte' && action == 'set_component') {
      const { compiledComponent } = payload;
      store.set({ compiledComponent });
    }
  });
}

function start({ port }) {
  // define connections acceptor
  const keypair = newKeypair();
  const acceptor = new ConnectionsAcceptor({ port, keypair });

  acceptor.on('protocol_added', ({ protocol, lane }) => {
    console.log(`💡 Connectome protocol ${colors.cyan(protocol)}/${colors.cyan(lane)} ready.`);
  });

  // add our example protocol
  const protocol = 'example';
  const lane = 'gui';
  const channelList = acceptor.registerProtocol({
    protocol,
    lane,
    onConnect: ({ channel }) => onConnect({ channel, store })
  });

  store.mirror(channelList);

  // start websocket server
  acceptor.start();
  console.log(colors.green(`Connectome → Running websocket connections acceptor on port ${port} ...`));
}

start({ port: 9000 });
