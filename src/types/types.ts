// Groups

export type MessageType = {
    message_id: number
    from: {
        id: number
        is_bot: boolean
        first_name: string
        username: string
    }
    chat: {
        id: number
        title: string
        type: string // 'supergoup' | 'private'
    }
    date: number
    text: string
    entities: Array<EntityType>
}

export type EntityType = {
    offset: number
    length: number
    type: string // 'url'
}

export type GroupType = {
    id: number
    title: string
    type: string // 'supergoup' | 'private'
    description: string
    premissions: {
        can_send_messages: boolean
        can_send_media_messages: boolean
        can_send_polls: boolean
        can_send_other_messages: boolean
        can_add_web_page_previews: boolean
        can_change_info: boolean
        can_invite_users: boolean
        can_pin_messages: boolean
    }
    photo: {
        small_file_id: string
        small_file_unique_id: string
        big_file_id: string
        big_file_unique_id: string
    }
    pinned_message: MessageType
}

export type InitialStateType = {
    groups: Record<string, GroupType>;
    settings: object;
    ids: Array<any>;
    isFetchingSettings: boolean;
}
