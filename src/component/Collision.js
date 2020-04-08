import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect } from "react-konva";
 
function rectIntersect(x1, y1, x2, y2) {
 let w1 = 100;
 let h1 = 100;
 let w2 = 100;
 let h2 = 100;
 // Check x and y for overlap
 if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
   return false;
 }
 return true;
}
 
function detectCollision(item, items) {
 let collidingItems = [];
 items.forEach(it => {
   if (rectIntersect(item.target.x(), item.target.y(), it.x, it.y) === true) {
     collidingItems.push(it);
   }
 });
 if (collidingItems.length > 0) {
   collidingItems.push(item);
 }
 return collidingItems;
}
 
function generateItems() {
 const items = [];
 for (let i = 0; i < 10; i++) {
   let color = Konva.Util.getRandomColor();
   items.push({
     x: Math.random() * window.innerWidth,
     y: Math.random() * window.innerHeight,
     id: "node-" + i,
     color: color,
     prevColor: color
   });
 }
 return items;
}
 
class Collision extends Component {
 state = {
   items: generateItems()
 };
 
 handleDragStart = e => {
   const id = e.target.name();
   const items = this.state.items.slice();
   const item = items.find(i => i.id === id);
   const index = items.indexOf(item);
 
   // remove from the list:
   items.splice(index, 1);
 
   // add to the top
   items.push(item);
   this.setState({
     items
   });
   e.target.setAttrs({
     shadowOffset: {
       x: 15,
       y: 15
     },
     scaleX: 1.1,
     scaleY: 1.1
   });
 };
 
 handleonDragEnd = e => {
   const id = e.target.name();
   const items = this.state.items.slice();
   const item = this.state.items.find(i => i.id === id);
   const index = this.state.items.indexOf(item);
   let colliding = detectCollision(e, items);
   if (colliding.length > 0) {
     colliding.push(item);
     colliding.forEach(col => {
       const it = this.state.items.find(i => i.id === col.id);
       const ind = this.state.items.indexOf(it);
       items[ind] = {
         ...it,
         color: "black"
       };
       this.setState({ items });
     });
   }
   items.forEach(item => {
     const it = colliding.find(i => i.id === item.id);
     if (it === -1) {
       const ind = this.state.items.indexOf(it);
       let prev_c = it.prevColor;
       items[ind] = {
         ...it,
         color: prev_c
       };
       this.setState({ items });
     }
   });
   // update item position
   items[index] = {
     ...item,
     x: e.target.x(),
     y: e.target.y()
   };
   this.setState({ items });
 
   e.target.to({
     duration: 0.5,
     easing: Konva.Easings.ElasticEaseOut,
     scaleX: 1,
     scaleY: 1,
     shadowOffsetX: 5,
     shadowOffsetY: 5
   });
 };
 render() {
   // console.log(this.state.items);
 
   return (
     <Stage width={window.innerWidth} height={window.innerHeight}>
       <Layer>
         {this.state.items.map(item => (
           <Rect
             key={item.id}
             name={item.id}
             draggable
             x={item.x}
             y={item.y}
             fill={item.color}
             width={100}
             height={100}
             shadowBlur={10}
             stroke="red"
             strokeWidth={1}
             onDragStart={this.handleDragStart}
             onDragEnd={this.handleonDragEnd}
           />
         ))}
       </Layer>
     </Stage>
   );
 }
}
 export default Collision;

 
