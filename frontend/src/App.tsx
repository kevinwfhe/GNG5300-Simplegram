import React, { useEffect, useRef, useState } from "react";
import {
  Frame,
  Page,
  EmptyState,
  Button,
  Modal,
  Stack,
  TextContainer,
  TextField,
  ButtonGroup,
  DropZone,
} from "@shopify/polaris";
import {
  ImageCard,
  TopBar,
  MemoizedSkeletonCard,
  createMasonryItem,
  ResponsiveMasonry,
} from "./components";
import { useAnimateOnScroll } from "./hooks";
// import { getImages } from './api';
import { APP_BANNER } from "./images";
import { Planet } from "./icons";
import { useQuery, gql, useMutation } from "@apollo/client";
import { cloneDeep } from "lodash";

const signUp = gql`
  mutation userSignUp($username: String!, $password: String!) {
    userRegister(username: $username, password: $password) {
      ok
    }
  }
`;

const login = gql`
  mutation tokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      payload
    }
  }
`;

const logout = gql`
  mutation {
    deleteTokenCookie {
      deleted
    }
  }
`;

const getPosts = gql`
  query {
    listPost {
      id
      image
      caption
      liked
      likedBy {
        id
        username
      }
      creator {
        username
      }
    }
  }
`;

const likePost = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      ok
      user {
        id
        username
      }
    }
  }
`;

const createPost = gql`
  mutation createPost($base64Image: String!, $caption: String) {
    createPost(base64Image: $base64Image, caption: $caption) {
      ok
    }
  }
`;

// HOC wrap ImageCard and SkeletonCard with a Masonry item
const MasonryItemImageCard = createMasonryItem("li", ImageCard);
// use memoized component since the Skeleton will only render once
const MasonryItemSkeletonCard = createMasonryItem("li", MemoizedSkeletonCard);

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [emptyState, setEmptyState] = useState(false);
  const [bannerHeaderTransform, setBannerHeaderTransform] =
    useState<string>("");
  const [bannerHeaderOpacity, setBannerHeaderOpacity] = useState(1);
  const [showTopbarSubtitle, setShowTopbarSubtitle] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [likePostMutate] = useMutation(likePost);
  const [loginMutate] = useMutation(login);
  const [logoutMutate] = useMutation(logout);
  const [signUpMutate] = useMutation(signUp);
  const [createPostMutate] = useMutation(createPost);

  /**
   * Logic for setting loading indicator and send request
   */
  // const loadImages = async () => {
  //   setLoading(true);
  //   const dataWithLiked = await getImages();
  //   setTimeout(() => {
  //     setImages([...images, ...dataWithLiked]);
  //     setLoading(false);
  //   }, 2000); // Delay 2 seconds To address the loading state
  // };
  const getPostsQuery = useQuery(getPosts);

  useEffect(() => {
    if (getPostsQuery.data?.listPost) {
      const tempPosts = getPostsQuery.data?.listPost.map((post: any) => {
        const likedBy: { [userId: string]: User } = {};
        post.likedBy.forEach((user: User) => {
          likedBy[user.id] = user;
        });
        return {
          ...post,
          likedBy,
        };
      });
      setPosts(tempPosts);
    }
  }, [getPostsQuery.data]);

  /**
   * Logic for setting empty state when component mounted and retry
   */
  // const initialLoadImages = async () => {
  //   try {
  //     setEmptyState(false); // Always set to false before loading images
  //     await loadImages();
  //   } catch (error) {
  //     const err = error as AxiosError;
  //     if (err.response && err.response.status === 500) {
  //       setEmptyState(true); // Show empty state when api fails
  //     }
  //     setLoading(false);
  //   }
  // };

  /**
   * Initial data fetching
   */
  useEffect(() => {}, []);
  /**
   * Scroll event handler
   * @param e Scroll event
   * @returns The dimension properties used in the animations
   */
  function handleOnScroll(): { [key: string]: any } | undefined {
    const rect = bannerRef?.current?.getBoundingClientRect();
    if (rect) {
      const { bottom, height } = rect;
      // the percentage of the invisible part of the banner;
      // goes from 0% to 100%
      const bannerOutPercentage = 1 - (bottom - 70) / height;
      // TODO: replace 70px with the real height of the topbar
      return {
        bannerOutPercentage,
        bannerHeight: height,
      };
    }
    return undefined;
  }

  useAnimateOnScroll(handleOnScroll, (timestamp, animationProps) => {
    if (animationProps) {
      const { bannerOutPercentage, bannerHeight } = animationProps;
      // modify the transform property and opacity of the banner header
      setBannerHeaderTransform(
        `translateY(${bannerOutPercentage * 0.4 * bannerHeight}px) scale(${
          bannerOutPercentage > 0.2 ? -0.5 * bannerOutPercentage + 1.1 : 1
        })`
      );
      setBannerHeaderOpacity(
        bannerOutPercentage > 0.6 ? -2.5 * bannerOutPercentage + 2.5 : 1
      );
      // set the classname of topbar subtitle
      setShowTopbarSubtitle(bannerOutPercentage > 0.8);
    }
  });

  /**
   * Like or Unlike the Image
   * @param index target index in the images Array
   */
  const likedImage = React.useCallback(
    (index: number, id: string) => {
      likePostMutate({ variables: { postId: id } }).then((res) => {
        if (res.data.likePost.ok) {
          const { user } = res.data.likePost;
          setPosts((prevPosts) => {
            const tempPosts = cloneDeep(prevPosts);

            if (tempPosts[index].liked) {
              delete tempPosts[index].likedBy[user.id];
            } else {
              tempPosts[index].likedBy[user.id] = user;
            }
            tempPosts[index].liked = !tempPosts[index].liked;
            return tempPosts;
          });
        }
      });
    },
    [likePostMutate, setPosts]
  );

  const onLogout = () => {
    logoutMutate().then(() => {
      localStorage.removeItem("user");
      window.location.reload();
    });
  };

  const renderTopbar = () => {
    const user = localStorage.getItem("user");
    const loginStatus = user ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "300px",
          justifyContent: "space-between",
        }}
      >
        <span style={{ margin: "0 25px" }}>{JSON.parse(user).username}</span>
        <Button plain onClick={onLogout}>
          Logout
        </Button>
      </div>
    ) : (
      <ButtonGroup segmented>
        <Button onClick={() => setLoginModalOpen(true)}>Login</Button>
        <Button onClick={() => setSignUpModalOpen(true)}>Sign Up</Button>
      </ButtonGroup>
    );
    return (
      <TopBar
        title="Simple Instagram"
        subtitle="GNG 5300 Individual Project"
        showSubtitle={showTopbarSubtitle}
        user={loginStatus}
      />
    );
  };

  const bannerMarkup = (
    <div ref={bannerRef} className="banner">
      <h1
        style={{
          transform: bannerHeaderTransform,
          opacity: bannerHeaderOpacity,
        }}
      >
        GNG 5300 Individual Project
      </h1>
      <img src={APP_BANNER} alt="A starring universe" />
    </div>
  );

  const signUpModal = (
    <Modal
      small
      open={signUpModalOpen}
      onClose={() => setSignUpModalOpen(false)}
      title="Sign Up"
      primaryAction={{
        content: "Sign Up",
        onAction: () => {
          signUpMutate({
            variables: {
              username,
              password,
            },
          }).then((res) => {
            if (res.data.userRegister.ok) {
              setLoginModalOpen(true);
              setSignUpModalOpen(false);
              localStorage.setItem(
                "user",
                JSON.stringify(res.data.tokenAuth.payload)
              );
              window.location.reload();
            } else {
              // prompt()
            }
          });
        },
      }}
    >
      <Modal.Section>
        <Stack vertical>
          <Stack.Item>
            <TextContainer>
              <p>Sign up to post and like your favourite posts.</p>
            </TextContainer>
          </Stack.Item>
          <Stack.Item fill>
            <TextField
              // ref={node}
              label="Username"
              // onFocus={handleFocus}
              value={username}
              onChange={(value) => setUsername(value)}
              autoComplete="off"
            />
          </Stack.Item>
          <Stack.Item fill>
            <TextField
              // ref={node}
              label="Password"
              // onFocus={handleFocus}
              value={password}
              onChange={(value) => setPassword(value)}
              autoComplete="off"
            />
          </Stack.Item>
        </Stack>
      </Modal.Section>
    </Modal>
  );

  const loginModal = (
    <Modal
      // activator={activator}
      small
      open={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      title="Sign In"
      primaryAction={{
        content: "Sign In",
        onAction: () => {
          loginMutate({
            variables: {
              username,
              password,
            },
          }).then((res) => {
            if (res.data.tokenAuth.token) {
              setLoginModalOpen(false);
              localStorage.setItem(
                "user",
                JSON.stringify(res.data.tokenAuth.payload)
              );
              window.location.reload();
            }
          });
        },
      }}
    >
      <Modal.Section>
        <Stack vertical>
          <Stack.Item>
            <TextContainer>
              <p>Sign in to post and like your favourite posts.</p>
            </TextContainer>
          </Stack.Item>
          <Stack.Item fill>
            <TextField
              // ref={node}
              label="Username"
              // onFocus={handleFocus}
              value={username}
              onChange={(value) => setUsername(value)}
              autoComplete="off"
            />
          </Stack.Item>
          <Stack.Item fill>
            <TextField
              // ref={node}
              label="Password"
              // onFocus={handleFocus}
              value={password}
              onChange={(value) => setPassword(value)}
              autoComplete="off"
            />
          </Stack.Item>
        </Stack>
      </Modal.Section>
    </Modal>
  );

  const postModal = (
    <Modal
      small
      open={postModalOpen}
      onClose={() => setPostModalOpen(false)}
      title="Post"
      primaryAction={{
        content: "Post",
        disabled: image === null,
        onAction: () => {
          if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
              createPostMutate({
                variables: {
                  base64Image: reader.result,
                  caption: imageCaption,
                },
              }).then((res) => {
                if (res.data.createPost.ok) {
                  setPostModalOpen(false);
                  window.location.reload();
                }
              });
            };
            reader.readAsDataURL(image);
          }
        },
      }}
    >
      <Modal.Section>
        <Stack vertical>
          <DropZone
            accept=".jpg"
            errorOverlayText="File type must be jpg"
            type="file"
            onDrop={(files) => {
              const file = files[0];
              setImage(file);
            }}
          >
            {image ? (
              <img
                style={{ width: "100%", height: "100%" }}
                src={window.URL.createObjectURL(image)}
                alt={image.name}
              />
            ) : (
              <DropZone.FileUpload />
            )}
          </DropZone>
          <Stack.Item fill>
            <TextField
              multiline
              label="Caption"
              value={imageCaption}
              onChange={(value) => setImageCaption(value)}
              autoComplete="off"
              maxHeight={300}
            />
          </Stack.Item>
        </Stack>
      </Modal.Section>
    </Modal>
  );

  const pageMarkup = (
    <div className="page__wrapper">
      {signUpModal}
      {loginModal}
      {postModal}
      <Page
        title="Posts of the Day"
        primaryAction={
          <Button
            primary
            onClick={() => {
              if(!localStorage.getItem('user')) {
                setLoginModalOpen(true)
              } else {
                setPostModalOpen(true);
              }
            }}
          >
            Post +
          </Button>
        }
      >
        {emptyState ? (
          <EmptyState
            heading="Oops, the space is too crowded~"
            action={{
              content: "Try Again",
              onAction: () => {},
            }}
            image={""}
            fullWidth
          />
        ) : (
          <ResponsiveMasonry>
            {posts &&
              (posts as Post[]).map((post, index) => (
                <MasonryItemImageCard
                  key={post.id}
                  liked={post.liked}
                  explanation={post.caption}
                  media_type={"image"}
                  url={post.image}
                  onLike={() => likedImage(index, post.id)}
                  caption={post.caption}
                />
              ))}
            {getPostsQuery.loading &&
              Array(10)
                .fill(null)
                .map((item, index) => <MasonryItemSkeletonCard key={index} />)}
          </ResponsiveMasonry>
        )}
      </Page>
    </div>
  );

  return (
    <Frame topBar={renderTopbar()}>
      {bannerMarkup}
      {pageMarkup}
    </Frame>
  );
}

export default App;
