import "../styles/TextEditor.css";

import {
  Ban,
  Bold,
  Code,
  Code2,
  CornerDownLeft,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";

import { Color } from "@tiptap/extension-color";
import { Editor } from "@tiptap/react";
import ListItem from "@tiptap/extension-list-item";
import React from "react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";

type Props = {
  setEditorContent: React.Dispatch<React.SetStateAction<string>>;
  editorContent: string;
  setEditorInstance: React.Dispatch<React.SetStateAction<Editor | undefined>>;
};

const TextEditor = ({
  editorContent,
  setEditorContent,
  setEditorInstance,
}: Props) => {
  const MenuBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
      return null;
    }

    return (
      <div className="control-group">
        <div className="button-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
            title="Bold"
          >
            <Bold size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
            title="Italic"
          >
            <Italic size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
            title="Strike"
          >
            <Strikethrough size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active" : ""}
            title="Code"
          >
            <Code size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            title="Clear Marks"
          >
            <Eraser size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().run()}
            title="Clear Nodes"
          >
            <Ban size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "is-active" : ""}
            title="Paragraph"
          >
            <Pilcrow size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
            title="H1"
          >
            <Heading1 size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
            title="H2"
          >
            <Heading2 size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
            title="H3"
          >
            <Heading3 size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={
              editor.isActive("heading", { level: 4 }) ? "is-active" : ""
            }
            title="H4"
          >
            <Heading4 size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={
              editor.isActive("heading", { level: 5 }) ? "is-active" : ""
            }
            title="H5"
          >
            <Heading5 size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={
              editor.isActive("heading", { level: 6 }) ? "is-active" : ""
            }
            title="H6"
          >
            <Heading6 size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
            title="Bullet List"
          >
            <List size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
            title="Ordered List"
          >
            <ListOrdered size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "is-active" : ""}
            title="Code Block"
          >
            <Code2 size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
            title="Blockquote"
          >
            <Quote size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHardBreak().run()}
            title="Hard Break"
          >
            <CornerDownLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title="Undo"
          >
            <Undo size={18} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title="Redo"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>
    );
  };

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
  ];
  return (
    <div className="tiptap-container">
      <div className="tiptap">
        <EditorProvider
          editable
          immediatelyRender={false}
          onUpdate={({ editor }) => {
            setEditorContent(editor.getHTML());
          }}
          onCreate={({ editor }) => {
            setEditorInstance(editor);
          }}
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={editorContent}
        ></EditorProvider>
      </div>
    </div>
  );
};

export default TextEditor;
