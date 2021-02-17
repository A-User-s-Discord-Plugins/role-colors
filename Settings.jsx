import React, { memo } from 'react';
import { SliderInput } from '@vizality/components/settings';
import { SwitchItem } from '@vizality/components/settings';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
    console.log(SliderInput)
    return <>
        <SwitchItem
            children="Colored message texts"
            value={getSetting('messagecolor', true)}
            onChange={() => {
                toggleSetting('messagecolor')
            }}
        />
        {getSetting('messagecolor', true) && <><SliderInput
            asValueChanges={value => updateSetting('messagecolor-color-adjustment', Math.floor(value))}
            initialValue={getSetting('messagecolor-color-adjustment', -30)}
            maxValue={100}
            minValue={-100}
            onValueRender= {e => {
                let value = e.toFixed(0)
                let text = "No change at colors"
                if (value < 0) text = `${Math.abs(value)}% Darker`
                else if (value > 0) text = `${Math.abs(value)}% Lighter`
                return text
            }}
        >Darkness of the color</SliderInput></>}
        <SwitchItem
            children="Colored voice users"
            value={getSetting('voicecolor', true)}
            onChange={() => {
                toggleSetting('voicecolor')
            }}
        />
        <SwitchItem
            children="Colored mentions"
            value={getSetting('mentioncolor', true)}
            onChange={() => {
                toggleSetting('mentioncolor')
            }}
        />
        <SwitchItem
            children="Colored typing indicators"
            value={getSetting('typingcolor', true)}
            onChange={() => {
                toggleSetting('typingcolor')
            }}
        />
    </>
});
