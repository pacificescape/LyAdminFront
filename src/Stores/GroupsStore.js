import { EventEmitter } from 'events'

class GroupsStore extends EventEmitter {
    constructor() {
        super()

        this.reset()
        this.setMaxListeners(Infinity);
    }

    reset = () => {
        this.groups = []
    }

    getUserGroups = async () => {
        return await fetch(`/api/getUserGroups`)
        .then(res => res.json())
        .catch((err) => err)
    }

    getGroup = (groupId) => {
        return this.groups.get(groupId)
    }


}

const store = new GroupsStore()
window.groups = store
export default store
