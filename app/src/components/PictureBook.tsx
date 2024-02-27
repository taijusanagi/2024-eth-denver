import React, { useMemo, useState } from "react";

export interface PictureBookProps {
  content: string;
  length: number;
}

export const PictureBook: React.FC<PictureBookProps> = ({ content, length }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : pages.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < pages.length - 1 ? prevIndex + 1 : 0));
  };

  const pages = useMemo(() => {
    let result = [];
    for (let i = 0; i < content.length; i += length) {
      result.push(content.substring(i, i + length));
    }
    return result;
  }, [content, length]);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <div className="border rounded-lg p-8 bg-white shadow-lg relative" style={{ minHeight: "60vh" }}>
          <div className="text-lg text-justify leading-relaxed">{pages[currentIndex]}</div>
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={goToPrevious} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Previous
          </button>
          <button onClick={goToNext} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
