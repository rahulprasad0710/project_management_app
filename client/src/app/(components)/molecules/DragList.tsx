import React, { useState } from "react";

type Props = {};

const DragList = (props: Props) => {
  const [items, setItems] = useState([
    "First Item",
    "Second Item",
    "Third Item",
    "Fourth Item",
  ]);

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragEnter = (index) => {
    if (index === dragIndex) return;
    if (index == null) return;

    const newItems = [...items];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDragIndex(index);
    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Drag and Drop List
      </h2>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            className="cursor-move rounded-lg bg-white p-4 shadow transition hover:bg-gray-100"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DragList;
