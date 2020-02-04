export default async () => {
    return await fetch(`/api/getUserGroups`, {
        'Content-Type': 'application/json',
        credentials: 'same-origin'
    })
        .then(res => res.json())
        .catch((err) => err)
}
