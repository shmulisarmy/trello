import {Person_T} from '..'

export function InputFieldSync(props: {
  labelType?: string
  type: string
  object: {[key: string]: any}
  field: keyof Person_T
  label?: string
  onInput?: (e: Event) => void
}) {
  return (
    <label class={props.labelType ?? 'block mb-2'}>
      {props.label ?? props.field}:{' '}
      <input
        type={props.type}
        value={props.object[props.field]}
        oninput={e => {
          props.object[props.field] =
            props.type === 'number' ? Number(e.target.value) : e.target.value
          if (props.onInput) {
            props.onInput(e)
          }
        }}
        class="px-2 py-1 border border-gray-200 rounded-md"
        autofocus={true}
      />
    </label>
  )
}
