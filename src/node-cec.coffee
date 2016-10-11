{ spawn }   = require( 'child_process' )
{ EventEmitter }  = require( 'events' )

# ---------------------------------------------------------------------------- #
#    #NodeCEC
# ---------------------------------------------------------------------------- #

emitLines      = require( './lib/emitLines' )
@CEC           = require( './lib/cectypes' )

CEC = @CEC

class @NodeCec extends EventEmitter

  constructor: ( @cecName=null ) ->
    @ready = false
    @stdinHandlers = [

      {
        contains: 'waiting for input'
        callback: ( line ) => @emit( 'ready', @ )
      }

      {
        match: /^TRAFFIC:/g
        callback: @processTraffic
      }

      {
        match: /^DEBUG:/g
        callback: @processDebug
      }

    ]

  start: ( @clientName = 'cec-client', @params... ) ->

    if @cecName?
      @params.push '-o'
      @params.push @cecName

    @client = spawn( @clientName, @params )
    emitLines( @client.stdout )

    @client.on( 'close', @onClose )

    @client.stdout.on( 'line', (line) =>

      @emit( 'data', line )
      @processLine( line )

    )

  stop: () ->
    @emit( 'stop', @ )
    @client.kill('SIGINT')

  onClose: () =>
    @emit( 'stop', @ )

  send: ( message ) ->
    @client.stdin.write( message )

  sendCommand: ( command... ) ->
    command = command.map( (hex) -> hex.toString(16) )
    command = command.join( ':' )
    @send( 'tx ' + command )

  processLine: ( line ) ->
    @emit( 'line', line )

    for handler in @stdinHandlers

      if handler.contains?
        if line.indexOf( handler.contains ) >= 0
          handler.callback( line )

      else if handler.match?
        matches = line.match( handler.match )
        if matches?.length > 0
          handler.callback( line )

      else if handler.fn?
        if handler.fn( line )
          handler.callback( line )



  # -------------------------------------------------------------------------- #
  #    #DEBUG
  # -------------------------------------------------------------------------- #

  processDebug: ( msg ) =>

    @emit( 'debug', msg )

  # -------------------------------------------------------------------------- #
  #    #TRAFFIC
  # -------------------------------------------------------------------------- #

  processTraffic: ( traffic ) =>
    packet = {}

    @emit( 'traffic', traffic )

    command = traffic.substr( traffic.indexOf(']\t') + 2 ) # "<< 0f:..:.."
    command = command.substr( command.indexOf( ' ' ) + 1 ) # "0f:..:.."

    tokens = command.split(':') # 0f .. ..

    if tokens?
      packet.tokens = tokens

    if tokens?.length > 0
      packet.source = tokens[0][0]
      packet.target = tokens[0][1]

    if tokens?.length > 1
      packet.opcode = parseInt( tokens[1], 16 )
      packet.args = tokens[2..tokens.length].map( (hexString) ->
        parseInt( hexString, 16 )
      )

    @processPacket( packet )


  processPacket: ( packet ) ->

    # no opcode?
    unless packet.tokens?.length > 1
      @emit( 'POLLING', packet )
      return

    switch packet.opcode

      # ---------------------------------------------------------------------- #
      #    #OSD

      when CEC.Opcode.SET_OSD_NAME
        break unless packet.args.length >= 1
        osdname = String.fromCharCode.apply( null, packet.args )
        @emit( 'SET_OSD_NAME', packet, osdname )
        return true



      # ---------------------------------------------------------------------- #
      #    #SOURCE / ADDRESS

      when CEC.Opcode.ROUTING_CHANGE # SOURCE CHANGED
        break unless packet.args.length >= 4
        from = packet.args[0] << 8 | packet.args[1]
        to   = packet.args[2] << 8 | packet.args[3]
        @emit( 'ROUTING_CHANGE', packet, from, to )
        return true

      when CEC.Opcode.ACTIVE_SOURCE
        break unless packet.args.length >= 2
        source   = packet.args[0] << 8 | packet.args[1]
        @emit( 'ACTIVE_SOURCE', packet, source )
        return true

      when CEC.Opcode.REPORT_PHYSICAL_ADDRESS
        break unless packet.args.length >= 2
        source = packet.args[0] << 8 | packet.args[1]
        @emit( 'REPORT_PHYSICAL_ADDRESS', packet, source, packet.args[2] )
        return true

      when CEC.Opcode.DECK_STATUS
        break unless packet.args.length >= 1
        status = packet.args[0] << 8 | packet.args[1]
        @emit( 'DECK_STATUS', packet, status )
        return true

      when CEC.Opcode.REPORT_POWER_STATUS
        break unless packet.args.length >= 1
        status = packet.args[0]
        @emit( 'REPORT_POWER_STATUS', packet, status )
        return true

      when CEC.Opcode.STANDBY
        break unless packet.args.length >= 0
        @emit( 'STANDBY' )
        return true

      when CEC.Opcode.DEVICE_VENDOR_ID
        break unless packet.args.length >= 3
        id = packet.args[0] << 16 | packet.args[1] << 8 | packet.args[2]
        vendor = 'UNKNOWN'
        if id is CEC.VendorId.TOSHIBA
          vendor = 'TOSHIBA'
        else if id is CEC.VendorId.SAMSUNG
          vendor = 'SAMSUNG'
        else if id is CEC.VendorId.DENON
          vendor = 'DENON'
        else if id is CEC.VendorId.MARANTZ
          vendor = 'MARANTZ'
        else if id is CEC.VendorId.SAMSUNG
          vendor = 'SAMSUNG'
        else if id is CEC.VendorId.LOEWE
          vendor = 'LOEWE'
        else if id is CEC.VendorId.ONKYO
          vendor = 'ONKYO'
        else if id is CEC.VendorId.MEDION
          vendor = 'MEDION'
        else if id is CEC.VendorId.TOSHIBA2
          vendor = 'TOSHIBA2'
        else if id is CEC.VendorId.PULSE_EIGHT
          vendor = 'PULSE_EIGHT'
        else if id is CEC.VendorId.HARMAN_KARDON2
          vendor = 'HARMAN_KARDON2'
        else if id is CEC.VendorId.GOOGLE
          vendor = 'GOOGLE'
        else if id is CEC.VendorId.AKAI
          vendor = 'AKAI'
        else if id is CEC.VendorId.AOC
          vendor = 'AOC'
        else if id is CEC.VendorId.PANASONIC
          vendor = 'PANASONIC'
        else if id is CEC.VendorId.PHILIPS
          vendor = 'PHILIPS'
        else if id is CEC.VendorId.DAEWOO
          vendor = 'DAEWOO'
        else if id is CEC.VendorId.YAMAHA
          vendor = 'YAMAHA'
        else if id is CEC.VendorId.GRUNDIG
          vendor = 'GRUNDIG'
        else if id is CEC.VendorId.PIONEER
          vendor = 'PIONEER'
        else if id is CEC.VendorId.LG
          vendor = 'LG'
        else if id is CEC.VendorId.SHARP
          vendor = 'SHARP'
        else if id is CEC.VendorId.SONY
          vendor = 'SONY'
        else if id is CEC.VendorId.BROADCOM
          vendor = 'BROADCOM'
        else if id is CEC.VendorId.VIZIO
          vendor = 'VIZIO'
        else if id is CEC.VendorId.BENQ
          vendor = 'BENQ'
        else if id is CEC.VendorId.HARMAN_KARDON
          vendor = 'HARMAN_KARDON'
        @emit( 'DEVICE_VENDOR_ID', packet, id, vendor )
        return true

      when CEC.Opcode.CEC_VERSION
        break unless packet.args.length >= 1
        version = packet.args[0] << 8 | packet.args[1]
        @emit( 'CEC_VERSION', packet, version )
        return true

      # ---------------------------------------------------------------------- #
      #    #OTHER

      else

        opcodes = CEC.Opcode
        for key, opcode of opcodes when opcode == packet.opcode
          @emit( key, packet, packet.args... ) if key?.length > 0
          return true



    # emit unhandled packet
    @emit( 'packet', packet )

    # not handled
    return false
