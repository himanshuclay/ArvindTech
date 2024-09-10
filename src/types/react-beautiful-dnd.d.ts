// src/react-beautiful-dnd.d.ts

declare module 'react-beautiful-dnd' {
    import * as React from 'react';
  
    // Type for DraggableProvided
    export type DraggableProvided = {
      innerRef: React.Ref<HTMLDivElement>;
      draggableProps: React.HTMLProps<HTMLDivElement>;
      dragHandleProps: React.HTMLProps<HTMLDivElement>;
    };
  
    // Type for DroppableProvided
    export type DroppableProvided = {
      innerRef: React.Ref<HTMLDivElement>;
      droppableProps: React.HTMLProps<HTMLDivElement>;
      placeholder?: React.ReactNode; // Add the placeholder property
    };
  
    // Type for DragDropContextProps
    export type DragDropContextProps = {
      onDragEnd: (result: any) => void; // You can define a more specific type for the result object
      children: React.ReactNode; // Include children prop
    };
  
    export const DragDropContext: React.FC<DragDropContextProps>;
    export const Droppable: React.FC<{ droppableId: string } & { children: (provided: DroppableProvided) => React.ReactNode }>;
    export const Draggable: React.FC<{ draggableId: string; index: number } & { children: (provided: DraggableProvided) => React.ReactNode }>;
  }
  