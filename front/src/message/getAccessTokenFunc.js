import { google } from 'googleapis'

//브라우저 환경에서 호출하기 위한 용도

// const { google } = require('googleapis')


export const getAccessToken = () => { //구글 api 사용을 위한 토큰
  const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
  const SCOPES = [MESSAGING_SCOPE]
  
  return new Promise((resolve, reject)=>{
    //const key = JSON.parse(data)
    const key = require('../@core/service-account.json')

    console.log('google', google)

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
