/*
 *  Vercel Serverless Function
 *  @method exports
 *  @param  {Object}  req - includes information about the request
 *  @param  {Function}  res - used to manipulate the response and invoque the vercel callback function 'send()'
 *  @return {Promise}     function with the response object that will be sent to the user
 */
module.exports = (req, res) => res.status(200).send()
