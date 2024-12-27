import { createSignal } from "solid-js";
import { onClient } from "~/utils/info";

export function Image_toggler({image_links}: {image_links: string[]}){
    const [imageShowing, setImageShowing] = createSignal(0);
   
    let image_ref: HTMLImageElement | undefined = undefined
    if (onClient) {
      
      setInterval(() => {
        setImageShowing(imageShowing() + 1)
        image_ref!.animate(
          [
            { transform: "scale(.8)", },
            {  },
          ],
          {
            duration: 1000,
            easing: "ease-out",
          }
        )
      }, 5000)
    }
    return (<>
    <img ref={image_ref} style={{"aspect-ratio": "16/9", height: "calc(25vw + 200px)"}} src={image_links[imageShowing() % image_links.length]} alt="" />
    
    </>)
  }