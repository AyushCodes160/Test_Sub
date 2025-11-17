import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, onCodeChange, editorRef: externalEditorRef }) {
  const editorRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          indentUnit: 4, // 4 spaces per indent (standard for Python)
          smartIndent: true, // Enable smart indentation
          indentWithTabs: false, // Use spaces instead of tabs
          electricChars: true, // Characters that trigger re-indentation
          matchBrackets: true, // Highlight matching brackets
          tabSize: 4, // Tab size
          lineWrapping: true, // Wrap long lines
        }
      );
      
      // Set up auto-indent on Enter key
      editor.setOption("extraKeys", {
        "Enter": function(cm) {
          // Get current line and cursor position
          const cursor = cm.getCursor();
          const line = cm.getLine(cursor.line);
          
          // Calculate current indentation
          const indentMatch = line.match(/^(\s*)/);
          const currentIndent = indentMatch ? indentMatch[1].length : 0;
          const indentUnit = cm.getOption("indentUnit");
          
          // Check if current line ends with colon (Python) or opening brace
          const shouldIncreaseIndent = /:\s*$/.test(line) || /{\s*$/.test(line);
          
          if (shouldIncreaseIndent) {
            // Insert newline with increased indent
            cm.replaceSelection("\n");
            const newIndent = currentIndent + indentUnit;
            const spaces = " ".repeat(newIndent);
            cm.replaceSelection(spaces);
          } else {
            // Maintain current indentation level
            cm.replaceSelection("\n");
            const spaces = " ".repeat(currentIndent);
            cm.replaceSelection(spaces);
          }
        },
        "Tab": function(cm) {
          // Smart tab - indent if selection, otherwise insert spaces
          if (cm.somethingSelected()) {
            cm.indentSelection("add");
          } else {
            const spaces = " ".repeat(cm.getOption("indentUnit"));
            cm.replaceSelection(spaces);
          }
        },
        "Shift-Tab": function(cm) {
          // Unindent
          cm.indentSelection("subtract");
        }
      });
      // for sync the code
      editorRef.current = editor;
      
      // Expose editor instance to parent if ref is provided
      if (externalEditorRef) {
        externalEditorRef.current = editor;
      }

      editor.setSize(null, "100%");
      editorRef.current.on("change", (instance, changes) => {
        // console.log("changes", instance ,  changes );
        const { origin } = changes;
        const code = instance.getValue(); // code has value which we write
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    };

    init();
  }, []);

  // data receive from server
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && editorRef.current) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.off(ACTIONS.CODE_CHANGE);
        } catch (error) {
          console.error("Error cleaning up socket listener:", error);
        }
      }
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: "600px" }}>
      <textarea id="realtimeEditor"></textarea>
    </div>
  );
}

export default Editor;
