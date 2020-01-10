import { EventEmitter } from 'events'

class AuthStore extends EventEmitter {
    constructor() {
        super()

        this.reset()
    }

    reset = () => {
        this.isAuth = false
        this.isLoading = true
    }

    auth = () => {
        this.isAuth = true
    }

}

const store = new AuthStore()
window.auth = store
export default store
