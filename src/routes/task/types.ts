export type ObjectId = string;
export type Address = string;

export type ProfileCreatedData = {
  owner: Address;
  profile: ObjectId;
};

export type Profile = {
  id: {
    id: ObjectId;
  };
  name: string;
  description: string;
  folders: string[];
};

export type Folder = {
  id: {
    id: ObjectId;
  };
  name: string;
  description: string;
};
