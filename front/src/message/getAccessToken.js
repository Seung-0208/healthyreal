//모듈화하여 export한 함수 (브라우저 환경에서 호출 불가)
const { google } = require('googleapis')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const getAccessToken = () => { //구글 api 사용을 위한 토큰
  return new Promise((resolve, reject)=>{
    //const key = JSON.parse(data)
    const key = require('../@core/service-account.json')
    
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null,
    )

    jwtClient.authorize((err, token)=>{
      if(err) {
        reject(err)
        
        return
      }
      resolve(token.access_token)
    })
  })
}

module.exports = {
  getAccessToken: getAccessToken,
}
