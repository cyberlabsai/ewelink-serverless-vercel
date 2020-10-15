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

  if (!accessToken) {
    return res.send({
      ewelink: {
        status: 'error',
        message: 'You must offer a valid Access Token'
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
    at: accessToken,
    region
  })

  /*  If the connection is successful, get all devices from the user
   *  The response contain a lot information about the devices, but in this case we only want the 'name' and 'deviceID' to make futurue requests
   */
  const devices = await connection.getDevices()

  /*  Clean the device list to get only the 'name' and 'deviceid' from devices  */
  const devicesList = devices
    .map(
      ({ name, deviceid }) => ({
        name,
        deviceID: deviceid
      })
    )

  /*  Send the response to the user including the Access Token and all your filtered devices  */
  return res.send({
    ewelink: {
      status: 'success',
      devices: devicesList
    }
  })
}
