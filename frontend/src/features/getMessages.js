import api from '../../utils/axios'

async function getMessages(id) {
    try {
        const {data}=await api.get(`/api/chat/get-messages/${id}`)
        return data
    } catch (error) {
        return []
    }
}
export default getMessages