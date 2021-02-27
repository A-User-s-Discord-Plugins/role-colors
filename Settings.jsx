import React, { memo } from 'react';
import { SliderInput, SwitchItem, Category, RadioGroup } from '@vizality/components/settings';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
    return <>
        <SwitchItem
            children="Colored message texts"
            value={getSetting('messagecolor', true)}
            onChange={() => {
                if (!getSetting('messagecolor', true)) updateSetting('messagecolor-advanced-settings', false)
                toggleSetting('messagecolor')
            }}
        />
        {getSetting('messagecolor', true) && 
            <Category
                name="Advanced message settings"
                opened={getSetting('messagecolor-advanced-settings', false)}
                onChange={() => toggleSetting('messagecolor-advanced-settings')}
            >
                <SliderInput
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
                >Darkness of the color</SliderInput>
            </Category>}


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
                if (!getSetting('mentioncolor', true)) updateSetting('mentioncolor-advanced-settings', false)
                toggleSetting('mentioncolor')
            }}
        />
        {getSetting('mentioncolor', true) && 
            <Category
                name="Advanced mention settings"
                opened={getSetting('mentioncolor-advanced-settings', false)}
                onChange={() => toggleSetting('mentioncolor-advanced-settings')}
            >
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
                <SwitchItem
                    children='Auto change color text by checking if the role color is "too dark"'
                    note={[
                        "For example. it'll be hard ",
                        <span class="mention rolecolors-mention wrapper-3WhCwL mention interactive" tabindex="0" role="button" style={{
                            "--color":"#faff00", "--colorBg":"#faff001a", "--colorBgHover":"#f8fc00", "--colorHover":"#fff",
                        }}>to see this text in hover</span>,
                        ", so this makes ",
                        <span class="mention rolecolors-mention wrapper-3WhCwL mention interactive" tabindex="0" role="button" style={{
                            "--color": "#ccff00", "--colorBg": "#ccff001a", "--colorBgHover": "#cafc00", "--colorHover": "#000",
                        }}>mentions readable in that context</span>
                    ]}
                    value={getSetting('mentioncolor-auto-colortext', true)}
                    onChange={() => {
                        toggleSetting('mentioncolor-auto-colortext')
                    }}
                />
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
            </Category>}


        <SwitchItem
            children="Colored typing indicators"
            value={getSetting('typingcolor', true)}
            onChange={() => {
                toggleSetting('typingcolor')
            }}
        />

        <SwitchItem
            children="Colored Members Group"
            value={getSetting('membergroupcolor', true)}
            onChange={() => {
                toggleSetting('membergroupcolor')
            }}
        />

        {getSetting('membergroupcolor', true) &&
            <Category
                name="Advanced member group settings"
                opened={getSetting('membergroupcolor-advanced-settings', false)}
                onChange={() => toggleSetting('membergroupcolor-advanced-settings')}
            >
                <RadioGroup
                    options={[
                        { name: "Capitalize", value: "capitalize" },
                        { name: "Lowercase", value: "lowercase" },
                        { name: "Uppercase", value: "uppercase" },
                        { name: "Normal", value: "none" }
                    ]}
                    value={getSetting('membergroupcolor-text-transform', "uppercase")}
                    onChange={e => {
                        updateSetting('membergroupcolor-text-transform', e.value)
                    }}
                > Text transform </RadioGroup>
                <SwitchItem
                    children="Better design"
                    note="Makes Memeber Groups not feel boring"
                    value={getSetting('membergroupcolor-design', false)}
                    onChange={() => {
                        toggleSetting('membergroupcolor-design')
                    }}
                />
            </Category>}
        <Category
            name="Advanced general settings"
            description="Pretty advanced settings. I would say to not touch those if you REALLY know what you're doing"
            opened={getSetting('general-advanced-settings', false)}
            onChange={() => toggleSetting('general-advanced-settings')}
        >
            <SwitchItem
                children="Debug"
                note="pelo amor de Deus não trisque nesta opção"
                value={getSetting('debug', false)}
                onChange={() => {
                    toggleSetting('debug')
                }}
            />
        </Category>
    </>
});
