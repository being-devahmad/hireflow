import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Link from '@tiptap/extension-link'

interface JobDescriptionEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
}

const JobDecriptionEditor = ({ field }: JobDescriptionEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 max-w-none dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "",
    immediatelyRender: false,
  });
  return (
    <>
      <div className="w-full">
        <div className="border rounded-lg overflow-hidden bg-card">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
};

export default JobDecriptionEditor;
