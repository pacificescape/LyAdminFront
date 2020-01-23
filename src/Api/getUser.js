export default async (userId) => {
    return await fetch(`/api/getUser/?user_id=${userId}`)
    .then(res => res.json())
    .catch((err) => err)
}
