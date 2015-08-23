# node-cec
cec-client wrapper in nodejs

## Install

  npm install --save node-cec

## Example

```coffeescript
{ NodeCec, CEC } = require( 'node-cec' )

cec = new NodeCec( 'node-cec-monitor' )

cec.once( 'ready', ( client ) ->
  console.log ' -- READY -- '
  client.sendCommand( 0xf0, CEC.Opcode.GIVE_DEVICE_POWER_STATUS )
)

# events from: http://www.cec-o-matic.com/
cec.on( 'REPORT_POWER_STATUS', ( packet, status ) ->
  for power_status_name, power_status of CEC.PowerStatus when power_status == status
    console.log "POWER_STATUS: #{power_status_name}"
    break
)

cec.on( 'ROUTING_CHANGE', ( packet, fromSource, toSource ) ->

  console.log( "Routing changed from #{fromSource} to #{toSource}." )

)

# -m  = start in monitor-mode
# -d8 = set log level to 8 (=TRAFFIC) (-d 8)
# -br = logical address set to `recording device`
cec.start( 'cec-client', '-m', '-d', '8', '-b', 'r' )
```
