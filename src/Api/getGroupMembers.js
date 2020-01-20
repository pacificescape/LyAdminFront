export default async (groupId) => {
    return await fetch(`/api/getGroupMembers`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_id: groupId })
    })
    .then(res => res.json())
    .catch((err) => err)
}
