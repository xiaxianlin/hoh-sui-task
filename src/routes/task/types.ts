export type ObjectId = string;
export type Address = string;

export type ProfileCreatedData = {
  owner: Address;
  profile: ObjectId;
};

export type Profile = {
  name: string;
  description: string;
};
