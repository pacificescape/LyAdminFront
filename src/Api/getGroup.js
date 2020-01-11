export default async (groupId) => {
    return await fetch(`/api/getGroup/${groupId}`)
    .then(res => res.json())
    .catch((err) => err)
}
