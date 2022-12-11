type MediaType = "image" | "video";

type User = {
  id: string;
  username: string;
}
type Post = {
  id: string;
  image: string;
  likedBy: {[userId: string]: User};
  caption: string;
  liked: boolean
};
