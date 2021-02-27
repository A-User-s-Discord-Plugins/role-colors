import React, { memo } from 'react';

export default memo(({ enabled, className, style }) => {
    return <>
        <span className={"rolecolor-onoff " + (className ? className : "")} enabled={enabled.toString()} style={style} />
    </>;
});
