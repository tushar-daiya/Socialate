import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

function User({ volunteer }) {
  return (
    <Card className="p-2">
      <div className="flex gap-4 items-center">
        <Avatar>
          <AvatarImage
            src={
              `https://ui-avatars.com/api/?background=random&name=` +
              volunteer?.user?.fullName
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
          <p>{volunteer?.user?.fullName}</p>
      </div>
    </Card>
  );
}

export default User;
