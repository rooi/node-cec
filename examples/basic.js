// -------------------------------------------------------------------------- //
// Example: basic.js
// For more cec-events: http://www.cec-o-matic.com/
// -------------------------------------------------------------------------- //

var nodecec = require( '../' );

var NodeCec = nodecec.NodeCec;
var CEC     = nodecec.CEC;

var cec = new NodeCec( 'node-cec-monitor' );


// -------------------------------------------------------------------------- //
//- KILL CEC-CLIENT PROCESS ON EXIT

process.on( 'SIGINT', function() {
  if ( cec != null ) {
    cec.stop();
  }
  process.exit();
});


// -------------------------------------------------------------------------- //
//- CEC EVENT HANDLING

cec.once( 'ready', function(client) {
  console.log( ' -- READY -- ' );
  //client.sendCommand( 0xf0, CEC.Opcode.STANDBY ); // This works (off)
  //client.sendCommand( 0xf0, CEC.Opcode.IMAGE_VIEW_ON ); // This works (on)
  //client.sendCommand( 0x1f, CEC.Opcode.ACTIVE_SOURCE, 0x20, 0x00); // This works (HDMI2)
  //client.sendCommand( 0x0f, CEC.Opcode.GIVE_DEVICE_POWER_STATUS );
//  client.sendCommand( 0x1f, CEC.Opcode.REPORT_POWER_STATUS, 0x00 );
});
/*
cec.once( 'ready', function(client) {
         console.log( ' -- GIVE_DEVICE_POWER_STATUS -- ' );
         client.sendCommand( 0x1f, CEC.Opcode.GIVE_DEVICE_POWER_STATUS );
         }.bind(this));

cec.on( 'REPORT_POWER_STATUS', function (packet, status) {
    var keys = Object.keys( CEC.PowerStatus );
       
    for (var i = keys.length - 1; i >= 0; i--) {
       if (CEC.PowerStatus[keys[i]] == status) {
          console.log('POWER_STATUS:', keys[i]);
          break;
       }
    }
       
});
*/
cec.on( 'POLLING', function (packet) {
    console.log('POLLING:', packet);
});

cec.on( 'packet', function (packet) {
    console.log('packet:', packet);
});

cec.on( 'traffic', function (traffic) {
    console.log('packet:', traffic);
});

cec.on( 'debug', function (msg) {
    console.log('debug:', msg);
});

cec.on( 'STANDBY', function () {
    console.log('STANDBY:');
});


cec.on( CEC.Opcode.REPORT_POWER_STATUS, function (packet) {
    console.log('CEC.Opcode.REPORT_POWER_STATUS', packet);
});

cec.on( CEC.Opcode.GIVE_DEVICE_POWER_STATUS, function (packet) {
    console.log('CEC.Opcode.GIVE_DEVICE_POWER_STATUS', packet);
});


// Get Vendor ID

cec.once( 'ready', function(client) {
    console.log( ' -- GIVE_DEVICE_VENDOR_ID -- ' );
    client.sendCommand( 0xf0, CEC.Opcode.IMAGE_VIEW_ON ); // This works (on)
    client.sendCommand( 0xf0, CEC.Opcode.GIVE_DEVICE_VENDOR_ID, 0x0F, 0x8C );
    cec.once( 'DEVICE_VENDOR_ID', function (packet, id, vendor) {
        console.log('DEVICE_VENDOR_ID:' + packet + ", " + id + ", " + vendor);
    }.bind(this));
}.bind(this));

// Get Vendor ID
cec.once( 'ready', function(client) {
    console.log( ' -- GIVE_DEVICE_POWER_STATUS -- ' );
    client.sendCommand( 0xf0, CEC.Opcode.GIVE_DEVICE_POWER_STATUS );
    cec.once( 'REPORT_POWER_STATUS', function (packet, status) {
        console.log('DEVICE_VENDOR_ID:' + packet + ", " + status);
    }.bind(this));
}.bind(this));

//cec.on( 'DEVICE_VENDOR_ID', function (packet, id, vendor) {
//    console.log('DEVICE_VENDOR_ID:' + packet + ", " + id + ", " + vendor);
//}.bind(this));
/*
cec.on( 'VENDOR_COMMAND', function (packet, status1, status2) {
    console.log('VENDOR_COMMAND:' + packet + ", " + status1 + ", " + status2);
}.bind(this));

cec.on( 'VENDOR_COMMAND_WITH_ID', function (packet, status1, status2) {
    console.log('VENDOR_COMMAND_WITH_ID:' + packet + ", " + status1 + ", " + status2);
}.bind(this));

// Routing
*/
cec.on( 'ROUTING_CHANGE', function(packet, fromSource, toSource) {
  console.log( 'Routing changed from ' + fromSource + ' to ' + toSource + '.' );
});

/*
cec.once( 'ready', function(client) {
    console.log( ' -- ACTIVE_SOURCE -- ' );
    // This changes active source!!!!
    client.sendCommand( 0x1f, CEC.Opcode.ACTIVE_SOURCE, 0x20, 0x00);
}.bind(this));

cec.once( 'ready', function(client) {
    console.log( ' -- REQUEST_ACTIVE_SOURCE -- ' );
    client.sendCommand( 0x1f, CEC.Opcode.REQUEST_ACTIVE_SOURCE );
}.bind(this));

// Get CEC Version

cec.once( 'ready', function(client) {
    console.log( ' -- GET_CEC_VERSION -- ' );
    client.sendCommand( 0x00, CEC.Opcode.GET_CEC_VERSION );
}.bind(this));
*/
cec.on( 'CEC_VERSION', function (packet, status) {
    console.log('CEC_VERSION:' + packet + ", " + status);
}.bind(this));

// Physical address
/*
cec.once( 'ready', function(client) {
    console.log( ' -- GIVE_PHYSICAL_ADDRESS -- ' );
    client.sendCommand( 0xf0, CEC.Opcode.GIVE_PHYSICAL_ADDRESS );
}.bind(this));

cec.on( 'REPORT_PHYSICAL_ADDRESS', function (packet, status) {
    console.log('REPORT_PHYSICAL_ADDRESS:' + packet + ", " + status);
}.bind(this));
*/
// Deck status address
/*
cec.once( 'ready', function(client) {
         console.log( ' -- GIVE_DECK_STATUS -- ' );
         client.sendCommand( 0xf0, CEC.Opcode.GIVE_DECK_STATUS );
         }.bind(this));
*/
cec.on( 'DECK_STATUS', function (packet, status) {
       console.log('DECK_STATUS:' + packet + ", " + status);
       }.bind(this));
/*
// Tuner device status address

cec.once( 'ready', function(client) {
         console.log( ' -- GIVE_TUNER_DEVICE_STATUS -- ' );
         client.sendCommand( 0xf0, CEC.Opcode.GIVE_TUNER_DEVICE_STATUS );
         }.bind(this));

cec.on( 'TUNER_DEVICE_STATUS', function (packet, status) {
       console.log('TUNER_DEVICE_STATUS:' + packet + ", " + status);
       }.bind(this));

// OSD name status address

cec.once( 'ready', function(client) {
         console.log( ' -- GIVE_OSD_NAME -- ' );
         client.sendCommand( 0xf0, CEC.Opcode.GIVE_OSD_NAME );
         }.bind(this));

//cec.on( 'TUNER_DEVICE_STATUS', function (packet, status) {
//       console.log('TUNER_DEVICE_STATUS:' + packet + ", " + status);
//       }.bind(this));

cec.once( 'ready', function(client) {
         console.log( ' -- SET_OSD_NAME -- ' );
         client.sendCommand( 0xf0, CEC.Opcode.SET_OSD_NAME, "HALLO" );
         }.bind(this));

// power status
*/
/*
cec.once( 'ready', function(client) {
         console.log( ' -- GIVE_DEVICE_POWER_STATUS -- ' );
         client.sendCommand( 0xf0, CEC.Opcode.GIVE_DEVICE_POWER_STATUS );
         }.bind(this));

cec.on( 'REPORT_POWER_STATUS', function (packet, status) {
    var keys = Object.keys( CEC.PowerStatus );
       
    for (var i = keys.length - 1; i >= 0; i--) {
       if (CEC.PowerStatus[keys[i]] == status) {
          console.log('POWER_STATUS:', keys[i]);
          break;
       }
    }
       
});
*/
/*
// power status

cec.once( 'ready', function(client) {
         console.log( ' -- GIVE_AUDIO_STATUS -- ' );
         client.sendCommand( 0xf0, CEC.Opcode.GIVE_AUDIO_STATUS );
         }.bind(this));

cec.on( 'REPORT_AUDIO_STATUS', function (packet, status) {
       console.log('REPORT_AUDIO_STATUS:' + packet + ", " + status);
       }.bind(this));
*/
// -------------------------------------------------------------------------- //
//- START CEC CLIENT

// -m  = start in monitor-mode
// -d8 = set log level to 8 (=TRAFFIC) (-d 8)
// -br = logical address set to `recording device`
cec.start( 'cec-client', '-m', '-d', '31', '-b', 'r' );
