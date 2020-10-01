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
  const email = req.body.ewelink.email
  const password = req.body.ewelink.password
  const region = req.body.ewelink.region || 'us'

  if (!email ||
      !password) {
    return res.send({
      ewelink: {
        status: 'error',
        message: 'You must offer your User and Password to get an Access Token'
      }
    })
  }

  /*
   *  Create eWelink API connector
   *  @param  {String}  email - required
   *  @param  {String}  password - required
   *  @param  {String}  region - optional from user, default from this function is 'us'
   *  @type {ewelink}
   */
  const connection = new ewelink({
    email,
    password,
    region
  })

  /*
   *  Try get credencials from eWelink API
   *  The response contain a lot information about the user, but in this case we only want the 'at' (Access Token) to make futurue requests
   */
  const login = await connection.getCredentials()

  const accessToken = login.at

  if (!accessToken) {
    return res.send({
      ewelink: {
        status: 'error',
        message: 'Verify your email, password or region'
      }
    })
  }

  /*  Send the response to the user including the Access Token and the region of there account  */
  return res.send({
    ewelink: {
      status: 'success',
      accessToken
    }
  })
}
