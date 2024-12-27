import { Index, template } from "solid-js/web";
import style from "./.module.css";





export function DraggableList({ list, setList, children }: any) {
  let dragStartIndex: number;
  let dragEndIndex: number;
  const placeholderElement: JSX.Element =   
  <div 
  style={{ height: "50px", "border": "dashed 2px var(--primary-color)" }}></div>;

  const deleteUser = (index: number) => {
    setList((prevList: string[]) => prevList.filter((_, i: number) => i !== index));
  };

  const onDragStart = (index: number, element: HTMLElement) => {
    dragStartIndex = index;
  };

  const onDragOver = (event: DragEvent, index: number) => {
    event.preventDefault(); // Prevent default behavior to allow drop
    dragEndIndex = index;
    // Recreate the placeholder only if not already added
    event.target!.insertAdjacentElement("beforebegin", placeholderElement);
  };

  const onDrop = () => {
    console.log("Dropped at index:", dragEndIndex);
    const reorderedList = [...list()];
    const [draggedItem] = reorderedList.splice(dragStartIndex, 1);
    reorderedList.splice(dragEndIndex, 0, draggedItem); // Insert the item at the new index
    setList(reorderedList);
    placeholderElement.remove();
  };

  // Function to swap items above and below
  const swapItems = (index: number, direction: 'up' | 'down') => {
    const newList = [...list()];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newList.length) {
      const [movedItem] = newList.splice(index, 1);
      newList.splice(targetIndex, 0, movedItem);
      setList(newList);
    }
  };

  // Create controls container
  const controls = (index: number) => (
    <div class={style.controls}>
      <button 
        onClick={() => swapItems(index, 'up')} 
        disabled={index === 0} 
        class={style.controlButton}
      >
        ↑ {/* Up Arrow */}
      </button>
      <button 
        onClick={() => swapItems(index, 'down')} 
        disabled={index === list().length - 1} 
        class={style.controlButton}
      >
        ↓ {/* Down Arrow */}
      </button>
      <button 
        onClick={() => deleteUser(index)} 
        class={style.controlButton}
      >
        Delete
      </button>
    </div>
  );

  return (
    <>
      {list().map((item: string, index: number) => {
        let ref: HTMLDivElement | undefined = undefined;
        return(
          <div
            ref={ref}
            class={style.draggable_item}
            draggable="true"
            style={{transition: "all .3s ease"}}
            onDragStart={() => onDragStart(index, ref!)}
            onDragOver={(event: DragEvent) => onDragOver(event, index)}
            onDrop={onDrop}
            ondragend={() => {
              onDrop();
            }}
            onDragLeave={() => {
              // Clean up placeholder when leaving the drag area
            }}
          >
            {children(item, index, controls(index))}
          </div>
        );
      })}
    </>
  );
}
