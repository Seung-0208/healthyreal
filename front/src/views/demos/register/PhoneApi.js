


const { Coolsms } = require('coolsms-node-sdk')

const apiKey = 'NCSJU8DA6AAFLB0Z'
const apiSecret = 'VWHTOXKCBC6RCXULZ4PAKDOMBZCL6QIR'

const coolsms = new Coolsms({ apiKey, apiSecret })

async function sendSMS(sender, receiver, message) {
  try {
    const response = await coolsms.send({
      messages: [
        {
          to: receiver,
          from: sender,
          text: message,
        },
      ],
    })

    console.log('SMS 발송 성공:', response)
  } catch (error) {
    console.error('SMS 발송 실패:', error)
  }
}

// 사용 예시
const sender = '01012345678' // 발신자 번호
const receiver = '01098765432' // 수신자 번호
const message = '안녕하세요. SMS 발송 테스트입니다.' // 발송할 메시지

sendSMS(sender, receiver, message)
