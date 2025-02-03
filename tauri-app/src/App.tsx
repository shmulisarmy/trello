import { createEffect, createSignal, Show } from "solid-js"
import { createMutable, StoreNode } from "solid-js/store"
import styles from "./App.module.css"
import { equations } from "./data/equations"
import { PartialRefactor, Side, Variable } from "./types/side"
import { FocusSpan } from "./components/FocusSpan"



const state: {currentEquation_id: number, currentEquation: {rhs: Side, lhs: Side}|null} = createMutable({currentEquation_id: 0, currentEquation: null})


createEffect(() => {state.currentEquation = createMutable(equations[state.currentEquation_id])})


function Equation_Side_C(props: {side: Side}){
  return(<Expression isFullSide={true} side={() => props.side}/>)
}


function shouldDisplayInReverse(num: number): boolean{
  return (0 < num && num < 1) || (-1 < num && num < 0)


}




function Expression({side, isFullSide}: {isFullSide: boolean, side: () => Side}){

  function Variable_C(){
    return(
      <>
      <Show when={side().variable! && side().variable!.product!=0}>
        
        <FocusSpan>
        <Show when={!shouldDisplayInReverse(side().variable?.product!)} 
        fallback={<span>{side().variable?.letter+"/"+1/side().variable?.product!}</span>}>
          {side().variable!.product != 1 && side().variable!.product}
          {side().variable!.letter}
        </Show>
          <Show when={isFullSide}>

          <Show when={canReduceVaribleProduct(side(), side().variable!)}          >
              <button 
              onclick={
                function(){
                  otherSide(side()).variable!.product-=side().variable!.product
                  side().variable!.product=0
                }
              }
              >reduce product to 0</button>
          </Show>
          <Show when={!canReduceVaribleProduct(side(), side().variable!)}          >
              <button 
              onclick={
                function(){
                  side().variable!.product=0-side().variable!.product
                  otherSide(side()).variable=side().variable!
                  side().variable=null
                }
              }
              >slide variable to other side</button>
          </Show>
              </Show>
              </FocusSpan>
      </Show>
      </>

    )
  }




  function Coefficient_C(){
    return(
      <>
      <Show when={side().coefficient}>
      <FocusSpan>
          {side().coefficient > 0 && side().variable && side().variable!.product? "+ " : ""}
          {side().coefficient}
          <Show when={isFullSide}>

          <button
            onclick={function () {
              reconsileRefactor({
                numberType: "coefficient",
                operation: "-",
                amount: side().coefficient,
                side: side(),
              });
              side().coefficient = 0;
            }}
            >
            refactor away
          </button>
              </Show>
              </FocusSpan>
      </Show>
      <Show when={side().coefficient == 0 && !(side().variable && side().variable!.product)}>
        0
      </Show>
      </>
    )
  }

  return (
    <>
      <Variable_C/>
      <Coefficient_C/>
      <Show when={side().subExpression}>
      <FocusSpan>
      + {side().subExpression.product}(<Expression side={() => side().subExpression}/>)
      {/* <span style={{background: "pink"}}>

{JSON.stringify(side())}
</span> */}
      <button onclick={() => breakSubExpression(side())}>
      breakSubExpression
      </button>
      <button onclick={() => breakSubExpressionByMapping(side())}>
      breakSubExpressionByMapping
      </button>
</FocusSpan>
      </Show>
    </>
  );
}



function otherSide(side: Side): Side{
  return side.side == "left"? state.currentEquation!.rhs: state.currentEquation!.lhs
}


function minusFromSide(side: Side, amount: number){
  // if (side.coefficient){
  side.coefficient-=amount;
  // }
}


function reconsileRefactor(partialRefactor: PartialRefactor){
  console.log(partialRefactor.side)
  const reconsileSide = otherSide(partialRefactor.side)
  if (partialRefactor.numberType == "coefficient"){
    minusFromSide(reconsileSide!, partialRefactor.amount);
  } else if (partialRefactor.numberType == "product"){
    alert("partialRefactor.numberType == product shouldnt be able to happen yet");
    
  }
}


function divideEntireSide(side: Side, divideBy: number){
  if (side.variable){
    side.variable.product/=divideBy
  }
  if (side.coefficient){
    side.coefficient/=divideBy
  }
  if (side.subExpression){
    side.subExpression.product/=divideBy
  }

}


function timesEntireSide(side: Side, timesBy: number){
  if (side.variable){
    side.variable.product*=timesBy
  }
  if (side.coefficient){
    side.coefficient*=timesBy
  }
  if (side.subExpression){
    side.subExpression.product*=timesBy
  }

}


function canReduceVaribleProduct(side: Side, variable: Variable): boolean|null{
  return otherSide(side).variable && otherSide(side).variable!.letter == variable.letter    
}



function breakSubExpression(side: Side){
  console.log(side)
  if (!side.subExpression)return
  if (!(side.subExpression.product == 1)){
    console.error("you cant break a subExpression unless its product is 1");
  }
  side.variable = JSON.parse(JSON.stringify(side.subExpression.variable))
  side.subExpression.variable = null
  side.coefficient += side.subExpression.coefficient
  side.subExpression.coefficient = 0

  delete side.subExpression 
}

function breakSubExpressionByMapping(side: Side){
  console.log(side)
  if (!side.subExpression)return
  side.variable=copyObject(side.subExpression!.variable)
  side.variable!.product*=side.subExpression.product
  side.coefficient += side.subExpression.coefficient*side.subExpression.product

  delete side.subExpression 
}


function copyObject(obj: any){return JSON.parse(JSON.stringify(obj))}


export default function App(){
  let divideInputRef: undefined|HTMLInputElement = undefined
  let timesInputRef: undefined|HTMLInputElement = undefined
  return(
    <>
  {/* <Debug/> */}
  <div id={styles.root}>
    <Equation_Side_C side={state.currentEquation!.lhs}/>
    <span>=</span>
    <Equation_Side_C side={state.currentEquation!.rhs}/>
   
  </div>    



  <form onsubmit={e => e.preventDefault()}>
    divide both sides by <input ref={divideInputRef} type="number" />
    <button onclick={() => {divideEntireSide(state.currentEquation!.lhs, parseInt(divideInputRef!.value)); divideEntireSide(state.currentEquation!.rhs, parseInt(divideInputRef!.value))}}>submit</button>
    </form>
    <form onsubmit={e => e.preventDefault()}>
    times both sides by <input ref={timesInputRef} type="number" />
    <button onclick={() => {timesEntireSide(state.currentEquation!.lhs, parseInt(timesInputRef!.value)); timesEntireSide(state.currentEquation!.rhs, parseInt(timesInputRef!.value))}}>submit</button>
    </form>
    <InfoDisplay/>
    <div class={styles.controls}>
      <button disabled={state.currentEquation_id < 1} class={styles.control} onclick={() => state.currentEquation_id--}>previous question</button>
      <button disabled={state.currentEquation_id > equations.length-2} class={styles.control} onclick={() => state.currentEquation_id++}>next question</button>
    </div>
    </>
  )
}

function Debug(){
  return(
    <div>{JSON.stringify(state)}</div>
  )
}


function InfoDisplay(){
  return(
    <div>Question: {state.currentEquation_id+1}/{equations.length}</div>
  )
}