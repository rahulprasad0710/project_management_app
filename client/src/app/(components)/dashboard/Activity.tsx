import Image from "next/image";

type ActivityItemProps = {
  avatar: string;
  name: string;
  action: string;
  details?: string;
  post?: string;
  comment?: string;
};

const ActivityItem = ({
  avatar,
  name,
  action,
  details,
  post,
  comment,
}: ActivityItemProps) => (
  <div className="flex cursor-pointer gap-3 rounded-md p-4 py-4 shadow-sm transition-colors duration-200 hover:bg-gray-100">
    <Image
      height={60}
      width={60}
      src={avatar}
      alt={name}
      className="h-10 w-10 rounded-full"
    />
    <div className="flex-1 text-sm text-gray-800">
      <p>
        <span className="font-semibold">{name}</span> {action}{" "}
        {comment && <span className="font-semibold">{comment}</span>}
        {post && (
          <span>
            post in <span className="font-semibold text-blue-600">{post}</span>
          </span>
        )}
      </p>
      {details && (
        <p className="mt-1 text-gray-600 dark:text-gray-400">{details}</p>
      )}
    </div>
  </div>
);

const LatestActivity = () => {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-neutral-200 bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Latest activity
      </h2>

      <div>
        <h3 className="text-md mb-2 font-bold text-gray-700">
          December 16th, 2025
        </h3>
        <ActivityItem
          avatar="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          name="Jese Leos"
          action="likes Bonnie Green's"
          post="How to start with Flowbite library"
          details="I wanted to share a webinar zeroheight."
          comment="Thomas Lean's comment"
        />
        <ActivityItem
          avatar="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          name="Neil Sims"
          action="is requesting access to the Flowbite database."
          comment="Thomas Lean's comment"
        />
        <ActivityItem
          avatar="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          name="Bonnie Green"
          action="react to"
          comment="Thomas Lean's comment"
        />

        <h3 className="text-md mb-2 mt-6 font-bold text-gray-700">
          December 12th, 2025
        </h3>
        <ActivityItem
          avatar="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          name="Lana Byrd"
          action="likes Bonnie Green's"
          post="How to start with Flowbite library"
          details="I wanted to share a webinar zeroheight."
        />
        <ActivityItem
          avatar="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          name="Joseph Mcfall"
          action="removed Lana Byrd account"
        />
        <ActivityItem
          avatar="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          name="Thomas Lean"
          action="likes Bonnie Green's"
          post="How to start with Flowbite library"
          details="I wanted to share a webinar zeroheight."
        />
      </div>
    </div>
  );
};

export default LatestActivity;
