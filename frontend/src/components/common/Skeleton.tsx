import React from "react";

type Props = {
    className?: string;
    width?: string;
    height?: string;
};

const Skeleton = (props: Props) => {
    const { className, width = "100%", height = "20px" } = props;
    return (
        <div className={`skeleton ${className}`} style={{ width, height }}>
            tt
        </div>
    );
};

export default Skeleton;
