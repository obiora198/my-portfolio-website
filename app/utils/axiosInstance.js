import axios from 'axios'

const AxiosInstance = axios.create({
  baseURL: '/api/vtu',
})

AxiosInstance.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default AxiosInstance
