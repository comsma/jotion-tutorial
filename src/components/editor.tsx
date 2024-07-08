"use client";

import React from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useTheme } from "next-themes";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}
const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  const { edgestore } = useEdgeStore();

  return (
    <div>
      <BlockNoteView
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editor={editor}
        onChange={() => {
          onChange(JSON.stringify(editor.document));
        }}
      />
    </div>
  );
};

export default Editor;
