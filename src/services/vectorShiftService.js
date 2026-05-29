import axios from 'axios'

const VECTORSHIFT_URL = 'https://api.vectorshift.ai/v1/pipeline/6a18d98e001ef2c6ba628330/run'

const TOKEN = import.meta.env.VITE_VECTORSHIFT_API_KEY

export const consultarVectorShift = async (pregunta) => {
  const respuesta = await axios.post(
    VECTORSHIFT_URL,
    {
      inputs: {
        pregunta: {
          description: pregunta,
          ioType: 'string'
        }
      }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return respuesta.data
}