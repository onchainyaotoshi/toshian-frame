/** @jsxImportSource frog/jsx */

import { Button, FrameContext, FrameResponse, Frog, TextInput } from 'frog'
import { handle } from 'frog/next'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { type TypedResponse } from "../../../node_modules/frog/types/response.js";
import { Box, Text, vars } from '../../utils/ui'

import ABI from "../../utils/blackjack/Blackjack.json";
const CA = "0x75cE58A551ee3A5f4bf66d8209FAf637bc342835";

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  ui: { vars },
  // Supply a Hub API URL to enable frame verification.
  // hubApiUrl: 'https://api.hub.wevm.dev',
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', async (c) => {
  const { buttonValue, transactionId  } = c
  
  if(transactionId !== undefined){
    return await startGame(c);
  }

  if(buttonValue == 'enter-game'){
    return await enterGame(c);
  }

  return c.res({
    image: (
      <Box grow alignHorizontal='center' alignVertical='center'>
        <Text>Onchain Blackjack Game</Text>
      </Box>
    ),
    intents: [
      <Button value="enter-game">Les Goh</Button>,
    ],
  })
});

app.transaction('/start-game', (c) => {
  // Send transaction response.
  return c.contract({
    abi:ABI,
    to: CA,
    chainId: 'eip155:84532',
    functionName: 'startGame',
    args:["0xe35A7b98Ec49BEA2Fe5218F886b4c5404b3DAaF8",1000*(10^18)]
  })
});

async function enterGame(c:FrameContext): Promise<TypedResponse<FrameResponse>>{
  return c.res({
    image: (
      <Box grow alignHorizontal='center' alignVertical='center'>
        <Text>Place your bet</Text>
      </Box>
    ),
    intents: [
      <Button.Transaction target="place-bet">Place Bet</Button.Transaction>,
    ],
  })
}

async function startGame(c:FrameContext): Promise<TypedResponse<FrameResponse>>{
  
  const { transactionId  } = c
  
  return c.res({
    image: (
      <Box grow alignHorizontal='center' alignVertical='center'>
        <Text>{`Transaction Id: ${transactionId}`}</Text>
      </Box>
    ),
    intents: [
      <Button.Transaction target="hit">Hit</Button.Transaction>,
      <Button.Transaction target="stand">Stand</Button.Transaction>,
      <Button.Transaction target="double-down">Double</Button.Transaction>,
      <Button.Transaction target="buy-insurance">Insurance</Button.Transaction>,
    ],
  })
}

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
