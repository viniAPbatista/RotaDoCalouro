export type Post = {
    id: string
    created_at: string
    likes: number
    nr_of_comments: number
    image_url: string | null
    content: string | null
    user: User
}

export type Comment = {
    id: string
    post_id: string
    user_id: string
    parent_id: string | null
    comment: string 
    created_at: string
    user: User
}

export type User ={
    id: string
    name: string
    image: string | null
}