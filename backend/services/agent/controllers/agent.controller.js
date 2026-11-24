import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"

export const agentController=async (req,res,next) => {
    try {
        const {prompt,conversationId,agent}=req.body
        const file=req.file

        const userId=req.headers["x-user-id"]
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{ // saving the user prompt to memory
            conversationId,
            role:"user",
            content:prompt
        })

        const result=await graph.invoke({ // invoking the graph with the user prompt, conversation id, agent, user id, and file
            prompt,
            conversationId,
            agent,
            userId,
            file 
        })

        await addMessage(conversationId,"user",prompt)  // saving the user prompt to memory
        await addMessage(conversationId,"assistant",result.aiResponse) // saving the AI response to memory

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{ //
            conversationId,role:"assistant",content:result?.aiResponse,images:result?.images,artifacts:result?.artifacts
        })

        return res.status(200).json({ // returning the AI response, images, and artifacts to the client
            answer:result?.aiResponse,
            images:result?.images,
            artifacts:result?.artifacts
        })
       
    } catch (error) {
       next(error)
    }
}