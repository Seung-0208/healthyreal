const { getAccessToken } = require('./getAccessToken')
const axios = require('axios')
const cron = require('node-cron')


getAccessToken().then(token=>{

  const FCM_API_URL = 'https://fcm.googleapis.com//v1/projects/webpushtest-c99b3/messages:send'

  const SERVER_KEY = `Bearer ${token}`//`bearer ${token}`

  console.log("SERVER_KEY:", SERVER_KEY)
  
  axios.post("/fmctoken", JSON.stringify({
    id: "google",
    token: SERVER_KEY,
  }), { headers: { 'Content-Type': 'application/json' } })
    .catch(err=>console.log(err))

  //백그라운드 상태에서 오는 알림
  //onBackgroundMessage 함수를 이용해 백그라운드 메시지가 등록되는 것 같은데
  //아래의 코드는 background Message로 등록되어 있지 않음에도 왜 백그라운드 상태일 때 호출되는 것인지
  //이유는 아직 찾지 못함
  const message = {
    "message": {
      //"token": "e8GiH-XuS33mVAWgbK0O-A:APA91bFvh7dKjEAzxqdzdjr6xZBp3IaINrmEBU7y5C7A9-0UMdccwjTRZPaOBdAwDfGZgA0oZ4G0E1-G6f7B8iv6AbCA2BkC4Dn1x4ymnv0SwlX_xNRWPFtX0WRbaeRJnGdCvyndwN3z",
      "token":"ftOmOZOAqGa_DOsjwi-7yU:APA91bHu8vKiw2GzsA4S6pyiUkdHDGaNaMmse07Ck0ZsR7mCnTUthnFn1wSkCEslReSmmmRgyz-FzFKJF5dWq5fdFe6DW1CVPZ2sNKsF1mPNHXIKjP1ZDcwTGkZiSdv54kZQVoI1IELT",
      "notification": { 
        "title": "HelloWorld!!!",
        "body": "이제 쫌 돼라",
      },
      "webpush": { 
        "fcm_options": {
          "link": "https://dummypage.com",
        },
      },
    },
  }
  
  const sendMessage = () => { //알림 요청 보내는 부분
    // axios.post(FCM_API_URL, message, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': SERVER_KEY,
    //   },
    // },
    // ).then(resp=>console.log(resp.data))
    //   .catch(err => console.log(err))
  }
  
  cron.schedule("* * * * *", sendMessage)
})


