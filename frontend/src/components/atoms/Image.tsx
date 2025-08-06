import React from "react";

type ImageProps = {
    src: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
};

const Image: React.FC<ImageProps> = ({
    src,
    alt = "",
    title = "",
    width,
    height,
    className = "",
    style = {},
}) => {
    const computedStyle: React.CSSProperties = {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        objectFit: "cover",
        ...style,
    };

    return (
        <img
            src={src}
            alt={alt}
            title={title}
            style={computedStyle}
            className={className}
            loading='lazy'
        />
    );
};

export default Image;
