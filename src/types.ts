export type Post = {
    id: string
    created_at: string
    likes: number
    nr_of_comments: number
    image_url: string | null
    content: string | null
    user: User
    liked_by_me: boolean
}

export type Comment = {
    id: string
    post_id: string
    user_id: string
    parent_id: string | null
    content: string 
    created_at: string
    user: User
}

export type User ={
    id: string
    name: string
    image: string | null
}

export type Ride = {
  id: string;
  origin: string;
  destination: string;
  ride_date: string;
  ride_time: string;
  seats: number;
  price: number;
};