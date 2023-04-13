import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";

export function BillList() {
  const { data, isLoading: postsLoading } = api.example.getAll.useQuery();

  if (postsLoading) return <LoadingSpinner />;

  if (!data) return <div>Something went wrong!</div>;

  return (
    <div className="">
      {/* {data?.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id} />
        ))} */}
    </div>
  );
}
