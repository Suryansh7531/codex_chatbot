import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      // prompt: `hello`,//shown error 429
      prompt: `${prompt}`,
      temperature: 0.5,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
    // console.log(response.data);  
  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

// console.log(response.data);

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))