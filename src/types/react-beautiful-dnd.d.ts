// src/react-beautiful-dnd.d.ts

declare module 'react-beautiful-dnd' {
    import * as React from 'react';
  
    // Type for DraggableProvided
    export type DraggableProvided = {
        innerRef: React.Ref<HTMLDivElement | HTMLTableRowElement | HTMLTableCellElement>; // Support for div, tr, and th
        draggableProps: React.HTMLProps<HTMLDivElement | HTMLTableRowElement | HTMLTableCellElement>; // Props for div, tr, or th
        dragHandleProps: React.HTMLProps<HTMLDivElement | HTMLTableRowElement | HTMLTableCellElement>; // Props for the drag handle
    };
  
    // Type for DroppableProvided
    export type DroppableProvided = {
        innerRef: React.Ref<HTMLDivElement | HTMLTableRowElement>; // Support for div and tr
        droppableProps: React.HTMLProps<HTMLDivElement | HTMLTableRowElement>; // Props for div or tr
        placeholder?: React.ReactNode; // Optional placeholder property
    };
  
    // Type for DragDropContextProps
    export type DragDropContextProps = {
        onDragEnd: (result: any) => void; // Define a more specific type for the result object if needed
        children: React.ReactNode; // Include children prop
    };
  
    // Define Direction type
    export type Direction = 'horizontal' | 'vertical';
  
    // Updated Droppable type definition to include direction and ref
    export const DragDropContext: React.FC<DragDropContextProps>;
    
    export const Droppable: React.FC<{
        droppableId: string; // Required droppable ID
        direction?: Direction; // Optional direction prop
        children: (provided: DroppableProvided) => React.ReactNode; // Render prop for children
    }>;
  
    // Updated Draggable type definition to include ref
    export const Draggable: React.FC<{
        draggableId: string; // Required draggable ID
        index: number; // Required index
        children: (provided: DraggableProvided) => React.ReactNode; // Render prop for children
    }>;
  }
  