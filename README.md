# ewelink-serverless-vercel

#### **This is not an official product from eWelink. No data are storage, you can check the code to make sure about it.**

With this lambda you can control ANY sonoff device directly from eWelink cloud using internet instead of intranet, without need to set up your device in DIY mode or use IFTTT.

You can use this lambda easily making `POST` requests to `https://ewelink-one.vercel.app`.

Also, you can found a web client (PWA like) in  `https://ewelink-one.vercel.app`.

---
### Hoppscoth
**[You can use Hoppscoth to test it.](https://hoppscotch.io/?method=POST&url=https://ewelink-one.vercel.app&path=/auth&contentType=application/json&rawParams=%7B%0A%20%20%22ewelink%22:%20%7B%0A%20%20%20%20%22email%22:%20%22your.email@ewelink.com%22,%0A%20%20%20%20%22password%22:%20%22y0urP455w0rd%22%0A%20%20%7D%0A%7D)**

Just donwload this collection file [(hoppscotch-io-collection.json)](https://raw.githubusercontent.com/cyberlabsai/ewelink-serverless-vercel/master/hoppscotch-io-collection.json) and import it as a collection on Hoppscoth. **Easypeasy!**
```
https://hoppscotch.io/
```

---
### AUTH
```
https://ewelink-one.vercel.app/auth
```
##### Request
You need to pass your eWelink `email` and `password`. You can also pass your `region` if your account is not `us` based.
```
{
  "ewelink": {
    "email": "your.email@ewelink.com",
    "password": "y0urP455w0rd"
  }
}
```

##### Response
You will receive an `accessToken`, save it to make future requests.
```
{
  "ewelink": {
    "accessToken": "XXXxXXXxXXXxXXXXxXXXXxXXXXxXXXXxXXXxXXX"
  }
}
```

---
### Get my devices
```
https://ewelink-one.vercel.app/devices
```
##### Request
Just pass the `accessToken` to get a list of your `devices`. You can also pass your `region` if your account is not `us` based.
```
{
  "ewelink": {
    "accessToken": "XXXxXXXxXXXxXXXXxXXXXxXXXXxXXXXxXXXxXXX"
  }
}
```

##### Response
You will receive an Array with the `name` and the `deviceID`, take the `deviceID` that you want to make future requests.
```
{
  "ewelink": {
    "accessToken": "XXXxXXXxXXXxXXXXxXXXXxXXXXxXXXXxXXXxXXX",
    "devices": [
      {
        "name": "Tomada Rack",
        "deviceID": "0000xxxxxx"
      },
      {
        "name": "Interruptor Sala",
        "deviceID": "0000xxxxxx"
      },
      {
        "name": "Luz da entrada",
        "deviceID": "0000xxxxxx"
      },
      {
        "name": "Luzes da sala",
        "deviceID": "0000xxxxxx"
      }
    ]
  }
}
```

---
### Set device state
```
https://ewelink-one.vercel.app/action
```
##### Request
Pass the `accessToken` and the `deviceID` to `toggle` the power state of your device. You can pass `channel` and `state` (`on`, `off` or `toggle`) if you preffer to better control your request but it's optional. You can also pass your `region` if your account is not `us` based.
```
{
  "ewelink": {
    "accessToken": "XXXxXXXxXXXxXXXXxXXXXxXXXXxXXXXxXXXxXXX",
    "deviceID": "0000xxxxxx"
  }
}
```

##### Response
If everything works correctly, you will receive an Object with the response `status` 'ok', the `state` that was executed and the channel (if have one).
```
{
  "ewelink": {
    "deviceID": "0000xxxxxx",
    "status": "ok",
    "state": "toggle",
    "channel": ""
  }
}
```
