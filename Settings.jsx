import React, { memo } from 'react';
import { SliderInput } from '@vizality/components/settings';
import { SwitchItem } from '@vizality/components/settings';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
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
        {getSetting('mentioncolor', true) && 
        <div className="vz-c-settings-item vz-c-settings-category vertical-V37hAW flex-1O1GKY directionColumn-35P_nr justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6">
            <div className="vz-c-settings-category-inner">
                <SwitchItem
                    children="User icon to mention"
                    note="Add the user icon to the mention"
                    value={getSetting('mentioncolor-icons', false)}
                    onChange={() => {
                        toggleSetting('mentioncolor-icons')
                    }}
                />
                {getSetting('mentioncolor-icons', false) && <SwitchItem
                    children="Remove @"
                    note="Replaces the @ by the mentioned user icon"
                    value={getSetting('mentioncolor-@', true)}
                    onChange={() => {
                        toggleSetting('mentioncolor-@')
                    }}
                />}
                {getSetting('mentioncolor-icons', false) && <SwitchItem
                    children="Don't add the icon to yourself"
                    note="Ignores if the pinged user is you"
                    value={getSetting('mentioncolor-ignore-yourself', true)}
                    onChange={() => {
                        toggleSetting('mentioncolor-ignore-yourself')
                    }}
                />}
                <SliderInput
                    asValueChanges={value => updateSetting('mentioncolor-hover-adjustment', Math.floor(value))}
                    initialValue={getSetting('mentioncolor-hover-adjustment', -20)}
                    maxValue={100}
                    minValue={-100}
                    onValueRender={e => {
                        let value = e.toFixed(0)
                        let text = "No change at colors"
                        if (value < 0) text = `${Math.abs(value)}% Darker`
                        else if (value > 0) text = `${Math.abs(value)}% Lighter`
                        return text
                    }}
                >Darkness of the color (when hovered)</SliderInput>
            </div>
        </div>}


        <SwitchItem
            children="Colored typing indicators"
            value={getSetting('typingcolor', true)}
            onChange={() => {
                toggleSetting('typingcolor')
            }}
        />
    </>
});
