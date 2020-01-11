export default async () => {
    return await fetch(`/api/getUserGroups`)
    .then(res => res.json())
    .catch((err) => err)
}
