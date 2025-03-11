import {createMutable} from 'solid-js/store'
import {Person_T} from '..'
import { this_window } from '../../this_window'
import { createEffect, createResource } from 'solid-js'

export const id: number = 46
export const [people, { refetch, mutate }] = createResource<Person_T>(
  async function (){
    return await (await fetch(`http://localhost:8080/db/get_family/${id}`)).json()
  }, 
)





this_window.people = people


export function save_people() {
  localStorage.setItem('people', JSON.stringify(people))
}
