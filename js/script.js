var app = new Vue({
  el: '#app',
  data: {
    loading: false,
    error: false,
    title: '',
    button: 'List My Devices',
    email: '',
    password: '',
    region: 'us',
    internalRoute: '/auth',
    accessToken: '',
    devices: [],
    device: {},
    actionCode: ''
  },
  created () {
    new ClipboardJS('.code')
  },
  mounted () {},
  methods: {
    doPromiseMaker (promise) {
      if (!promise) {
        return
      }

      try {
        return promise
          .then(
            data => (
              [
                data,
                undefined
              ]
            )
          )
          .catch(
            error => (
              [
                undefined,
                error
              ]
            )
          )
      } catch (error) {
        return (
          [
            undefined,
            error
          ]
        )
      }
    },
    doMakeRequests ({ url, data }) {
      return this.doPromiseMaker(
        axios({
          method: 'POST',
          url,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          data
        })
      )
    },
    doVerifyResponse (requester) {
      const [
        response,
        error
      ] = requester

      if (!response ||
          error) {
        return [
          undefined,
          error
        ]
      }

      const ewelink = response.data.ewelink

      if (!ewelink ||
          !ewelink.status ||
          ewelink.status === 'error' ) {
        return [
          undefined,
          ewelink
        ]
      }

      return [
        ewelink,
        undefined
      ]
    },
    async doStart () {
      this.loading = true
      this.error = false
      this.button = 'Loading...'

      const login = await this.doMakeLogin()

      if (!login) {
        return
      }

      this.doGetMyDevices()
    },
    async doMakeLogin () {
      this.accessToken = ''
      this.internalRoute = '/auth'

      const [
        response,
        error
      ] = await this.doVerifyResponse(
        await this.doMakeRequests({
          url: '/auth',
          data: {
            ewelink: {
              email: this.email,
              password: this.password,
              region: this.region
            }
          }
        })
      )

      if (error) {
        this.loading = false
        this.error = true
        this.button = error.message
        return false
      }

      this.accessToken = response.accessToken
      return true
    },
    async doGetMyDevices () {
      this.loading = false
      this.error = false

      const [
        {
          devices
        },
        error
      ] = await this.doVerifyResponse(
        await this.doMakeRequests({
          url: '/devices',
          data: {
            ewelink: {
              accessToken: this.accessToken
            }
          }
        })
      )

      if (error) {
        this.loading = false
        this.error = true
        this.button = error.message
        return false
      }

      this.button = 'Refresh Devices'
      this.internalRoute = '/devices'
      this.devices = devices
    },
    doRefreshDevices () {
      this.devices = []
      this.loading = true
      this.error = false
      this.button = 'Loading...'
      this.doGetMyDevices()
    },
    doSelectDevice (name, deviceID) {
      this.loading = false
      this.error = false
      this.internalRoute = '/action'

      this.device = {
        name,
        deviceID,
        accessToken: this.accessToken,
        channel: '',
        state: ''
      }
    },
    doFormatDevice () {
      const code = {
        ewelink: {
          ...this.device,
          name: undefined
        }
      }

      this.actionCode = JSON.stringify(code, null, 2)
    },
    async doMakeAction () {
      this.loading = true
      this.error = false
      this.button = 'Loading...'

      const [
        response,
        error
      ] = await this.doVerifyResponse(
        await this.doMakeRequests({
          url: '/action',
          data: JSON.parse(this.actionCode)
        })
      )

      if (error) {
        this.loading = false
        this.error = true
        this.button = error.message
        return false
      }

      this.button = 'Success!'

      setTimeout(() => {
        this.button = 'Set New State'
      }, 2000)
    }
  },
  watch: {
    internalRoute: {
      handler (route) {
        switch (route) {
        case '/auth':
          this.title = 'Please insert your email, password and region to start'
          break
        case '/devices':
          this.title = 'Select the device that you want set a new power state'
          this.button = 'Refresh Devices'
          if (!this.devices.length) {
            this.doGetMyDevices()
          }
          break
        case '/action':
          this.title = 'Set a new power state to this device'
          this.button = 'Set New State'
          this.doFormatDevice()
          break
        }
      },
      immediate: true
    },
    device: {
      handler (change) {
        this.doFormatDevice()
      },
      deep: true,
      immediate: true
    }
  }
})
