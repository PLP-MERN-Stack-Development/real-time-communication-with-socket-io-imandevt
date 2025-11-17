import React from "react";

/* Simple inline emoji picker — replace with a proper picker lib if desired */
export default function EmojiPicker({ onPick = () => {} }) {
  const emojis = ["👍","❤️","😂","🎉","😮"];
  return (
    <div className="flex gap-1">
      {emojis.map(e => <button key={e} onClick={() => onPick(e)} className="text-lg">{e}</button>)}
    </div>
  );
}
