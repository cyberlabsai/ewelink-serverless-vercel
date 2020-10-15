const ewelink = require('ewelink-api')

/*
 *  Vercel Serverless Async Function
 *  @method exports
 *  @param  {Object}  req - includes information about the request, in the key 'body' you will find all about the payload offered by the user
 *  @param  {Function}  res - used to manipulate the response and invoque the vercel callback function 'send()'
 *  @return {Promise}     function with the response object that will be sent to the user
 */
module.exports = async (req, res) => {
  /*  Try get mandatory data from 'body'  */
  const accessToken = req.body.ewelink.accessToken
  const region = req.body.ewelink.region || 'us'
  const deviceID = req.body.ewelink.deviceID
  const channel = req.body.ewelink.channel || ''
  const state = req.body.ewelink.state || 'toggle'
  const apiKey = req.body.ewelink.apiKey || undefined

  if (!accessToken ||
      !deviceID) {
    return res.send({
      ewelink: {
        status: 'error',
        message: 'You must offer a valid Access Token and Device ID'
      }
    })
  }

  /*
   *  Create eWelink API connector
   *  @param  {String}  at (accessToken) - required
   *  @param  {String}  region - optional from user, default from this function is 'us'
   *  @type {ewelink}
   */
  const connection = new ewelink({
    apiKey,
    at: accessToken,
    region
  })

  /*
   *  If user not pass an apiKey and connection is successful, get 'deviceID', 'state' and 'channel' from user's 'body' payload and set the new state to the selected device
   *  @param  {String}  deviceID - required
   *  @param  {String}  state - optional from user, the default from this function is 'toggle'
   *  @param  {String}  channel - optional from user, default from this function is '' (blank)
   */
  if (!apiKey) {
    const response = await connection.setDevicePowerState(deviceID, state, channel)

    /*  Send the response to the user  */
    return res.send({
      ewelink: {
        deviceID,
        ...response
      }
    })
  }

  /*
   *  login into eWeLink to get all necessary credentials to connect using WebSocket
   */
  await connection.getCredentials()

  try {
    /*
     *  open WebSocket
     */
    const socket = await connection.openWebSocket(async data => {
      /*
       *  data is the response from eWeLink WebSocket Cloud
       */
      if (data.error) {
        return res.send({
          ewelink: {
            deviceID,
            error: 'Unable to open connection with eWeLink, verify your credentials and try again'
          }
        })
      }

      /*
       *  If the connection is successful, get 'deviceID', 'state' and 'channel' from user's 'body' payload and set the new state to the selected device
       *  @param  {String}  deviceID - required
       *  @param  {String}  state - optional from user, the default from this function is 'toggle'
       *  @param  {String}  channel - optional from user, default from this function is '' (blank)
       */
      const status = await connection.setWSDevicePowerState(deviceID, state, { channel })

      /*  Send the response to the user  */
      return res.send({
        ewelink: {
          deviceID,
          ...status
        }
      })
    })
  } catch (err) {
    return res.send({
      ewelink: {
        deviceID,
        ...err
      }
    })
  }

}
