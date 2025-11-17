import React from "react";

/* small component showing typing users */
export default function TypingIndicator({ typingUsers = [] }) {
  if (!typingUsers || typingUsers.length === 0) return null;
  return (
    <div className="text-sm text-gray-500 px-4 py-2">
      {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
    </div>
  );
}
