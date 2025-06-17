"use client";

interface Props {
  setValue: (value: string) => void;
  value: string;
}

import { TextEditor } from "react-tiptap-texteditor";

const RectTextEditor = ({ setValue, value }: Props) => {
  return (
    <TextEditor
      value={value}
      placeholder="Write something..."
      onChange={async (newValue) => {
        setValue(newValue);
      }}
    />
  );
};

export default RectTextEditor;
