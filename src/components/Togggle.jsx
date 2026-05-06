import { useState } from 'react';
import StudentCard from "./StudentCard";

function Toggle() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="sma-toggle">
      <button
        className="sma-btn sma-btn-primary"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide Student Card' : 'Show Student Card'}
      </button>

      {isVisible && <StudentCard />}
    </div>
  );
}

export default Toggle;