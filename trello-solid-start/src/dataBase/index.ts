import { neon } from "@neondatabase/serverless";


const DATABASE_URL='postgresql://neondb_owner:FQTNstD9nz2M@ep-still-credit-a4j8av6u.us-east-1.aws.neon.tech/neondb?sslmode=require'
const sql = neon(DATABASE_URL!);


export async function get_boards() {
  "use server"
  const result = (await sql`SELECT * from boards;` as Board_T[]);
  console.log({result});
  return result;
}

export async function get_lists(boardId: number) {
    "use server"
    const result = (await sql`SELECT * from lists where board_id = ${boardId};` as List_T[]);
    console.log({result});
    return result;
  }

  export async function get_tasks(list_ids: number[]) {
    "use server"
    const result = (await sql`SELECT * from tasks where list_id = any((${list_ids}))::Int;` as Task_T[]);
    console.log({result});
    return result;
  }



  


  export async function get_full_board_data(boardId: number): Promise<List_T[]> {
    "use server"
    const lists: List_T[] = (await sql`SELECT * from lists where board_id = ${boardId};` as List_T[]);
    console.log({lists});
    const tasks: Task_T[] = (await sql`SELECT * from tasks where list_id = any((${[0, 1, 2]})::Int[]);` as Task_T[]);
    for (const list of lists) {
      list.tasks = tasks.filter(task => task.list_id === list.id);
    }
    return lists;
  }





  export type Task_T = {
    id: number;
    name: string;
    description: string;
    boardId: number;
    list_id: number;
  }


  export type List_T = {
    id: number;
    name: string;
    boardId: number;
    tasks: Task_T[];
  }

export type Board_T = {
  id: number;
  name: string;
  description: string;
  members: number[] | null;
  lists: number[];

}