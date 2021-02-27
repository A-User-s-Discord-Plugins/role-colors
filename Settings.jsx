import React, { memo } from 'react';
import { SliderInput, SwitchItem, Category, RadioGroup } from '@vizality/components/settings';
import OnOff from "./components/SimpleOnOff"

export default class Settings extends React.PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            generalAdvancedSettings: false
        }
    }

    render () {
        return <>
            <Category
                name={[<OnOff enabled={this.props.getSetting('messagecolor', true)}/>, "Colored message texts"]}
                opened={this.props.getSetting('messagecolor-settings', false)}
                onChange={(e) => this.props.toggleSetting('messagecolor-settings')}
            >
                <SwitchItem
                    children="Enabled"
                    value={this.props.getSetting('messagecolor', true)}
                    onChange={() => {
                        this.props.toggleSetting('messagecolor')
                    }}
                />
                {this.props.getSetting('messagecolor', true) && <SliderInput
                    asValueChanges={value => this.props.updateSetting('messagecolor-color-adjustment', Math.floor(value))}
                    initialValue={this.props.getSetting('messagecolor-color-adjustment', -30)}
                    maxValue={100}
                    minValue={-100}
                    onValueRender={e => {
                        let value = e.toFixed(0)
                        let text = "No change at colors"
                        if (value < 0) text = `${Math.abs(value)}% Darker`
                        else if (value > 0) text = `${Math.abs(value)}% Lighter`
                        return text
                    }}
                >Darkness of the color</SliderInput>}
            </Category>

            <Category
                name={[<OnOff enabled={this.props.getSetting('voicecolor', true)}/>,"Colored voice users"]}
                opened={this.props.getSetting('voicecolor-settings', false)}
                onChange={(e) => this.props.toggleSetting('voicecolor-settings')}
            >
                <SwitchItem
                    children="Enabled"
                    value={this.props.getSetting('voicecolor', true)}
                    onChange={() => {
                        this.props.toggleSetting('voicecolor')
                    }}
                />
            </Category>

            <Category
                name={[<OnOff enabled={this.props.getSetting('mentioncolor', true)}/>,"Colored Colored mentions"]}
                opened={this.props.getSetting('mentioncolor-settings', false)}
                onChange={(e) => this.props.toggleSetting('mentioncolor-settings')}
            >
                <SwitchItem
                    children="Colored mentions"
                    value={this.props.getSetting('mentioncolor', true)}
                    onChange={() => {
                        this.props.toggleSetting('mentioncolor')
                    }}
                />
                {this.props.getSetting('mentioncolor', true) && <>
                    <SwitchItem
                        children="User icon to mention"
                        note="Add the user icon to the mention"
                        value={this.props.getSetting('mentioncolor-icons', false)}
                        onChange={() => {
                            this.props.toggleSetting('mentioncolor-icons')
                        }}
                    />
                    {this.props.getSetting('mentioncolor-icons', false) && <>
                        <SwitchItem
                            children="Remove @"
                            note="Replaces the @ by the mentioned user icon"
                            value={this.props.getSetting('mentioncolor-@', true)}
                            onChange={() => {
                                this.props.toggleSetting('mentioncolor-@')
                            }}
                        />
                        <SwitchItem
                            children="Don't add the icon to yourself"
                            note="Ignores if the pinged user is you"
                            value={this.props.getSetting('mentioncolor-ignore-yourself', true)}
                            onChange={() => {
                                this.props.toggleSetting('mentioncolor-ignore-yourself')
                            }}
                        />
                    </>}
                    <SwitchItem
                        children='Adaptive text color'
                        note={[
                            "For example. it'll be hard ",
                            <span class="mention rolecolors-mention wrapper-3WhCwL mention interactive" tabindex="0" role="button" style={{
                                "--color": "#faff00", "--colorBg": "#faff001a", "--colorBgHover": "#f8fc00", "--colorHover": "#fff",
                            }}>to see this text in hover</span>,
                            ", so this makes ",
                            <span class="mention rolecolors-mention wrapper-3WhCwL mention interactive" tabindex="0" role="button" style={{
                                "--color": "#ccff00", "--colorBg": "#ccff001a", "--colorBgHover": "#cafc00", "--colorHover": "#000",
                            }}>mentions readable in that context</span>
                        ]}
                        value={this.props.getSetting('mentioncolor-auto-colortext', true)}
                        onChange={() => {
                            this.props.toggleSetting('mentioncolor-auto-colortext')
                        }}
                    />
                    <SliderInput
                        asValueChanges={value => this.props.updateSetting('mentioncolor-hover-adjustment', Math.floor(value))}
                        initialValue={this.props.getSetting('mentioncolor-hover-adjustment', -20)}
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
                </>
                }
            </Category>

            <Category
                name={[<OnOff enabled={this.props.getSetting('typingcolor', true)}/>,"Colored typing indicators"]}
                opened={this.props.getSetting('typingcolor-settings', false)}
                onChange={(e) => this.props.toggleSetting('typingcolor-settings')}
            >
                <SwitchItem
                    children="Enabled"
                    value={this.props.getSetting('typingcolor', true)}
                    onChange={() => {
                        this.props.toggleSetting('typingcolor')
                    }}
                />
            </Category>

            <Category
                name={[<OnOff enabled={this.props.getSetting('membergroupcolor', true)}/>,"Colored Members Group"]}
                opened={this.props.getSetting('membergroupcolor-settings', false)}
                onChange={(e) => this.props.toggleSetting('membergroupcolor-settings')}
            >
                <SwitchItem
                    children="Enabled"
                    value={this.props.getSetting('membergroupcolor', true)}
                    onChange={() => {
                        this.props.toggleSetting('membergroupcolor')
                    }}
                />
                {this.props.getSetting('membergroupcolor', true) && <>
                    <RadioGroup
                        options={[
                            { name: "Capitalize", value: "capitalize" },
                            { name: "Lowercase", value: "lowercase" },
                            { name: "Uppercase", value: "uppercase" },
                            { name: "Normal", value: "none" }
                        ]}
                        value={this.props.getSetting('membergroupcolor-text-transform', "uppercase")}
                        onChange={e => {
                            this.props.updateSetting('membergroupcolor-text-transform', e.value)
                        }}
                    > Text transform </RadioGroup>
                    <SwitchItem
                        children="Better design"
                        note="Makes Memeber Groups not feel boring"
                        value={this.props.getSetting('membergroupcolor-design', false)}
                        onChange={() => {
                            this.props.toggleSetting('membergroupcolor-design')
                        }}
                    />
                </>}
            </Category>

            <Category
                name={[<OnOff enabled={this.props.getSetting('userpopoutcolor', true)} />,"Colored Userpopout"]}
                opened={this.props.getSetting('userpopoutcolor-settings', false)}
                onChange={(e) => this.props.toggleSetting('userpopoutcolor-settings')}
            >
                <SwitchItem
                    children="Enabled"
                    value={this.props.getSetting('userpopoutcolor', true)}
                    onChange={() => {
                        this.props.toggleSetting('userpopoutcolor')
                    }}
                />
                {this.props.getSetting('userpopoutcolor', true) && <>
                    <SwitchItem
                        children="Colored Activities"
                        note="Makes activities' background color colored"
                        value={this.props.getSetting('userpopoutcolor-activity', true)}
                        onChange={e => {
                            this.props.toggleSetting('userpopoutcolor-activity')
                            if (e) this.props.updateSetting('userpopoutcolor-ignore-activity', true)
                        }}
                    />

                    {this.props.getSetting('userpopoutcolor-activity', true) && <>
                        <SwitchItem
                            children="Change when spotify"
                            note="Changes the background even if it is playing Spotify"
                            value={!this.props.getSetting('userpopoutcolor-activity-spotify', false)}
                            onChange={e => {
                                this.props.toggleSetting('userpopoutcolor-activity-spotify')
                            }}
                        />
                        <SwitchItem
                            children="Adaptive text color"
                            note="Changes text color to a dark scheme if the role is too bright"
                            value={this.props.getSetting('userpopoutcolor-activity-auto-colortext', true)}
                            onChange={e => {
                                this.props.toggleSetting('userpopoutcolor-activity-auto-colortext')
                            }}
                        />
                    </>}

                    <SwitchItem
                        children="Don't change when having an activity"
                        note="Ignores coloring if there is an activity playing"
                        disabled={this.props.getSetting('userpopoutcolor-activity', true)}
                        value={this.props.getSetting('userpopoutcolor-ignore-activity', true)}
                        onChange={() => {
                            this.props.toggleSetting('userpopoutcolor-ignore-activity')
                        }}
                    />
                </>}
            </Category>



            {/* Advanced general Settings */}
            <br />
            <br />
            <br />
            <br />
            <Category
                name="Advanced general settings"
                description="Pretty advanced settings. I would say to not touch those unless you REALLY know what you're doing"
                opened={this.state.generalAdvancedSettings}
                onChange={(e) => this.setState({ generalAdvancedSettings: e })}
            >
                <SwitchItem
                    children="Debug"
                    note="pelo amor de Deus não trisque nesta opção"
                    value={this.props.getSetting('debug', false)}
                    onChange={() => {
                        this.props.toggleSetting('debug')
                    }}
                />
            </Category>
        </>
    }
}

// export default memo(({ this.props.getSetting, this.props.updateSetting, this.props.toggleSetting }) => {
//     return <>
        
//     </>
// });
