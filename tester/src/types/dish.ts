export type Dish = {
  id: number,
  name: string,
  ingredients: Record<string, number>,
  time_to_make: number,
  image_url: string,
  is_liked: number,
  message?: string
};
