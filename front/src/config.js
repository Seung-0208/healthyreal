import axios from '@axios'

// API Base URL 환경별 설정
export const API_BASE_URL = import.meta.env.VITE_BASE_URL

export const API_FLASK_BASE_URL = import.meta.env.VITE_API_FLASK_BASE_URL

export var config = {
  vapidKey: "BIa23R2xZe0qRZYDcY5aXlxcBOFiujw7Vs-RLTPwEjQqmXAFgXNjRfWjBrjN_E0WWg6yUMmXncdutQN8zG6x2wY",
  google_key: "",
  apiBaseUrl: API_BASE_URL,  // 다른 곳에서 사용 가능
}

export function getGoogleKey() {
  return new Promise((resolve, reject)=>{
    //구글 api 서버 키 불러오기
    axios.get("/get/fmctoken", { params: {
      id: "google",
    } })
      .then(res=>{
        console.log(res.data)
        config.google_key = res.data
        resolve(res.data)
      })
      .catch(err=>{
        reject(err)
      })
  })

}

export const firebaseConfig = {
  apiKey: "AIzaSyDaoRQlGo6oghhkTmRIqrqEPWofr1BSm9E",
  authDomain: "webpushtest-c99b3.firebaseapp.com",
  projectId: "webpushtest-c99b3",
  storageBucket: "webpushtest-c99b3.appspot.com",
  messagingSenderId: "992191789757",
  appId: "1:992191789757:web:5c7cbed7fbfccf2355d5d4",
  measurementId: "G-N7SX341HTV",
}


//export const google_key = "Bearer ya29.c.c0AY_VpZi_leBKEsJCIvWsvAf4LohSylHiw37Wojxf57I-onStSxs9GlX022Xeh6yIDynF28u1K1pZeql0Q5Dydn2IPILBXggLfLU2LnLN4Zn_HH3M4QxpVOCyzCxA3VUTv1Tc0VNuQsZOXEI3dmJ4-VA-7hfDGBVcaj2FlU7Syrogyfg2tDs_Qj3bmisWTHBVACbKywL6PXYwibagIweEZaEGU4dexSyNYs3GlIYnSDjBMGg1mQSfulMnkHZhPimJUBNHjC65yMuErHQklvO64ITkkgiLSRtZyK3mD-PAg6OSSefw936BocdzvvhhAmfaA9iw53jkWY7nMDReFE81-fDuPQ4t5JRhPAQzAfveHYV76BVyy35YfFzzL385C_n-h-oq8brwdlUwRxt73efQoi5BI_x9X4Y99zYzeF_Z3IFJIqxIflkhm1ndSik0F1quRjne56f5IsgB0MRig6Qjn0XqR7p7mwOSbpZ3b8kmwJO20eyV0_5oWz3IhileOeVlBqMdnBjkIJmUiSU5VoJRoiZRaMOiMstQ7fjbyeixeonteq2xRRM0MwRbgahlwslOfiaf8YMof1BIhJgt4xQM60MFQBi2xzrObVc12YVFg1xIJtlbp0Z67imUFWOdj3rVO-1rkV3pkrs-zwZVrI3RZOnWg8_01FYpfpRbF4lvBv9bJipmvea30ljlxBsh_V3IZ4tZf9Su8R7ZxzkF7kIk_nY2p-_vBQgc5J8BhXxW9MYFQjmMorF_Jh_3bbcp_7Xwvq8xrMFuvMBtmjog1ZJogWfyeIbvFydUVfzr37aviwMl_zByy3hgoz8dfZzjn4QX5XYcjjJpaSpjXMSV1rzcMUyqa3Fhu-ykwbldzeteUvgrQa5mX-uiQpB0Jk8271JBSj1-cdrmzSYvoboRMjuJ7OkY52Jsn1ivodyoRg_MMarpdFvUenZ9OBkgBZR2W0mluQUMfy3dyxxwwqIV6UX2d6faMioiba54vXhySy727kvwfRInR0RgFrf"
