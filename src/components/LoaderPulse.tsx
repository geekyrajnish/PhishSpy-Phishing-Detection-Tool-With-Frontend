import React from "react";

interface Props {}

const LoaderPulse: React.FC<Props> = (props) => {
  return (
    <div className={" absolute inset-0 z-50 "}>
      <div className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white left-1/2 top-1/2 animate-pulse"></div>
    </div>
  );
};

LoaderPulse.defaultProps = {
  transparent: false,
};

export default React.memo(LoaderPulse);
