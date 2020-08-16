import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    FunctionComponent,
    MouseEvent
} from "react"
import {
    useAudioPlayer,
    useAudioPosition,
    useAudioEvents
} from "react-use-audio-player"
import "./AudioSeekBar.scss"

interface AudioSeekBarProps {
    className?: string
}

export const AudioSeekBar: FunctionComponent<AudioSeekBarProps> = props => {
    const { className = "" } = props
    const { position, duration, seek } = useAudioPosition({
        highRefreshRate: true
    })

    const registerEvents = useAudioEvents()

    const events1 = [
        { position: 0, name: "event1" },
        { position: 2, name: "event2" },
        { position: 3, name: "event3" }
    ]

    const events2 = [
        { position: 1, name: "event21" },
        { position: 3, name: "event22" },
        { position: 4, name: "event23" }
    ]
    registerEvents({
        events: events1,
        callback: event => {
            console.log("Event type 1!", event)
        }
    })

    registerEvents({
        events: events2,
        callback: event => {
            console.log("Event type 2!", event)
        }
    })

    const { playing } = useAudioPlayer()
    const [barWidth, setBarWidth] = useState("0%")

    const seekBarElem = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const width = ((position / duration) * 100 || 0) + "%"
        setBarWidth(width)
    }, [position, duration])

    const goTo = useCallback(
        (event: MouseEvent) => {
            const { pageX: eventOffsetX } = event

            if (seekBarElem.current) {
                const elementOffsetX = seekBarElem.current.offsetLeft
                const elementWidth = seekBarElem.current.clientWidth
                const percent = (eventOffsetX - elementOffsetX) / elementWidth
                seek(percent * duration)
            }
        },
        [duration, playing, seek]
    )

    return (
        <div
            className={`audioSeekBar ${className} `}
            ref={seekBarElem}
            onClick={goTo}
        >
            <div style={{ width: barWidth }} className="audioSeekBar__tick" />
        </div>
    )
}
