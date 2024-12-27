
export type ProfileSectionMutable = {
    image: string;
    name: string;
    content: string;
    [key: string]: any;
  };
  
  export type Comment = {
    content: string;
    posted_by: {
      name: string;
      image: string;
    };
    likes?: number;
  };
  
  export type EntireProfile = ProfileSectionMutable & {
    likes: number;
    messages: number;
    last_active: string;
    comments: Comment[];
  };