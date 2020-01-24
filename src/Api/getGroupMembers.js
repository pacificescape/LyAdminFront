export default async (groupId, offset = 0) => {
    return await fetch(`/api/getGroupMembers`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_id: groupId, offset })
    })
    .then(res => res.json())
    .catch((err) => err)
}
