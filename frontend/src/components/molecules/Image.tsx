import React from "react";

interface ReactImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    width?: number;
    height?: number;
}

const ReactImage: React.FC<ReactImageProps> = ({
    width,
    height,
    className,
    style,
    ...rest
}) => {
    return (
        <img
            loading='lazy'
            decoding='async'
            width={width}
            height={height}
            className={`object-cover ${className || ""}`}
            style={{ color: "transparent", ...style }}
            {...rest}
        />
    );
};

export default ReactImage;
