export default async (groupId) => {
    return await fetch(`/api/getGroup/?group_id=${groupId}`)
    .then(res => res.json())
    .catch((err) => err)
}
